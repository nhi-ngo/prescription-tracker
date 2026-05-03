const request = require('supertest');
const app = require('../server');

describe('Authorization API', () => {
	// GET test
	test('GET /authorizations should return 200', async () => {
		const response = await request(app).get('/authorizations');

		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
	});

	// POST test
	test('POST /authorizations should create new authorization', async () => {
		const newAuthorization = {
			patient_name: 'Test patient',
			medication: 'Test medication',
			status: 'Pending',
		};

		const response = await request(app).post('/authorizations').send(newAuthorization);

		expect(response.statusCode).toBe(201);

		expect(response.body.patient_name).toBe('Test patient');

		expect(response.body.medication).toBe('Test medication');

		expect(response.body.status).toBe('Pending');
	});
});
