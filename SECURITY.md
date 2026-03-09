# Security & Secret Handling

## 🔐 Secret Management

### Where Secrets Live

| Location | Purpose | Access |
|----------|---------|--------|
| `~/.openclaw/.env` | Local dev secrets | Your machine only |
| GitHub Secrets | CI/CD & Production | GitHub Actions |
| Firebase Config | Production functions | Firebase Console |

### What Should NEVER Be Committed

- API keys (Stripe, GitHub, Firebase)
- JWT signing secrets
- Session encryption keys
- Database credentials
- OAuth client secrets

### What's Safe to Commit

- `.env.example` (template without real values)
- Public Stripe publishable key (pk_live_...)
- Firebase public config (apiKey, authDomain)
- GitHub Client ID (public identifier)

## 🛡️ Current Security Setup

### Local Development
```bash
# Secrets in ~/.openclaw/.env (NEVER in repo)
STRIPE_SECRET_KEY=sk_live_...
GITHUB_CLIENT_SECRET=...
JWT_SECRET=...
```

### Production
```bash
# Secrets in Firebase Functions Config
firebase functions:config:get

# Or via GitHub Actions secrets
GITHUB_CLIENT_SECRET
STRIPE_SECRET_KEY
JWT_SECRET
```

### Files Protected by .gitignore
```
.env
.env.*
*.secret
api-keys.json
credentials.json
```

## 🚀 GitHub Actions Secrets Required

For automatic deployment, set these in GitHub:

| Secret | Description |
|--------|-------------|
| `GCP_SA_KEY` | Base64-encoded Firebase service account |
| `REACT_APP_FIREBASE_*` | Firebase public config |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `REACT_APP_API_URL` | Backend API URL |
| `GITHUB_CLIENT_ID` | GitHub OAuth app ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret |
| `JWT_SECRET` | JWT signing key |
| `SESSION_SECRET` | Session encryption |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |

## 🔍 Verification

### Check for Leaked Secrets
```bash
# Scan git history
git log --all -p | grep -i "sk_live\|sk_test\|secret\|password"

# Check current files
grep -r "sk_live\|sk_test\|secret_key" --include="*.js" --include="*.ts" --include="*.json" .
```

### Safe to Share
```bash
# These are OK to commit
cat .env.example      # Template with placeholders
cat firebase.json     # Config without secrets
cat .firebaserc       # Project IDs (public info)
```

## ⚠️ If Secrets Are Leaked

1. **Rotate immediately** — Generate new keys
2. **Check logs** — Review Firebase/GitHub logs
3. **Alert** — Notify relevant services
4. **Audit** — Check for unauthorized access

## 🔒 Best Practices

- Never hardcode secrets in source code
- Use environment variables for all secrets
- Rotate keys quarterly
- Use least-privilege service accounts
- Enable 2FA on all accounts
- Review access logs regularly

## 📞 Security Contacts

- Firebase Security: [console.firebase.google.com](https://console.firebase.google.com)
- GitHub Security: [github.com/settings/security](https://github.com/settings/security)
- Stripe Security: [stripe.com/support](https://stripe.com/support)
