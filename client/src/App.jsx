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

	const [showModal, setShowModal] = useState(false);

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
		try {
			await axios.post(`${import.meta.env.VITE_API_URL}/authorizations`, formData);

			setFormData({
				patient_name: '',
				medication: '',
				status: 'Pending',
				notes: '',
			});

			setShowModal(false);
			fetchAuthorizations();
		} catch (error) {
			console.error('Failed to create authorization:', error);
		}
	};

	// Update status
	const updateStatus = async (id, status, notes) => {
		try {
			await axios.patch(`${import.meta.env.VITE_API_URL}/authorizations/${id}`, { status, notes });

			fetchAuthorizations();
		} catch (error) {
			console.error('Failed to update status', error);
		}
	};

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial', display: 'flex', justifyContent: 'center' }}>
			<div
				style={{
					width: '100%',
					maxWidth: '1100px',
				}}
			>
				<h1>Prescription Authorization Tracker</h1>

				<button
					onClick={() => setShowModal(true)}
					style={{
						marginBottom: '20px',
						padding: '8px 12px',
						cursor: 'pointer',
					}}
				>
					+ Add Authorization
				</button>

				{/* Filter by status */}
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
										<textarea
											name='notes'
											placeholder='Notes'
											value={item.notes || ''}
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
											style={{ width: '100%' }}
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

				{showModal && (
					<div
						style={{
							position: 'fixed',
							top: 0,
							left: 0,
							width: '100vw',
							height: '100vh',
							backgroundColor: 'rgba(0,0,0,0.5)',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								backgroundColor: 'white',
								padding: '20px',
								width: '400px',
								borderRadius: '8px',
							}}
						>
							<h3>Add Authorization</h3>

							<input
								name='patient_name'
								placeholder='Patient Name'
								value={formData.patient_name}
								onChange={handleChange}
								style={{ width: '100%', marginBottom: '10px' }}
							/>

							<input
								name='medication'
								placeholder='Medication'
								value={formData.medication}
								onChange={handleChange}
								style={{ width: '100%', marginBottom: '10px' }}
							/>

							<textarea
								name='notes'
								placeholder='Notes'
								value={formData.notes}
								onChange={handleChange}
								rows='4'
								style={{ width: '100%', marginBottom: '10px' }}
							/>

							<button onClick={() => handleSubmit()} style={{ marginRight: '10px' }}>
								Submit
							</button>

							<button onClick={() => setShowModal(false)}>Cancel</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
