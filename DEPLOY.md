# Deploy to Firebase Hosting

Complete deployment guide for redpillreader.com on Firebase.

## 🚀 Quick Deploy

### Prerequisites
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Verify project
firebase projects:list
# Should show: redpillreader-249ec
```

### 1. Set Environment Variables

```bash
# In Firebase Console → Project Settings → Environment Variables
# OR use CLI:
firebase functions:config:set \
  github.client_id="Iv23liJGFpfhfIas67yQ" \
  github.client_secret="YOUR_SECRET_HERE" \
  github.callback_url="https://api-redpillreader-249ec.web.app/auth/github/callback" \
  jwt.secret="YOUR_JWT_SECRET" \
  session.secret="YOUR_SESSION_SECRET" \
  stripe.secret_key="sk_live_..." \
  stripe.webhook_secret="whsec_..."
```

### 2. Update GitHub App Settings

In your GitHub App (App ID: 3049657):
- **Homepage URL:** `https://www.redpillreader.com`
- **Authorization callback URL:** `https://api-redpillreader-249ec.web.app/auth/github/callback`

### 3. Build & Deploy

```bash
# Build frontend
cd ~/workspace/redpill
npm run build

# Deploy everything
firebase deploy

# Or deploy individually:
firebase deploy --only hosting          # Frontend only
firebase deploy --only functions        # Backend only
firebase deploy --only firestore:rules  # Security rules
```

## 📁 Deployment Structure

```
Firebase Hosting (redpillreader-249ec.web.app)
├── / (React build)
├── /api/* → Cloud Function 'api'
└── Custom domain: www.redpillreader.com

Cloud Functions
├── api (Express server)
│   ├── /auth/github
│   ├── /auth/github/callback
│   ├── /api/products
│   └── ...
```

## 🔧 Custom Domain Setup

### Add Custom Domain to Firebase

```bash
firebase hosting:channel:deploy production
# Then in Firebase Console:
# Hosting → Add custom domain → www.redpillreader.com
```

Or via Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **redpillreader-249ec**
3. Hosting → Add custom domain
4. Enter: `www.redpillreader.com`
5. Follow DNS verification steps

### DNS Records (Add to your DNS provider)

**Option A: Apex domain (redpillreader.com)**
```
Type: A
Name: @
Value: 199.36.158.100
```

**Option B: Subdomain (www.redpillreader.com)**
```
Type: CNAME
Name: www
Value: redpillreader-249ec.web.app
```

## 📊 Environment Variables Reference

### Required for Production

| Variable | Description | Source |
|----------|-------------|--------|
| `github.client_id` | GitHub OAuth App ID | GitHub App settings |
| `github.client_secret` | GitHub OAuth Secret | GitHub App settings |
| `github.callback_url` | OAuth callback | Firebase function URL |
| `jwt.secret` | JWT signing key | Generate random string |
| `session.secret` | Session encryption | Generate random string |
| `stripe.secret_key` | Stripe live key | Stripe Dashboard |
| `stripe.webhook_secret` | Stripe webhook secret | Stripe Dashboard |

### Firebase Config vs .env

**Development:** Uses `.env` file
**Production:** Uses Firebase Functions config

Access in Cloud Functions:
```javascript
const functions = require('firebase-functions');
const clientId = functions.config().github.client_id;
```

## 🧪 Testing Before Deploy

### Local Emulator
```bash
# Start all emulators
firebase emulators:start

# Access:
# - Frontend: http://localhost:5000
# - Functions: http://localhost:5001
# - Firestore: http://localhost:8080
# - Emulator UI: http://localhost:4000
```

### Test GitHub OAuth Locally
```bash
# 1. Set GitHub App callback to:
# http://localhost:5001/redpillreader-249ec/us-central1/api/auth/github/callback

# 2. Start emulator
firebase emulators:start

# 3. Test login
open http://localhost:5000
```

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ master ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          npm ci
          cd server && npm ci
          
      - name: Build
        run: npm run build
        
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy
        env:
          GCP_SA_KEY: ${{ secrets.GCP_SA_KEY }}
          PROJECT_ID: redpillreader-249ec
```

Add `GCP_SA_KEY` to GitHub Secrets:
```bash
# Generate service account key in Firebase Console
# Project Settings → Service Accounts → Generate new private key
# Base64 encode and add to GitHub Secrets
```

## 🐛 Troubleshooting

### "Function failed to start"
```bash
# Check logs
firebase functions:log

# Common fixes:
# 1. Ensure all dependencies in server/package.json
# 2. Check Node version (should be 18)
# 3. Verify functions.config() values are set
```

### "CORS errors"
```bash
# Verify your domain is in firebase.json cors array
# Check functions.config().github.callback_url matches
```

### "GitHub OAuth not working"
```bash
# 1. Verify callback URL in GitHub App matches deployed function URL
# 2. Check secrets are set in Firebase config
# 3. Look at function logs for errors
```

### Custom domain not working
```bash
# Check DNS propagation
nslookup www.redpillreader.com

# Verify SSL certificate in Firebase Console
# Can take 24 hours for full propagation
```

## 📈 Monitoring

### Firebase Console
- Functions: [console.firebase.google.com](https://console.firebase.google.com)
- Hosting: Usage, bandwidth, custom domain status
- Functions: Logs, errors, invocation counts
- Firestore: Database usage, security rules

### Stackdriver Logging
```bash
# View logs
firebase functions:log

# Filter by function
firebase functions:log --only api

# Follow logs
firebase functions:log --tail
```

## 🎯 Production Checklist

- [ ] Firebase CLI installed and logged in
- [ ] All environment variables set in Firebase config
- [ ] GitHub App callback URL updated to production
- [ ] Stripe keys updated to live mode
- [ ] Firestore security rules deployed
- [ ] Frontend builds successfully
- [ ] Functions deploy without errors
- [ ] Custom domain connected and SSL working
- [ ] GitHub OAuth login tested on production
- [ ] Payment flow tested in live mode

## 📞 Support

- Firebase Docs: [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)
- Functions Docs: [firebase.google.com/docs/functions](https://firebase.google.com/docs/functions)
- GitHub Issues: [github.com/firebase/firebase-tools](https://github.com/firebase/firebase-tools)

---

**Project:** redpillreader-249ec  
**Domain:** www.redpillreader.com  
**Ready to deploy! 🚀**
