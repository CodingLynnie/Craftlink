const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Create a general review
router.post('/', async (req, res) => {
  const { name, role, location, rating, comment } = req.body;
  try {
    await pool.execute(
      'INSERT INTO community_reviews (name, role, location, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [name, role, location, rating, comment]
    );
    res.status(201).json({ message: 'Review submitted!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get all general reviews
router.get('/', async (req, res) => {
  try {
    const [reviews] = await pool.execute('SELECT * FROM community_reviews ORDER BY id DESC');
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;