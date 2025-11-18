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

// Create new order
router.post('/', authenticateToken, [
  body('product_id').isInt().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shipping_address').trim().notEmpty().withMessage('Shipping address is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product_id, quantity, shipping_address } = req.body;

    // Get product details
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ? AND is_available = TRUE',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found or unavailable' });
    }

    const product = products[0];

    // Check stock availability
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Calculate total amount
    const total_amount = product.price * quantity;

    // Create order
    const [result] = await pool.execute(`
      INSERT INTO orders (buyer_id, seller_id, product_id, quantity, total_amount, shipping_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [req.user.userId, product.seller_id, product_id, quantity, total_amount, shipping_address]);

    // Update product stock
    await pool.execute(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
      [quantity, product_id]
    );

    res.status(201).json({
      message: 'Order created successfully',
      order_id: result.insertId,
      total_amount
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT o.*, p.name as product_name, p.images, u.name as seller_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users u ON o.seller_id = u.id
      WHERE o.buyer_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.userId]);

    res.json({ orders });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get seller orders
router.get('/my-sales', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can view sales' });
    }

    const [orders] = await pool.execute(`
      SELECT o.*, p.name as product_name, p.images, u.name as buyer_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users u ON o.buyer_id = u.id
      WHERE o.seller_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.userId]);

    res.json({ orders });

  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Update order status (seller only)
router.put('/:id/status', authenticateToken, [
  body('status').isIn(['confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if order exists and belongs to seller
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND seller_id = ?',
      [id, req.user.userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }

    // Update order status
    await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Order status updated successfully' });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;