const express = require('express');
const passport = require('passport');
const { Strategy: GitHubStrategy } = require('passport-github2');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

const router = express.Router();

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return process.env.JWT_SECRET;
};

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Configure GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const githubId = profile.id;
        const username = profile.username;
        const displayName = profile.displayName || username;
        const avatarUrl = profile.photos?.[0]?.value;
        const profileUrl = profile.profileUrl;
        
        // Check if user exists by email
        const userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
        
        if (!userQuery.empty) {
          // Existing user - update GitHub info
          const userDoc = userQuery.docs[0];
          const userData = userDoc.data();
          
          await userDoc.ref.update({
            githubId,
            githubUsername: username,
            githubDisplayName: displayName,
            githubAvatarUrl: avatarUrl,
            githubProfileUrl: profileUrl,
            githubAccessToken: accessToken,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          
          return done(null, { 
            uid: userDoc.id, 
            email: userData.email,
            displayName: userData.displayName || displayName,
            githubUsername: username,
            githubAvatarUrl: avatarUrl,
          });
        }
        
        // New user - create in Firestore
        const newUser = {
          email,
          displayName,
          photoURL: avatarUrl,
          githubId,
          githubUsername: username,
          githubDisplayName: displayName,
          githubAvatarUrl: avatarUrl,
          githubProfileUrl: profileUrl,
          githubAccessToken: accessToken,
          role: 'user',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          purchasedProducts: [],
          courseProgress: {},
          savedArticles: [],
          subscription: {
            plan: 'free',
            validUntil: null,
          },
        };
        
        const userRef = await db.collection('users').add(newUser);
        
        return done(null, { 
          uid: userRef.id,
          email,
          displayName,
          githubUsername: username,
          githubAvatarUrl: avatarUrl,
        });
      } catch (error) {
        console.error('GitHub auth error:', error);
        return done(error, false);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.uid);
});

passport.deserializeUser(async (uid, done) => {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return done(null, false);
    }
    const userData = userDoc.data();
    done(null, { uid: userDoc.id, ...userData });
  } catch (error) {
    done(error, false);
  }
});

// Helper function to generate JWT
function generateToken(user) {
  return jwt.sign(
    { 
      uid: user.uid, 
      email: user.email,
      githubUsername: user.githubUsername,
      role: user.role || 'user',
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
}

// Routes

// GET /api/auth/github - Initiate GitHub OAuth
router.get('/github', passport.authenticate('github', {
  scope: ['user:email', 'read:user'],
}));

// GET /api/auth/github/callback - GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=github' }),
  (req, res) => {
    // Successful authentication
    const user = req.user;
    const token = generateToken(user);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

// GET /api/auth/me - Get current user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());
    
    // Fetch fresh user data from Firestore
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    res.json({
      uid: userDoc.id,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      githubUsername: userData.githubUsername,
      githubAvatarUrl: userData.githubAvatarUrl,
      githubProfileUrl: userData.githubProfileUrl,
      role: userData.role,
      subscription: userData.subscription,
      purchasedProducts: userData.purchasedProducts || [],
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/auth/link-github - Link GitHub to existing Firebase auth
router.post('/link-github', async (req, res) => {
  const { firebaseToken } = req.body;
  
  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseUid = decodedToken.uid;
    
    // Store pending link in a temporary collection
    await db.collection('pendingGitHubLinks').doc(firebaseUid).set({
      firebaseUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Return URL to initiate GitHub OAuth
    res.json({ 
      redirectUrl: '/api/auth/github',
      message: 'Redirect to GitHub OAuth to complete linking'
    });
  } catch (error) {
    console.error('Link error:', error);
    res.status(400).json({ error: 'Invalid Firebase token' });
  }
});

// GET /api/auth/github/repos - Get user's GitHub repos
router.get('/github/repos', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());
    
    // Fetch user from Firestore to get GitHub access token
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    const githubToken = userData.githubAccessToken;
    
    if (!githubToken) {
      return res.status(400).json({ error: 'GitHub account not linked' });
    }
    
    // Fetch repos from GitHub API
    const fetch = require('node-fetch');
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=10', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'RedPill-App',
      },
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos = await response.json();
    
    // Return simplified repo data
    const simplifiedRepos = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      language: repo.language,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count,
      updatedAt: repo.updated_at,
    }));
    
    res.json(simplifiedRepos);
  } catch (error) {
    console.error('Repos error:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

module.exports = router;
