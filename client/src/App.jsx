import { useState, useEffect } from 'react';
import axios from 'axios';

const getStatusStyle = (status) => {
	switch (status) {
		case 'Approved':
			return { backgroundColor: '#d4edda', color: '#155724' };

		case 'Pending':
			return { backgroundColor: '#fff3cd', color: '#856404' };

		case 'Denied':
			return { backgroundColor: '#f8d7da', color: '#721c24' };

		default:
			return {};
	}
};

function App() {
	const [authorizations, setAuthorizations] = useState([]);

	const [formData, setFormData] = useState({
		patient_name: '',
		medication: '',
		status: 'Pending',
		notes: '',
	});

	const [filter, setFilter] = useState('All');

	// Fetch authorizations
	const fetchAuthorizations = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_API_URL}/authorizations`);
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
			await axios.post(`${import.meta.env.VITE_API_URL}/authorizations`, formData);

			setFormData({
				patient_name: '',
				medication: '',
				status: 'Pending',
				notes: '',
			});

			fetchAuthorizations();
		} catch (error) {
			console.error(error);
		}
	};

	// Update status
	const updateStatus = async (id, status, notes) => {
		try {
			await axios.patch(`${import.meta.env.VITE_API_URL}/authorizations/${id}`, { status, notes });

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

				<input
					type='text'
					name='notes'
					placeholder='Notes'
					value={formData.notes}
					onChange={handleChange}
					style={{ marginLeft: '10px' }}
				/>

				<button type='submit' style={{ marginLeft: '10px' }}>
					Add
				</button>
			</form>

			<div style={{ marginBottom: '15px' }}>
				{['All', 'Pending', 'Approved', 'Denied'].map((status) => (
					<button
						key={status}
						onClick={() => setFilter(status)}
						style={{
							marginRight: '5px',
							fontWeight: filter === status ? 'bold' : 'normal',
							textDecoration: filter === status ? 'underline' : 'none',
						}}
					>
						{status}
					</button>
				))}
			</div>

			{/* Authorization Table */}
			<table
				border='1'
				cellPadding='10'
				style={{
					width: '100%',
					borderCollapse: 'collapse',
					marginTop: '20px',
					tableLayout: 'fixed',
				}}
			>
				<thead>
					<tr>
						<th scope='col'>Patient</th>
						<th scope='col'>Medication</th>
						<th scope='col'>Status</th>
						<th scope='col'>Notes</th>
						<th scope='col'>Created</th>
						<th scope='col'>Updated</th>
						<th scope='col'>Actions</th>
					</tr>
				</thead>

				<tbody>
					{authorizations
						.filter((item) => {
							if (filter === 'All') return true;
							return item.status === filter;
						})
						.map((item) => (
							<tr key={item.id} scope='row'>
								<td>{item.patient_name}</td>

								<td>{item.medication}</td>

								<td>
									<select
										value={item.status}
										onChange={(e) => {
											const updated = authorizations.map((auth) =>
												auth.id === item.id
													? {
															...auth,
															status: e.target.value,
														}
													: auth,
											);

											setAuthorizations(updated);
										}}
										style={{
											padding: '4px 8px',
											borderRadius: '6px',
											textAlign: 'center',
											...getStatusStyle(item.status),
										}}
									>
										<option>Pending</option>
										<option>Approved</option>
										<option>Denied</option>
									</select>
								</td>

								<td>
									<input
										type='text'
										value={item.notes || ''}
										style={{
											width: '95%',
											boxSizing: 'border-box',
										}}
										onChange={(e) => {
											const updated = authorizations.map((auth) =>
												auth.id === item.id
													? {
															...auth,
															notes: e.target.value,
														}
													: auth,
											);

											setAuthorizations(updated);
										}}
									/>
								</td>

								<td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>

								<td>{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-'}</td>

								<td>
									<button onClick={() => updateStatus(item.id, item.status, item.notes)}>Save</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}

export default App;
