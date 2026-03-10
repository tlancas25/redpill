const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

// Real products with Firebase Storage download URLs
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
    downloadUrl: null, // Coming soon
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agent-security-field-guide',
    title: 'Agent Security Field Guide',
    slug: 'agent-security-field-guide',
    description: 'A practical guide to securing your AI agents. Threat models, shadow IT audits, and weekly security rituals. 45 pages of actionable security protocols.',
    shortDescription: 'Threat models, audits, and weekly security rituals.',
    price: 2700,
    salePrice: null,
    category: 'Cybersecurity',
    type: 'ebook',
    images: ['/images/products/agent-security.jpg'],
    curriculum: [],
    stripePriceId: 'price_1T9DntRpLFWUKDnHsZ7cKk83',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/redpillreader-249ec.firebasestorage.app/o/dowloads%2FAgent_Security_Field_Guide_OpenClaw.pdf?alt=media&token=4f7c3f4b-1db0-4d15-835c-e1b8501a76e5',
    fileName: 'Agent_Security_Field_Guide_OpenClaw.pdf',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'trading-bot-blueprint',
    title: 'Trading Bot Blueprint',
    slug: 'trading-bot-blueprint',
    description: 'Build automated trading bots with Alpaca and OpenClaw. 49-page blueprint plus complete Dominator Trader agent skill. Paper trading enforced.',
    shortDescription: '49-page blueprint + Dominator Trader agent skill.',
    price: 9700,
    salePrice: null,
    category: 'Finance & Trading',
    type: 'course',
    images: ['/images/products/trading-bot.jpg'],
    curriculum: [
      { title: 'Dominator Architecture', duration: 25 },
      { title: '7-Engine System Design', duration: 35 },
      { title: 'Risk Management & Kill Switches', duration: 50 },
      { title: 'Paper Trading Phase', duration: 40 },
      { title: 'Live Deployment Checklist', duration: 30 },
    ],
    stripePriceId: 'price_1T9DnuRpLFWUKDnHT4WjjoZn',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/redpillreader-249ec.firebasestorage.app/o/dowloads%2FTrading_Bot_Blueprint_OpenClaw.pdf?alt=media&token=47589418-e11a-4a3b-af89-10b416a0caa5',
    skillUrl: 'https://firebasestorage.googleapis.com/v0/b/redpillreader-249ec.firebasestorage.app/o/dowloads%2FTrading_Bot_Blueprint_OpenClaw_SKILL.zip?alt=media&token=b1c6459b-939d-430e-8e86-d5124227b590',
    fileName: 'Trading_Bot_Blueprint_OpenClaw.pdf',
    skillFileName: 'Trading_Bot_Blueprint_OpenClaw_SKILL.zip',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'x-monetization-system',
    title: 'X Monetization System',
    slug: 'x-monetization-system',
    description: 'Turn your X following into revenue. Content systems, product creation, and Stripe integration for sustainable income without viral lottery.',
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
    downloadUrl: null, // Coming soon
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

// POST /api/products/:id/download - Generate download link for purchaser
router.post('/:id/download', async (req, res) => {
  const { id } = req.params;
  const { userId, orderId } = req.body;

  try {
    // Verify purchase exists
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderDoc.data();
    if (order.userId !== userId || order.status !== 'completed') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.downloadUrl) {
      return res.status(404).json({ error: 'Download not available yet' });
    }

    // Log download
    await db.collection('downloads').add({
      userId,
      orderId,
      productId: id,
      downloadedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      downloadUrl: product.downloadUrl,
      skillUrl: product.skillUrl || null,
      fileName: product.fileName,
      skillFileName: product.skillFileName || null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to generate download' });
  }
});

// GET /api/products - Get all products
router.get('/', (req, res) => {
  // Return products without download URLs (public info only)
  const publicProducts = products.map(p => ({
    ...p,
    downloadUrl: undefined,
    skillUrl: undefined,
  }));
  
  res.json({ 
    products: publicProducts,
    count: products.length 
  });
});

// GET /api/products/featured - Get featured products
router.get('/featured', (req, res) => {
  const featured = products.filter(p => p.featured);
  const publicProducts = featured.map(p => ({
    ...p,
    downloadUrl: undefined,
    skillUrl: undefined,
  }));
  
  res.json({ products: publicProducts });
});

// GET /api/products/:id - Get product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Return without download URLs
  const { downloadUrl, skillUrl, ...publicProduct } = product;
  res.json({ product: publicProduct });
});

// GET /api/products/slug/:slug - Get product by slug
router.get('/slug/:slug', (req, res) => {
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { downloadUrl, skillUrl, ...publicProduct } = product;
  res.json({ product: publicProduct });
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', (req, res) => {
  const filtered = products.filter(p => p.category === req.params.category);
  const publicProducts = filtered.map(p => ({
    ...p,
    downloadUrl: undefined,
    skillUrl: undefined,
  }));
  
  res.json({ products: publicProducts });
});

module.exports = router;
