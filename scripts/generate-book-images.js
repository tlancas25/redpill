/**
 * Generate placeholder images for RedPillReader products.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Product definitions
const products = [
  { slug: 'openclaw-masterclass', filename: 'openclaw-masterclass.png' },
  { slug: 'agent-security-field-guide', filename: 'agent-security-field-guide.png' },
  { slug: 'trading-bot-blueprint', filename: 'trading-bot-blueprint.png' },
  { slug: 'x-monetization-system', filename: 'x-monetization-system.png' },
];

async function generateImage(product, index) {
  console.log(`\n[${product.slug}] Generating image...`);
  // Use picsum.photos for placeholders
  const url = `https://picsum.photos/seed/${product.slug}/500/700`;
  
  return downloadImage(url, path.join(OUTPUT_DIR, product.filename));
}

/**
 * Download image from URL to file
 */
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : require('http');
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(outputPath, buffer);
        console.log(`[Downloaded] ${outputPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
        resolve(outputPath);
      });
      res.on('error', reject);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('=== RedPillReader Product Image Generator ===');
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Products: ${products.length}`);

  let success = 0;
  let failed = 0;

  for (const product of products) {
    try {
      await generateImage(product);
      success++;
    } catch (err) {
      console.error(`[${product.slug}] FAILED: ${err.message}`);
      failed++;
    }

    // Rate limit: wait 2s between requests
    if (products.indexOf(product) < products.length - 1) {
      console.log('Waiting 2s...');
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n=== Done: ${success} generated, ${failed} failed ===`);

  if (success > 0) {
    console.log('\nNext steps:');
    console.log('1. Check images in public/images/products/');
    console.log('2. Update your product data in Firestore to set the images field:');
    products.forEach((p) => {
      console.log(`   ${p.slug} → /images/products/${p.filename}`);
    });
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
