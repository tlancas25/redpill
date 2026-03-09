# GitHub OAuth Integration - Complete

## ✅ What Was Added

### Backend (server/)
- **`server/routes/auth.js`** - GitHub OAuth routes with Passport
- **Updated `server/index.js`** - Added passport, session middleware
- **Updated `server/package.json`** - Added passport dependencies

### Frontend (src/)
- **`src/context/GitHubAuthContext.tsx`** - React context for GitHub auth state
- **`src/components/GitHubAuth.tsx`** - UI components (login button, profile card, repo list)
- **Updated `src/App.tsx`** - Wrapped app with GitHubAuthProvider

### Configuration
- **Updated `.env.example`** - Added GitHub OAuth variables

## 🔧 Installation

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies (already has styled-components)
```bash
cd ..
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
# GitHub OAuth (required)
GITHUB_CLIENT_ID=Iv23liJGFpfhfIas67yQ
GITHUB_CLIENT_SECRET=379d529afd82790621d8deeb51d1c92ece48c7e0
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Auth secrets (generate random strings)
JWT_SECRET=your_random_jwt_secret
SESSION_SECRET=your_random_session_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Firebase (your existing config)
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_PROJECT_ID=...

# Stripe (your existing config)
REACT_APP_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
```

### 4. Update GitHub App Settings

In your GitHub App (App ID: 3049657):
- **Homepage URL:** `http://localhost:3000` (dev) or your production domain
- **Authorization callback URL:** `http://localhost:5000/api/auth/github/callback`

## 🚀 Testing

### Start the Backend
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### Start the Frontend
```bash
npm start
# Frontend runs on http://localhost:3000
```

### Test GitHub Login
1. Navigate to your login page
2. Use the `<GitHubLoginButton />` component
3. Click "Login with GitHub"
4. Authorize the app on GitHub
5. Should redirect back to `/auth/callback?token=xxx`
6. Token is stored in localStorage, user profile fetched

## 📁 File Structure

```
redpill/
├── server/
│   ├── routes/
│   │   ├── auth.js          # ← NEW: GitHub OAuth routes
│   │   └── ...
│   ├── index.js             # ← MODIFIED: Added passport
│   └── package.json         # ← MODIFIED: Added dependencies
├── src/
│   ├── context/
│   │   ├── GitHubAuthContext.tsx  # ← NEW
│   │   └── ...
│   ├── components/
│   │   ├── GitHubAuth.tsx   # ← NEW: UI components
│   │   └── ...
│   ├── App.tsx              # ← MODIFIED: Added provider
│   └── ...
└── .env.example             # ← MODIFIED: Added GitHub vars
```

## 🎯 Usage Examples

### Login Button
```tsx
import { GitHubLoginButton } from './components/GitHubAuth';

function LoginPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <GitHubLoginButton />
    </div>
  );
}
```

### Profile Display
```tsx
import { GitHubProfileCard, GitHubRepoList } from './components/GitHubAuth';

function ProfilePage() {
  return (
    <div>
      <GitHubProfileCard />
      <GitHubRepoList />
    </div>
  );
}
```

### Link to Existing Account
```tsx
import { LinkGitHubButton } from './components/GitHubAuth';
import { useAuth } from './context/AuthContext';

function SettingsPage() {
  const { currentUser } = useAuth();
  
  const getFirebaseToken = async () => {
    return await currentUser?.getIdToken();
  };

  return (
    <div>
      <h2>Connected Accounts</h2>
      <LinkGitHubButton firebaseToken={firebaseToken} />
    </div>
  );
}
```

### Using the Hook
```tsx
import { useGitHubAuth } from './context/GitHubAuthContext';

function SomeComponent() {
  const { 
    githubUser, 
    isAuthenticated, 
    loginWithGitHub, 
    logout 
  } = useGitHubAuth();

  if (isAuthenticated) {
    return <div>Welcome, {githubUser?.githubUsername}!</div>;
  }

  return <button onClick={loginWithGitHub}>Login with GitHub</button>;
}
```

## 🔐 Security Features

- JWT tokens with 7-day expiration
- Server-side session management
- GitHub OAuth signature verification
- Token stored in localStorage (frontend) only
- API routes protected via Bearer token

## 🐛 Troubleshooting

### "redirect_uri_mismatch" Error
- Check `GITHUB_CALLBACK_URL` matches exactly in GitHub App settings
- Ensure protocol matches (http vs https)
- No trailing slashes mismatch

### "Firebase is not configured" Error
- Verify Firebase credentials in `.env`
- Ensure Firebase project is set up

### Token Not Persisting
- Check browser localStorage is enabled
- Look for JavaScript errors in console
- Verify `REACT_APP_API_URL` is correct

### CORS Errors
- Ensure backend CORS allows frontend URL
- Check `FRONTEND_URL` env var matches actual URL

## 📚 Next Steps

1. **Customize UI** - Match your existing design system
2. **Add Permissions** - Request `repo` scope for private repos if needed
3. **Smart Recommendations** - Analyze repos to suggest courses
4. **GitHub Actions** - Trigger builds/webhooks from GitHub events
5. **Production Deploy** - Update callback URLs for production domain

## 📝 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/github` | GET | No | Initiate OAuth flow |
| `/api/auth/github/callback` | GET | No | OAuth callback |
| `/api/auth/me` | GET | Bearer | Get current user |
| `/api/auth/github/repos` | GET | Bearer | List user's repos |
| `/api/auth/link-github` | POST | Firebase | Link to existing account |

## 🎉 You're All Set!

Your redpill platform now supports GitHub OAuth. Users can:
- Login with their GitHub account
- Display their GitHub profile
- View their public repositories
- Link GitHub to existing Firebase accounts

Next: Add the login button to your login page and test the flow!
