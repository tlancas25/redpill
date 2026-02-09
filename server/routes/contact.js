const express = require('express');
const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // TODO: Send email notification, store in Firestore
  console.log('Contact form submission:', { name, email, subject, message });
  res.json({ success: true, message: 'Message received. We\'ll get back to you soon.' });
});

module.exports = router;
