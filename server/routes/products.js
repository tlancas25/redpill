const express = require('express');
const router = express.Router();

// Real products data (Stripe connected)
const products = [
  {
    id: 'openclaw-masterclass',
    title: 'OpenClaw Masterclass',
    slug: 'openclaw-masterclass',
    description: 'Learn to build and deploy AI agents with OpenClaw. From setup to your first live skill. Complete course with video modules and PDF workbook.',
    shortDescription: 'Build AI agents. From zero to deployed in 5 modules.',
    price: 4900,
    salePrice: null,
    category: 'Tech & Development',
    type: 'course',
    images: ['/images/products/openclaw-masterclass.jpg'],
    curriculum: [
      { title: 'Module 1: WTF is an Agent?', duration: 20 },
      { title: 'Module 2: OpenClaw Setup from Zero', duration: 45 },
      { title: 'Module 3: First Skill - Weather Bot', duration: 30 },
      { title: 'Module 4: Security - Don\'t Get Pwned', duration: 35 },
      { title: 'Module 5: Deploy to X - Be Your Own Bot', duration: 40 },
    ],
    stripePriceId: 'price_1T9DnSRpLFWUKDnHi3HELdZo',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agent-security-field-guide',
    title: 'Agent Security Field Guide',
    slug: 'agent-security-field-guide',
    description: 'A practical guide to securing your AI agents. Threat models, audits, and weekly rituals to keep your operations safe.',
    shortDescription: 'Threat models, audits, and weekly security rituals.',
    price: 2700,
    salePrice: null,
    category: 'Cybersecurity',
    type: 'ebook',
    images: ['/images/products/agent-security.jpg'],
    curriculum: [],
    stripePriceId: 'price_1T9DntRpLFWUKDnHsZ7cKk83',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'trading-bot-blueprint',
    title: 'Trading Bot Blueprint',
    slug: 'trading-bot-blueprint',
    description: 'Build automated trading bots with Alpaca. From paper trading to live deployment with proper risk management.',
    shortDescription: 'Build trading bots. Paper to live with risk controls.',
    price: 9700,
    salePrice: null,
    category: 'Finance & Trading',
    type: 'course',
    images: ['/images/products/trading-bot.jpg'],
    curriculum: [
      { title: 'Market Making vs Directional', duration: 25 },
      { title: 'Alpaca Setup + Paper Trading', duration: 35 },
      { title: 'Mean Reversion Bot Build', duration: 50 },
      { title: 'Risk Management Systems', duration: 40 },
      { title: 'Live Deploy Psychology', duration: 30 },
    ],
    stripePriceId: 'price_1T9DnuRpLFWUKDnHT4WjjoZn',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'x-monetization-system',
    title: 'X Monetization System',
    slug: 'x-monetization-system',
    description: 'Turn your X following into revenue. Content systems, product creation, and Stripe integration for sustainable income.',
    shortDescription: 'Content → Cash. No viral lottery required.',
    price: 6700,
    salePrice: null,
    category: 'Business & Marketing',
    type: 'course',
    images: ['/images/products/x-monetization.jpg'],
    curriculum: [
      { title: 'Audience Building 0 to 1K', duration: 30 },
      { title: 'Content Systems That Work', duration: 35 },
      { title: 'Product Creation Framework', duration: 40 },
      { title: 'Stripe Integration Guide', duration: 45 },
      { title: 'Automation & Analytics', duration: 25 },
    ],
    stripePriceId: 'price_1T9DnuRpLFWUKDnHzY6OZ0zG',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

// GET /api/products - Get all products
router.get('/', (req, res) => {
  res.json({ 
    products,
    count: products.length 
  });
});

// GET /api/products/featured - Get featured products
router.get('/featured', (req, res) => {
  const featured = products.filter(p => p.featured);
  res.json({ products: featured });
});

// GET /api/products/:id - Get product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// GET /api/products/slug/:slug - Get product by slug
router.get('/slug/:slug', (req, res) => {
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', (req, res) => {
  const filtered = products.filter(p => p.category === req.params.category);
  res.json({ products: filtered });
});

module.exports = router;
