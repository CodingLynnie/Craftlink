const express = require('express');
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

// Get all sellers
router.get('/sellers', async (req, res) => {
  try {
    const [sellers] = await pool.execute(`
      SELECT id, name, location, bio, profile_image,
             (SELECT COUNT(*) FROM products WHERE seller_id = users.id AND is_available = TRUE) as product_count
      FROM users
      WHERE role = 'seller'
      ORDER BY product_count DESC
    `);

    res.json({ sellers });

  } catch (error) {
    console.error('Get sellers error:', error);
    res.status(500).json({ error: 'Failed to fetch sellers' });
  }
});

// Get seller profile
router.get('/seller/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [sellers] = await pool.execute(`
      SELECT id, name, location, bio, profile_image, created_at
      FROM users
      WHERE id = ? AND role = 'seller'
    `, [id]);

    if (sellers.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Get seller's products
    const [products] = await pool.execute(`
      SELECT * FROM products
      WHERE seller_id = ? AND is_available = TRUE
      ORDER BY created_at DESC
    `, [id]);

    const seller = sellers[0];
    seller.products = products;

    res.json({ seller });

  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ error: 'Failed to fetch seller profile' });
  }
});

module.exports = router;