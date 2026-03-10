#!/usr/bin/env python3
"""Upload ebook to Firebase Storage"""

import firebase_admin
from firebase_admin import credentials, storage
import os

# Initialize
cred = credentials.Certificate('/Users/craigmac/.openclaw/google_credentials.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'redpillreader-249ec.firebasestorage.app'
})

bucket = storage.bucket()

# Upload PDF
local_path = "/Users/craigmac/Documents/openclawguru sales/dominator trader/Trading_Bot_Blueprint_OpenClaw.pdf"
storage_path = "products/trading-bot-blueprint/Trading_Bot_Blueprint_OpenClaw.pdf"

blob = bucket.blob(storage_path)
blob.upload_from_filename(local_path)

# Make public
blob.make_public()

print(f"✅ Uploaded: {storage_path}")
print(f"📥 Download URL: {blob.public_url}")
