const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const admin = require('firebase-admin');

// Initialize Firebase Admin once across route/module imports
if (!admin.apps.length) {
  admin.initializeApp();
}

const sessionSecret = process.env.SESSION_SECRET || process.env.JWT_SECRET;

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

// Stripe webhook (raw body needed)
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // TODO: Implement Stripe webhook handler
  logger.info('Webhook received', { body: req.body });
  res.json({ received: true });
});

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
