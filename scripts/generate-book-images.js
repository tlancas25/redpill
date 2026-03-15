/**
 * Generate 3D book mockup images for RedPillReader products using xAI Grok API.
 *
 * Usage: node scripts/generate-book-images.js
 *
 * Requires XAI_API_KEY in .env file.
 * Images are saved to public/images/products/
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

const XAI_API_KEY = process.env.XAI_API_KEY;

if (!XAI_API_KEY) {
  console.error('[ERROR] XAI_API_KEY not found in .env file.');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Product definitions with tailored image prompts
const products = [
  {
    slug: 'openclaw-masterclass',
    filename: 'openclaw-masterclass.png',
    prompt:
      'A premium 3D book mockup floating at a slight angle on a dark matte background. ' +
      'The book cover is sleek black with neon green circuit board patterns and a glowing AI brain icon. ' +
      'Title text "OpenClaw Masterclass" in bold futuristic font. Subtitle "Build AI Agents" in smaller text. ' +
      'Professional product photography style, dramatic lighting, soft shadows, 4K quality. ' +
      'The book appears premium and tech-forward, like a high-end tech course cover.',
  },
  {
    slug: 'agent-security-field-guide',
    filename: 'agent-security-field-guide.png',
    prompt:
      'A premium 3D eBook mockup floating at a slight angle on a dark matte background. ' +
      'The cover is dark navy blue with a red glowing shield icon and digital lock symbol. ' +
      'Matrix-style falling code in the background of the cover. ' +
      'Title "Agent Security Field Guide" in sharp white military-style font. ' +
      'Subtitle "Threat Models & Audits" in red accent text. ' +
      'Professional product photography, dramatic side lighting, soft reflections, 4K quality. ' +
      'Looks like a classified cybersecurity manual.',
  },
  {
    slug: 'trading-bot-blueprint',
    filename: 'trading-bot-blueprint.png',
    prompt:
      'A premium 3D book mockup floating at a slight angle on a dark matte background. ' +
      'The cover features a dark charcoal background with gold and green candlestick chart patterns. ' +
      'A robotic arm or bot icon overlaid on trading charts. ' +
      'Title "Trading Bot Blueprint" in bold gold metallic font. ' +
      'Subtitle "Dominator Trader System" in green accent text. ' +
      'Professional product photography style, dramatic lighting with gold reflections, 4K quality. ' +
      'Conveys wealth, automation, and financial technology.',
  },
  {
    slug: 'x-monetization-system',
    filename: 'x-monetization-system.png',
    prompt:
      'A premium 3D book mockup floating at a slight angle on a dark matte background. ' +
      'The book is thick, conveying a comprehensive bundle. The cover is matte black with ' +
      'three glowing neon icons stacked vertically: a social media icon in electric blue, ' +
      'a house/real estate icon in green, and a storefront/business icon in gold. ' +
      'Subtle circuit board patterns connect all three icons. ' +
      'Title "The X Monetization System" in bold clean white font at the top. ' +
      'Subtitle "3 AI Agent Skill Packs" in electric blue below. ' +
      'Professional product photography, dramatic lighting, premium feel, 4K quality. ' +
      'Looks like a premium AI automation bundle product.',
  },
];

/**
 * Call the xAI Grok image generation API
 */
async function generateImage(product) {
  console.log(`\n[${product.slug}] Generating image...`);

  const requestBody = JSON.stringify({
    model: 'grok-2-image',
    prompt: product.prompt,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json',
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.x.ai',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${XAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            console.error(`[${product.slug}] API error ${res.statusCode}: ${data.substring(0, 200)}`);
            reject(new Error(`API returned ${res.statusCode}`));
            return;
          }

          const json = JSON.parse(data);

          if (json.data && json.data[0]) {
            const imageData = json.data[0].b64_json || json.data[0].url;

            if (json.data[0].b64_json) {
              // Save base64 image
              const buffer = Buffer.from(imageData, 'base64');
              const outputPath = path.join(OUTPUT_DIR, product.filename);
              fs.writeFileSync(outputPath, buffer);
              console.log(`[${product.slug}] Saved: ${outputPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
              resolve(outputPath);
            } else if (json.data[0].url) {
              // Download from URL
              console.log(`[${product.slug}] Downloading from URL...`);
              downloadImage(json.data[0].url, path.join(OUTPUT_DIR, product.filename))
                .then(resolve)
                .catch(reject);
            }
          } else {
            console.error(`[${product.slug}] Unexpected response:`, JSON.stringify(json).substring(0, 200));
            reject(new Error('No image data in response'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
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
