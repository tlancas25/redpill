#!/usr/bin/env python3
"""Populate Firestore with real products"""

import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime

# Initialize with redpill project
import os
credentials_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')

if credentials_path:
    cred = credentials.Certificate(credentials_path)
    firebase_admin.initialize_app(cred, {'projectId': 'redpillreader-249ec'})
else:
    # Use default credentials if env var not set
    firebase_admin.initialize_app(options={'projectId': 'redpillreader-249ec'})

db = firestore.client()

products = [
    {
        'id': 'openclaw-masterclass',
        'title': 'OpenClaw Masterclass',
        'slug': 'openclaw-masterclass',
        'description': 'Learn to build and deploy AI agents with OpenClaw. From setup to your first live skill. Complete course with video modules and PDF workbook.',
        'shortDescription': 'Build AI agents. From zero to deployed in 5 modules.',
        'price': 4900,  # cents
        'salePrice': None,
        'category': 'Tech & Development',
        'type': 'course',
        'images': ['/images/products/openclaw-masterclass.png'],
        'curriculum': [
            {'title': 'Module 1: WTF is an Agent?', 'duration': 20},
            {'title': 'Module 2: OpenClaw Setup from Zero', 'duration': 45},
            {'title': 'Module 3: First Skill - Weather Bot', 'duration': 30},
            {'title': 'Module 4: Security - Don\'t Get Pwned', 'duration': 35},
            {'title': 'Module 5: Deploy to X - Be Your Own Bot', 'duration': 40},
        ],
        'stripePriceId': 'price_1T9DnSRpLFWUKDnHi3HELdZo',
        'rating': 0,
        'reviewCount': 0,
        'featured': True,
        'createdAt': datetime.now(),
        'updatedAt': datetime.now(),
    },
    {
        'id': 'agent-security-field-guide',
        'title': 'Agent Security Field Guide',
        'slug': 'agent-security-field-guide',
        'description': 'A practical guide to securing your AI agents. Threat models, audits, and weekly rituals to keep your operations safe.',
        'shortDescription': 'Threat models, audits, and weekly security rituals.',
        'price': 2700,
        'salePrice': None,
        'category': 'Cybersecurity',
        'type': 'ebook',
        'images': ['/images/products/agent-security-field-guide.png'],
        'curriculum': [],
        'stripePriceId': 'price_1T9DntRpLFWUKDnHsZ7cKk83',
        'rating': 0,
        'reviewCount': 0,
        'featured': True,
        'createdAt': datetime.now(),
        'updatedAt': datetime.now(),
    },
    {
        'id': 'trading-bot-blueprint',
        'title': 'Trading Bot Blueprint',
        'slug': 'trading-bot-blueprint',
        'description': 'Build automated trading bots with Alpaca. From paper trading to live deployment with proper risk management.',
        'shortDescription': 'Build trading bots. Paper to live with risk controls.',
        'price': 9700,
        'salePrice': None,
        'category': 'Finance & Trading',
        'type': 'course',
        'images': ['/images/products/trading-bot-blueprint.png'],
        'curriculum': [
            {'title': 'Market Making vs Directional', 'duration': 25},
            {'title': 'Alpaca Setup + Paper Trading', 'duration': 35},
            {'title': 'Mean Reversion Bot Build', 'duration': 50},
            {'title': 'Risk Management Systems', 'duration': 40},
            {'title': 'Live Deploy Psychology', 'duration': 30},
        ],
        'stripePriceId': 'price_1T9DnuRpLFWUKDnHT4WjjoZn',
        'rating': 0,
        'reviewCount': 0,
        'featured': True,
        'createdAt': datetime.now(),
        'updatedAt': datetime.now(),
    },
    {
        'id': 'x-monetization-system',
        'title': 'X Monetization System',
        'slug': 'x-monetization-system',
        'description': 'Turn your X following into revenue. Content systems, product creation, and Stripe integration for sustainable income.',
        'shortDescription': 'Content → Cash. No viral lottery required.',
        'price': 6700,
        'salePrice': None,
        'category': 'Business & Marketing',
        'type': 'course',
        'images': ['/images/products/x-monetization-system.png'],
        'curriculum': [
            {'title': 'Audience Building 0 to 1K', 'duration': 30},
            {'title': 'Content Systems That Work', 'duration': 35},
            {'title': 'Product Creation Framework', 'duration': 40},
            {'title': 'Stripe Integration Guide', 'duration': 45},
            {'title': 'Automation & Analytics', 'duration': 25},
        ],
        'stripePriceId': 'price_1T9DnuRpLFWUKDnHzY6OZ0zG',
        'rating': 0,
        'reviewCount': 0,
        'featured': True,
        'createdAt': datetime.now(),
        'updatedAt': datetime.now(),
    },
]

print('Creating products in Firestore...\n')

for product in products:
    doc_ref = db.collection('products').document(product['id'])
    doc_ref.set(product)
    print(f"✅ {product['title']}")
    print(f"   Price: ${product['price']/100:.2f}")
    print(f"   Stripe: {product['stripePriceId']}")
    print()

print('All products created successfully!')
