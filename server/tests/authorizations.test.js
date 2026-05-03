const request = require('supertest');
const app = require('../server');

describe('Authorization API', () => {
	// GET test
	test('GET /authorizations should return 200', async () => {
		const response = await request(app).get('/authorizations');

		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
	});

	// POST success
	test('POST /authorizations should create new authorization', async () => {
		const newAuthorization = {
			patient_name: 'Test patient',
			medication: 'Test medication',
			status: 'Pending',
			notes: 'Test note',
		};

		const response = await request(app).post('/authorizations').send(newAuthorization);

		expect(response.statusCode).toBe(201);
		expect(response.body.patient_name).toBe('Test patient');
		expect(response.body.medication).toBe('Test medication');
	});

	// POST validation failure (missing fields)
	test('POST /authorizations fails when missing required fields', async () => {
		const res = await request(app).post('/authorizations').send({
			medication: 'Test Med',
		});

		expect(res.statusCode).toBe(400);
	});

	// PATCH update status + notes
	test('PATCH /authorizations updates status and notes', async () => {
		const res = await request(app).patch('/authorizations/1').send({
			status: 'Approved',
			notes: 'Updated via test',
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.status).toBe('Approved');
	});
});
