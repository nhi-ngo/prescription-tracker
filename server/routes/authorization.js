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

// CREATE authorization
router.post('/', async (req, res) => {
	try {
		const { patient_name, medication, status } = req.body;

		const result = await pool.query(
			`INSERT INTO authorizations
      (patient_name, medication, status)
      VALUES ($1,$2,$3)
      RETURNING *`,
			[patient_name, medication, status],
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: 'Failed to create authorization' });
	}
});

// UPDATE status
router.patch('/:id', async (req, res) => {
	try {
		const { status } = req.body;

		const result = await pool.query(
			`UPDATE authorization
      SET status = $1
      WHERE id = $2
      RETURNING *`,
			[status, req.params.id],
		);

		res.json(result.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: 'Failed to update status' });
	}
});

module.exports = router;
