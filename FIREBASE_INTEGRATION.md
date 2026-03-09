# Firebase App Hosting GitHub Deployment

Deploy directly from Firebase App Hosting with GitHub integration so Firebase builds and rolls out the app automatically after each push.

## 🔄 Deployment Workflow

**You push code → Firebase detects → Auto-deploys**

1. Push changes to GitHub `master` branch
2. Firebase App Hosting detects the push
3. App Hosting builds the React app and starts the production Node server defined in `apphosting.yaml`
4. The app serves the SPA and backend API from the same deployment

## 🛠️ Setup Firebase GitHub Integration

### 1. Connect GitHub Repo to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **redpillreader-249ec**
3. Build → App Hosting
4. Create or open backend: **redpill**
5. Authenticate with your GitHub account
6. Select repo: `tlancas25/redpill`
7. Select branch: `master`

### 2. Configure Build Settings

Firebase will use [apphosting.yaml](apphosting.yaml) in the repo root.

Build command:
```bash
npm install --prefix server && npm run build
```

Run command:
```bash
node server/apphosting.js
```

### 3. Set Environment Variables in Firebase

In Firebase Console → App Hosting → redpill backend → Settings → Environment:

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyA7bB4B7VO9GNq6mUaTVRUMTs31Em52EMI
REACT_APP_FIREBASE_AUTH_DOMAIN=www.redpillreader.com
REACT_APP_FIREBASE_PROJECT_ID=redpillreader-249ec
REACT_APP_FIREBASE_STORAGE_BUCKET=redpillreader-249ec.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=922536968843
REACT_APP_FIREBASE_APP_ID=1:922536968843:web:dbecd8d28327be516f4a8e
REACT_APP_FIREBASE_MEASUREMENT_ID=G-JQPR7VL8C1
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_API_URL=/api
FRONTEND_URL=https://www.redpillreader.com
GITHUB_CALLBACK_URL=https://www.redpillreader.com/api/auth/github/callback
JWT_SECRET=...
SESSION_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_WEBHOOK_SECRET_THIN=...
```

Store sensitive values in App Hosting environment or Secret Manager references, not in `.env`.

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

# Firebase App Hosting builds & deploys automatically
# Track in Firebase Console → App Hosting → Rollouts
```

## 🎯 Quick Deploy Checklist

Before pushing:
- [ ] `npm run build` succeeds locally
- [ ] All required App Hosting environment variables are set
- [ ] GitHub callback URLs updated for production
- [ ] `apphosting.yaml` is present in the repo root

After pushing:
- [ ] Check Firebase Console → App Hosting → Rollouts
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

### App Hosting Rollout Fails
Check Firebase Console → App Hosting → Rollouts.

Common causes:
```bash
# Missing root lockfile or build output
npm install
npm run build

# Missing server dependencies for the production runtime
npm install --prefix server
```

### Environment Variables Missing
Verify App Hosting backend environment values in Firebase Console.

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

**Current Status:** ✅ Ready for Firebase App Hosting GitHub deployment

**Next:** Push to `master`, then verify the new rollout in App Hosting.
