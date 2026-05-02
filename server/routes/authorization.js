const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all authorizations
router.get('/', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM authorizations ORDER BY id DESC');

		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: 'Server error' });
	}
});

module.exports = router;
