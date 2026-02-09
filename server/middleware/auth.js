const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // TODO: Verify Firebase ID token
  // const admin = require('firebase-admin');
  // const decodedToken = await admin.auth().verifyIdToken(token);
  // req.user = decodedToken;

  next();
};

module.exports = authMiddleware;
