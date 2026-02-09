const express = require('express');
const router = express.Router();

// GET /api/search - Search across products, courses, and blog
router.get('/', (req, res) => {
  const { q, type } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  // TODO: Implement search across Firestore collections
  res.json({
    query: q,
    type: type || 'all',
    results: {
      products: [],
      courses: [],
      articles: [],
    },
    totalResults: 0,
  });
});

module.exports = router;
