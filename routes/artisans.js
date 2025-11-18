const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// GET /api/artisans?search=&location=&minPrice=&maxPrice=
router.get('/', async (req, res) => {
  try {
    const { search = '', location = '', minPrice = 0, maxPrice = 10000 } = req.query;
   let query = `
  SELECT id, name, location, profile_image AS image, min_price
FROM users
WHERE role = 'seller'
  AND name LIKE ?
  AND location LIKE ?
`;
const params = [
  `%${search}%`,
  `%${location}%`
];
    const [artisans] = await pool.execute(query, params);
    res.json({ artisans });
  } catch (error) {
    console.error('Get artisans error:', error);
    res.status(500).json({ error: 'Failed to fetch artisans' });
  }
});

module.exports = router;