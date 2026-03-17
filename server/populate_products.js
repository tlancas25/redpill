const admin = require('firebase-admin');

// Ensure you set GOOGLE_APPLICATION_CREDENTIALS
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Please set GOOGLE_APPLICATION_CREDENTIALS');
  process.exit(1);
}

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'redpillreader-249ec'
});

const db = admin.firestore();

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
    images: ['/images/products/openclaw-masterclass.png'],
    curriculum: [
      {title: 'Module 1: WTF is an Agent?', duration: 20},
      {title: 'Module 2: OpenClaw Setup from Zero', duration: 45},
      {title: 'Module 3: First Skill - Weather Bot', duration: 30},
      {title: 'Module 4: Security - Don\'t Get Pwned', duration: 35},
      {title: 'Module 5: Deploy to X - Be Your Own Bot', duration: 40},
    ],
    stripePriceId: 'price_1T9DnSRpLFWUKDnHi3HELdZo',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    images: ['/images/products/agent-security-field-guide.png'],
    curriculum: [],
    stripePriceId: 'price_1T9DntRpLFWUKDnHsZ7cKk83',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    images: ['/images/products/trading-bot-blueprint.png'],
    curriculum: [
      {title: 'Market Making vs Directional', duration: 25},
      {title: 'Alpaca Setup + Paper Trading', duration: 35},
      {title: 'Mean Reversion Bot Build', duration: 50},
      {title: 'Risk Management Systems', duration: 40},
      {title: 'Live Deploy Psychology', duration: 30},
    ],
    stripePriceId: 'price_1T9DnuRpLFWUKDnHT4WjjoZn',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    images: ['/images/products/x-monetization-system.png'],
    curriculum: [
      {title: 'Audience Building 0 to 1K', duration: 30},
      {title: 'Content Systems That Work', duration: 35},
      {title: 'Product Creation Framework', duration: 40},
      {title: 'Stripe Integration Guide', duration: 45},
      {title: 'Automation & Analytics', duration: 25},
    ],
    stripePriceId: 'price_1T9DnuRpLFWUKDnHzY6OZ0zG',
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function main() {
  console.log('Creating products in Firestore...\n');
  for (const product of products) {
    try {
      await db.collection('products').doc(product.id).set(product);
      console.log(`✅ ${product.title}`);
      console.log(`   Price: $${(product.price / 100).toFixed(2)}`);
      console.log(`   Stripe: ${product.stripePriceId}\n`);
    } catch (err) {
      console.error(`❌ Failed to create ${product.title}:`, err);
    }
  }
  console.log('All products created successfully!');
  process.exit(0);
}

main();