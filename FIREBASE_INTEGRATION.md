# Firebase GitHub Integration Deployment

Deploy directly from Firebase Console with GitHub integration for better KPI tracking.

## 🔄 Deployment Workflow

**You push code → Firebase detects → Auto-deploys**

1. Push changes to GitHub `master` branch
2. Firebase Console detects the push
3. Automatic build & deployment
4. KPIs tracked in Firebase Analytics

## 🛠️ Setup Firebase GitHub Integration

### 1. Connect GitHub Repo to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **redpillreader-249ec**
3. Hosting → Get started
4. Click **"Connect to GitHub"**
5. Authenticate with your GitHub account
6. Select repo: `tlancas25/redpill`
7. Select branch: `master`

### 2. Configure Build Settings

Firebase will ask for build command:
```
npm run build
```

Public directory:
```
build
```

### 3. Set Environment Variables in Firebase

In Firebase Console → Hosting → Environment variables:

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyA7bB4B7VO9GNq6mUaTVRUMTs31Em52EMI
REACT_APP_FIREBASE_AUTH_DOMAIN=redpillreader-249ec.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=redpillreader-249ec
REACT_APP_FIREBASE_STORAGE_BUCKET=redpillreader-249ec.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=922536968843
REACT_APP_FIREBASE_APP_ID=1:922536968843:web:dbecd8d28327be516f4a8e
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_API_URL=https://api-redpillreader-249ec.web.app
```

For secrets (Stripe, GitHub OAuth), use:
```bash
firebase functions:config:set stripe.secret_key="sk_live_..."
firebase functions:config:set github.client_secret="..."
```

## 📊 KPI Tracking in Firebase

### Analytics Dashboard
- **Traffic:** Daily/weekly visitors
- **Sources:** Where users come from (GitHub, X, organic)
- **Conversions:** Sign-ups, purchases
- **Engagement:** Time on site, pages per session

### Custom Events (Already Set Up)
```javascript
// In your code - these auto-track
analytics.logEvent('purchase', { value: 49.99, currency: 'USD' });
analytics.logEvent('login', { method: 'GitHub' });
analytics.logEvent('course_start', { course_id: 'openclaw-101' });
```

### Performance Monitoring
- Page load times
- API response times
- Error rates
- Real-time active users

## 🚀 Deployment Commands

### For Development (Local)
```bash
cd ~/workspace/redpill
npm run build
firebase emulators:start
```

### For Production (Push to Deploy)
```bash
cd ~/workspace/redpill

# Add all changes
git add .

# Commit with message
git commit -m "Your change description"

# Push to GitHub (triggers Firebase auto-deploy)
git push origin master

# Firebase builds & deploys automatically
# Track in Firebase Console → Hosting
```

## 🎯 Quick Deploy Checklist

Before pushing:
- [ ] `npm run build` succeeds locally
- [ ] All secrets in Firebase config (not in code)
- [ ] GitHub callback URLs updated for production
- [ ] Test in emulator first

After pushing:
- [ ] Check Firebase Console → Hosting → Deploys
- [ ] Verify site at https://www.redpillreader.com
- [ ] Test GitHub OAuth login
- [ ] Test Stripe payment flow

## 🔐 Security Notes

**Never commit these:**
- `.env` (gitignored ✓)
- Service account keys
- Stripe secret keys
- JWT secrets

**Firebase handles:**
- SSL certificates (auto)
- CDN distribution (global)
- DDoS protection
- Analytics security

## 📈 Viewing Your KPIs

### Real-time Dashboard
https://console.firebase.google.com/project/redpillreader-249ec/analytics

### Key Metrics to Track
1. **Acquisition:** New users by source
2. **Activation:** Sign-ups, GitHub connections
3. **Revenue:** Purchases, subscriptions
4. **Retention:** Return visits, course completion
5. **Referral:** Social shares, invites

### Custom Conversions
Set up conversion events in Firebase:
- `purchase` - Product bought
- `subscription_start` - New subscriber
- `course_complete` - Finished course
- `github_link` - Connected GitHub

## 🆘 Troubleshooting

### Build Fails on Deploy
Check Firebase Console → Hosting → Deploy logs
```bash
# Common fixes:
npm ci  # Use ci instead of install
rm -rf node_modules && npm ci
```

### Environment Variables Missing
```bash
# Verify in Firebase Console
firebase functions:config:get
```

### Custom Domain Issues
```bash
# Verify DNS
nslookup www.redpillreader.com

# Check SSL status in Firebase Console
```

## 📞 Support

- Firebase Hosting Docs: https://firebase.google.com/docs/hosting
- GitHub Integration: https://firebase.google.com/docs/hosting/github-integration
- Analytics: https://firebase.google.com/docs/analytics

---

**Current Status:** ✅ Ready for Firebase GitHub integration setup

**Next:** Go to Firebase Console and connect your GitHub repo!
