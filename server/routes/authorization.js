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
		const { patient_name, medication, status, notes } = req.body;

		const result = await pool.query(
			`INSERT INTO authorizations
      (patient_name, medication, status, notes)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
			[patient_name, medication, status, notes],
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
		const { status, notes } = req.body;

		const result = await pool.query(
			`UPDATE authorizations
      SET status = $1,
          notes = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *`,
			[status, notes, req.params.id],
		);

		res.json(result.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: 'Failed to update status' });
	}
});

module.exports = router;
