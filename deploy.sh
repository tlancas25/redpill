#!/bin/bash

# Deploy Redpill to Firebase
# Usage: ./deploy.sh [environment]
# Environments: dev, staging, prod (default: prod)

set -e

ENV=${1:-prod}
echo "🚀 Deploying to $ENV environment..."

cd "$(dirname "$0")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "${RED}❌ Firebase CLI not found. Install with: npm install -g firebase-tools${NC}"
    exit 1
fi

# Check login
if ! firebase projects:list &> /dev/null; then
    echo "${YELLOW}⚠️ Not logged in to Firebase. Running login...${NC}"
    firebase login
fi

# Verify project
echo "📋 Verifying Firebase project..."
firebase use redpillreader-249ec

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Check build succeeded
if [ ! -d "build" ]; then
    echo "${RED}❌ Build failed. No build/ directory found.${NC}"
    exit 1
fi

echo "${GREEN}✅ Build successful${NC}"

# Deploy based on environment
case $ENV in
    dev)
        echo "🔧 Deploying to development (hosting preview channel)..."
        firebase hosting:channel:deploy dev
        ;;
    staging)
        echo "🧪 Deploying to staging..."
        firebase hosting:channel:deploy staging
        firebase deploy --only functions:api
        ;;
    prod|production)
        echo "🚀 Deploying to PRODUCTION..."
        echo "${YELLOW}⚠️ This will deploy to www.redpillreader.com${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "❌ Deployment cancelled"
            exit 0
        fi
        
        # Deploy everything
        firebase deploy
        
        echo "${GREEN}✅ Production deployment complete!${NC}"
        echo "🌐 https://www.redpillreader.com"
        ;;
    *)
        echo "${RED}❌ Unknown environment: $ENV${NC}"
        echo "Usage: ./deploy.sh [dev|staging|prod]"
        exit 1
        ;;
esac

echo "📊 View logs: firebase functions:log"
echo "🔍 Monitor: https://console.firebase.google.com/project/redpillreader-249ec"
