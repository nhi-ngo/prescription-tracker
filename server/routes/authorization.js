const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all authorizations
router.get('/', async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;

		const offset = (page - 1) * limit;

		const result = await pool.query(
			`SELECT *
      FROM authorizations
      ORDER BY updated_at DESC
      LIMIT $1
      OFFSET $2`,
			[limit, offset],
		);

		const totalResult = await pool.query(`SELECT COUNT(*) FROM authorizations`);
		const total = parseInt(totalResult.rows[0].count);

		res.json({ pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }, data: result.rows });
	} catch (err) {
		console.error(err.message);

		res.status(500).json({ error: 'Server error' });
	}
});

// CREATE authorization
router.post('/', async (req, res) => {
	try {
		const { patient_name, medication, status, notes } = req.body;

		if (!patient_name || !medication) {
			return res.status(400).json({
				error: 'Patient name and medication are required',
			});
		}

		const existing = await pool.query(
			`SELECT *
      FROM authorizations
      WHERE LOWER(patient_name) = LOWER($1)
      AND LOWER(medication) = LOWER($2)`,
			[patient_name, medication],
		);

		if (existing.rows.length > 0) {
			return res.status(409).json({
				error: 'Authorization already exists for this patient and medication',
			});
		}

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
