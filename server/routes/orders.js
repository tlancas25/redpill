const express = require('express');
const admin = require('firebase-admin');
const Stripe = require('stripe');

const router = express.Router();

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// POST /api/orders/create-payment-intent - Create Stripe payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive integer in cents' });
    }

    const stripe = getStripeClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to create payment intent' });
  }
});

// POST /api/orders - Create order
router.post('/', async (req, res) => {
  try {
    const { paymentIntentId, items = [], subtotal = 0, tax = 0, total = 0, customer = {}, userId = null } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'paymentIntentId is required' });
    }

    const stripe = getStripeClient();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment intent has not succeeded' });
    }

    const orderRecord = {
      userId,
      items,
      subtotal,
      tax,
      total,
      status: 'completed',
      stripePaymentIntentId: paymentIntent.id,
      stripeChargeId: paymentIntent.latest_charge || null,
      customerEmail: customer.email || paymentIntent.receipt_email || null,
      customerName: customer.name || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const orderRef = await db.collection('orders').add(orderRecord);
    return res.status(201).json({ message: 'Order created', orderId: orderRef.id });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Order creation failed' });
  }
});

// GET /api/orders/me - Get user's orders
router.get('/me', (req, res) => {
  res.json({ orders: [] });
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', (req, res) => {
  res.json({ order: null });
});

module.exports = router;
