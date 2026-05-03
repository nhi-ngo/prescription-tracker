import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
	const [authorizations, setAuthorizations] = useState([]);

	const [formData, setFormData] = useState({
		patient_name: '',
		medication: '',
		status: 'Pending',
	});

	// Fetch authorizations
	const fetchAuthorizations = async () => {
		try {
			const response = await axios.get('http://localhost:3000/authorizations');
			setAuthorizations(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAuthorizations();
	}, []);

	// Handle form typing
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Add authorization
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await axios.post('http://localhost:3000/authorizations', formData);

			setFormData({
				patient_name: '',
				medication: '',
				status: 'Pending',
			});

			fetchAuthorizations();
		} catch (error) {
			console.error(error);
		}
	};

	// Update status
	const updateStatus = async (id, status) => {
		try {
			await axios.patch(`http://localhost:3000/authorizations/${id}`, { status });

			fetchAuthorizations();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial' }}>
			<h1>Prescription Authorization Tracker</h1>

			{/* Form */}
			<form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
				<input
					type='text'
					name='patient_name'
					placeholder='Patient Name'
					value={formData.patient_name}
					onChange={handleChange}
					required
				/>

				<input
					type='text'
					name='medication'
					placeholder='Medication'
					value={formData.medication}
					onChange={handleChange}
					required
					style={{ marginLeft: '10px' }}
				/>

				<button type='submit' style={{ marginLeft: '10px' }}>
					Add
				</button>
			</form>

			{/* Authorization List */}
			{authorizations.map((item) => (
				<div
					key={item.id}
					style={{
						border: '1px solid #ccc',
						padding: '10px',
						marginBottom: '10px',
					}}
				>
					<h3>{item.patient_name}</h3>

					<p>Medication: {item.medication}</p>

					<select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)}>
						<option>Pending</option>
						<option>Approved</option>
						<option>Denied</option>
					</select>
				</div>
			))}
		</div>
	);
}

export default App;
