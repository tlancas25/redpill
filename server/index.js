const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const admin = require('firebase-admin');
const Stripe = require('stripe');

// Initialize Firebase Admin once across route/module imports
if (!admin.apps.length) {
  admin.initializeApp();
}

const sessionSecret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
const db = admin.firestore();

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getStripeWebhookSecrets = () => {
  const configuredSecrets = [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_SNAPSHOT,
    process.env.STRIPE_WEBHOOK_SECRET_THIN,
    ...(process.env.STRIPE_WEBHOOK_SECRETS || '')
      .split(/[\s,]+/)
      .filter(Boolean),
  ].filter(Boolean);

  return [...new Set(configuredSecrets)];
};

const constructStripeEvent = (payload, signature) => {
  if (!signature) {
    throw new Error('Missing Stripe signature header');
  }

  const webhookSecrets = getStripeWebhookSecrets();
  if (webhookSecrets.length === 0) {
    throw new Error('Stripe webhook secret is not configured');
  }

  const stripe = getStripeClient();
  let lastError;

  for (const secret of webhookSecrets) {
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to verify Stripe webhook signature');
};

const findOrderByPaymentIntentId = async (paymentIntentId) => {
  const snapshot = await db
    .collection('orders')
    .where('stripePaymentIntentId', '==', paymentIntentId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0];
};

const upsertOrderFromPaymentIntent = async (paymentIntent, status, event) => {
  const existingOrder = await findOrderByPaymentIntentId(paymentIntent.id);
  const customerName = paymentIntent.shipping?.name
    || paymentIntent.metadata?.customerName
    || null;
  const customerEmail = paymentIntent.receipt_email
    || paymentIntent.metadata?.customerEmail
    || null;
  const amountValue = typeof paymentIntent.amount_received === 'number' && paymentIntent.amount_received > 0
    ? paymentIntent.amount_received
    : paymentIntent.amount;

  const orderRecord = {
    status,
    stripePaymentIntentId: paymentIntent.id,
    stripeChargeId: paymentIntent.latest_charge || null,
    customerEmail,
    customerName,
    subtotal: amountValue / 100,
    tax: 0,
    total: amountValue / 100,
    stripeLastEventId: event.id,
    stripeLastEventType: event.type,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (existingOrder) {
    await existingOrder.ref.set(orderRecord, { merge: true });
    return existingOrder.id;
  }

  const orderRef = await db.collection('orders').add({
    ...orderRecord,
    items: [],
    userId: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return orderRef.id;
};

if (!sessionSecret) {
  logger.warn('SESSION_SECRET or JWT_SECRET is not configured. Falling back to a development-only session secret.');
}

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://www.redpillreader.com',
    'https://redpillreader.com',
    'http://localhost:3000',
    'http://localhost:5000',
  ],
  credentials: true,
}));

// Stripe webhook must receive the raw request body for signature verification.
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = constructStripeEvent(req.body, req.headers['stripe-signature']);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await upsertOrderFromPaymentIntent(event.data.object, 'completed', event);
        break;
      case 'payment_intent.payment_failed':
        await upsertOrderFromPaymentIntent(event.data.object, 'payment_failed', event);
        break;
      case 'charge.refunded': {
        const charge = event.data.object;
        if (charge.payment_intent) {
          const existingOrder = await findOrderByPaymentIntentId(charge.payment_intent);
          if (existingOrder) {
            await existingOrder.ref.set({
              status: 'refunded',
              stripeLastEventId: event.id,
              stripeLastEventType: event.type,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
          }
        }
        break;
      }
      default:
        logger.info('Unhandled Stripe webhook event', { eventType: event.type, eventId: event.id });
        break;
    }

    return res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook verification failed', { error: error.message });
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.use(express.json());

// Session for Passport
app.use(session({
  secret: sessionSecret || 'development-only-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: 'production'
  });
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/blog', require('./routes/blog'));
app.use('/courses', require('./routes/courses'));
app.use('/orders', require('./routes/orders'));
app.use('/contact', require('./routes/contact'));
app.use('/search', require('./routes/search'));

// Export the Express app as a Firebase Cloud Function
exports.api = onRequest({
  cors: [
    'https://www.redpillreader.com',
    'https://redpillreader.com',
    'http://localhost:3000',
    'http://localhost:5000',
  ],
  maxInstances: 10,
  timeoutSeconds: 30,
  memory: '256MiB',
}, app);
