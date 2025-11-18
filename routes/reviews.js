const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');

const router = express.Router();

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'craftlink-secret-key';

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Create review
router.post('/', authenticateToken, [
  body('product_id').isInt().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 10 }).withMessage('Comment must be at least 10 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product_id, rating, comment } = req.body;

    // Check if product exists
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ? AND is_available = TRUE',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const [existingReviews] = await pool.execute(
      'SELECT * FROM reviews WHERE reviewer_id = ? AND product_id = ?',
      [req.user.userId, product_id]
    );

    if (existingReviews.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Create review
    const [result] = await pool.execute(`
      INSERT INTO reviews (reviewer_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `, [req.user.userId, product_id, rating, comment]);

    res.status(201).json({
      message: 'Review created successfully',
      review_id: result.insertId
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get product reviews
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const [reviews] = await pool.execute(`
      SELECT r.*, u.name as reviewer_name
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [productId]);

    res.json({ reviews });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;