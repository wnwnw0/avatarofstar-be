const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM your_table');
    res.json(rows);
  } catch (error) {
    console.error('MySQL query error:', error);
    res.status(500).json({ message: 'Failed to fetch data from MySQL' });
  }
});

module.exports = router;