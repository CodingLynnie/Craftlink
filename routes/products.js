const express = require('express');
const multer = require('multer');
const path = require('path');
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

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, seller_id, page = 1, limit = 12 } = req.query;
    
    let query = `
      SELECT p.*, u.name as seller_name, u.location as seller_location,
             (SELECT AVG(rating) FROM reviews WHERE product_id = p.id) as avg_rating,
             (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.is_available = TRUE
    `;
    
    const params = [];
    
    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    
    if (seller_id) {
      query += ' AND p.seller_id = ?';
      params.push(seller_id);
    }
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [products] = await pool.execute(query, params);
    
    res.json({ products });
    
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [products] = await pool.execute(`
      SELECT p.*, u.name as seller_name, u.location as seller_location, u.bio as seller_bio,
             (SELECT AVG(rating) FROM reviews WHERE product_id = p.id) as avg_rating,
             (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = ? AND p.is_available = TRUE
    `, [id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get reviews for this product
    const [reviews] = await pool.execute(`
      SELECT r.*, u.name as reviewer_name
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [id]);
    
    const product = products[0];
    product.reviews = reviews;
    
    res.json({ product });
    
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create new product (seller only)
router.post('/', authenticateToken, upload.array('images', 5), [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stock_quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
], async (req, res) => {
  try {
    // Check if user is a seller
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can create products' });
    }
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, price, category, stock_quantity } = req.body;
    
    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // Insert product
    const [result] = await pool.execute(`
      INSERT INTO products (seller_id, name, description, price, category, images, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [req.user.userId, name, description, price, category, JSON.stringify(images), stock_quantity]);
    
    res.status(201).json({
      message: 'Product created successfully',
      product_id: result.insertId
    });
    
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

module.exports = router;