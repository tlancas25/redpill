const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

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
    title: 'The X Monetization System',
    slug: 'x-monetization-system',
    description: '3 production AI agent skill packs for OpenClaw — Social Media Monetization, Real Estate Agent, and Small Business Competitive Edge. Includes the complete strategy book, 18 Python scripts, automation pipelines, and config templates. Turn any niche into automated revenue with battle-tested playbooks.',
    shortDescription: '3 AI agent skill packs. 18 scripts. Automated revenue.',
    price: 9700,
    salePrice: null,
    category: 'AI & Automation',
    type: 'bundle',
    images: ['/images/products/x-monetization-system.jpg'],
    curriculum: [
      { title: 'The OpenClaw Foundation', duration: 30 },
      { title: 'Social Media Monetization — 7 Scripts', duration: 60 },
      { title: 'Real Estate Agent — 5 Scripts', duration: 50 },
      { title: 'Small Business Edge — 6 Scripts', duration: 45 },
      { title: 'Automation Pipelines & Deployment', duration: 35 },
    ],
    stripePriceId: 'price_1TBNMgRpLFWUKDnHpqgu5chY',
    downloadUrl: null, // Upload to Firebase Storage
    skillUrl: null, // Upload to Firebase Storage
    fileName: 'The_X_Monetization_System.md',
    skillFileName: 'x-monetization-system-skills.zip',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

const toIsoString = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  return null;
};

const toNumber = (value, fallback = 0) => {
  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const centsToDollars = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  return toNumber(value) / 100;
};

const normalizeProduct = (product, docId) => ({
  id: product.id || docId,
  title: product.title || '',
  slug: product.slug || docId,
  description: product.description || '',
  shortDescription: product.shortDescription || '',
  price: toNumber(product.price),
  salePrice: product.salePrice === null || product.salePrice === undefined ? null : toNumber(product.salePrice),
  category: product.category || 'Uncategorized',
  type: product.type || 'ebook',
  images: Array.isArray(product.images) ? product.images : [],
  curriculum: Array.isArray(product.curriculum) ? product.curriculum : [],
  stripePriceId: product.stripePriceId || null,
  downloadUrl: product.downloadUrl || null,
  skillUrl: product.skillUrl || null,
  fileName: product.fileName || null,
  skillFileName: product.skillFileName || null,
  rating: typeof product.rating === 'number' ? product.rating : Number(product.rating || 0),
  reviewCount: typeof product.reviewCount === 'number' ? product.reviewCount : Number(product.reviewCount || 0),
  featured: Boolean(product.featured),
  createdAt: toIsoString(product.createdAt) || new Date().toISOString(),
  updatedAt: toIsoString(product.updatedAt) || toIsoString(product.createdAt) || new Date().toISOString(),
});

const sanitizePublicProduct = (product) => ({
  ...product,
  price: centsToDollars(product.price),
  salePrice: centsToDollars(product.salePrice),
  downloadUrl: undefined,
  skillUrl: undefined,
});

const getProductsCollectionSnapshot = async () => {
  const snapshot = await db.collection('products').get();
  return snapshot.docs.map((doc) => normalizeProduct(doc.data(), doc.id));
};

const getAllProducts = async () => {
  try {
    const firestoreProducts = await getProductsCollectionSnapshot();
    if (firestoreProducts.length > 0) {
      return firestoreProducts;
    }
  } catch (error) {
    console.error('Failed to load products from Firestore, using fallback data:', error);
  }

  return products;
};

const getProductById = async (id) => {
  try {
    const doc = await db.collection('products').doc(id).get();
    if (doc.exists) {
      return normalizeProduct(doc.data(), doc.id);
    }

    const snapshot = await db.collection('products').where('id', '==', id).limit(1).get();
    if (!snapshot.empty) {
      const match = snapshot.docs[0];
      return normalizeProduct(match.data(), match.id);
    }
  } catch (error) {
    console.error(`Failed to load product ${id} from Firestore, using fallback data:`, error);
  }

  return products.find((product) => product.id === id) || null;
};

const getProductBySlug = async (slug) => {
  try {
    const snapshot = await db.collection('products').where('slug', '==', slug).limit(1).get();
    if (!snapshot.empty) {
      const match = snapshot.docs[0];
      return normalizeProduct(match.data(), match.id);
    }
  } catch (error) {
    console.error(`Failed to load product slug ${slug} from Firestore, using fallback data:`, error);
  }

  return products.find((product) => product.slug === slug) || null;
};

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

    const product = await getProductById(id);
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
router.get('/', async (req, res) => {
  const loadedProducts = await getAllProducts();
  const publicProducts = loadedProducts.map(sanitizePublicProduct);

  res.json({
    products: publicProducts,
    count: publicProducts.length,
  });
});

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  const loadedProducts = await getAllProducts();
  const publicProducts = loadedProducts
    .filter((product) => product.featured)
    .map(sanitizePublicProduct);

  res.json({ products: publicProducts });
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const publicProduct = sanitizePublicProduct(product);
  res.json({ product: publicProduct });
});

// GET /api/products/slug/:slug - Get product by slug
router.get('/slug/:slug', async (req, res) => {
  const product = await getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const publicProduct = sanitizePublicProduct(product);
  res.json({ product: publicProduct });
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', async (req, res) => {
  const loadedProducts = await getAllProducts();
  const publicProducts = loadedProducts
    .filter((product) => product.category === req.params.category)
    .map(sanitizePublicProduct);

  res.json({ products: publicProducts });
});

module.exports = router;
