#!/bin/bash

# Populate Firestore products using REST API
# Requires: gcloud auth or FIREBASE_TOKEN

PROJECT_ID="redpillreader-249ec"
BASE_URL="https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents"

echo "Populating Firestore products..."

# Product 1: OpenClaw Masterclass
curl -s -X POST "${BASE_URL}/products" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "id": {"stringValue": "openclaw-masterclass"},
      "title": {"stringValue": "OpenClaw Masterclass"},
      "slug": {"stringValue": "openclaw-masterclass"},
      "description": {"stringValue": "Learn to build and deploy AI agents with OpenClaw. From setup to your first live skill."},
      "shortDescription": {"stringValue": "Build AI agents. From zero to deployed in 5 modules."},
      "price": {"integerValue": "4900"},
      "category": {"stringValue": "Tech & Development"},
      "type": {"stringValue": "course"},
      "stripePriceId": {"stringValue": "price_1T9DnSRpLFWUKDnHi3HELdZo"},
      "featured": {"booleanValue": true},
      "rating": {"integerValue": "0"},
      "reviewCount": {"integerValue": "0"}
    }
  }' | jq -r '.name' && echo "✅ OpenClaw Masterclass"

# Product 2: Agent Security
curl -s -X POST "${BASE_URL}/products" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "id": {"stringValue": "agent-security-field-guide"},
      "title": {"stringValue": "Agent Security Field Guide"},
      "slug": {"stringValue": "agent-security-field-guide"},
      "description": {"stringValue": "A practical guide to securing your AI agents. Threat models, audits, and weekly rituals."},
      "shortDescription": {"stringValue": "Threat models, audits, and weekly security rituals."},
      "price": {"integerValue": "2700"},
      "category": {"stringValue": "Cybersecurity"},
      "type": {"stringValue": "ebook"},
      "stripePriceId": {"stringValue": "price_1T9DntRpLFWUKDnHsZ7cKk83"},
      "featured": {"booleanValue": true},
      "rating": {"integerValue": "0"},
      "reviewCount": {"integerValue": "0"}
    }
  }' | jq -r '.name' && echo "✅ Agent Security Field Guide"

# Product 3: Trading Bot
curl -s -X POST "${BASE_URL}/products" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "id": {"stringValue": "trading-bot-blueprint"},
      "title": {"stringValue": "Trading Bot Blueprint"},
      "slug": {"stringValue": "trading-bot-blueprint"},
      "description": {"stringValue": "Build automated trading bots with Alpaca. From paper trading to live deployment."},
      "shortDescription": {"stringValue": "Build trading bots. Paper to live with risk controls."},
      "price": {"integerValue": "9700"},
      "category": {"stringValue": "Finance & Trading"},
      "type": {"stringValue": "course"},
      "stripePriceId": {"stringValue": "price_1T9DnuRpLFWUKDnHT4WjjoZn"},
      "featured": {"booleanValue": true},
      "rating": {"integerValue": "0"},
      "reviewCount": {"integerValue": "0"}
    }
  }' | jq -r '.name' && echo "✅ Trading Bot Blueprint"

# Product 4: X Monetization
curl -s -X POST "${BASE_URL}/products" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "id": {"stringValue": "x-monetization-system"},
      "title": {"stringValue": "X Monetization System"},
      "slug": {"stringValue": "x-monetization-system"},
      "description": {"stringValue": "Turn your X following into revenue. Content systems, product creation, and Stripe integration."},
      "shortDescription": {"stringValue": "Content → Cash. No viral lottery required."},
      "price": {"integerValue": "6700"},
      "category": {"stringValue": "Business & Marketing"},
      "type": {"stringValue": "course"},
      "stripePriceId": {"stringValue": "price_1T9DnuRpLFWUKDnHzY6OZ0zG"},
      "featured": {"booleanValue": true},
      "rating": {"integerValue": "0"},
      "reviewCount": {"integerValue": "0"}
    }
  }' | jq -r '.name' && echo "✅ X Monetization System"

echo ""
echo "All products created in Firestore!"
