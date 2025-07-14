import React, { useEffect, useState } from 'react';

function ViewEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employees/`);
        if (!response.ok) {
          throw new Error('Failed to fetch employee data. Please check the server connection.');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <p>Loading employees...</p>;
  }

  if (error) {
    return (
      <div className="error-message-container">
        <p className="error-message">❌ {error}</p>
      </div>
    );
  }

  return (
    <div className="content-card">
      <h2>Employees List</h2>
      {employees.length === 0 ? (
        <p>No employees registered yet.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Contact</th>
              <th>DL Number</th>
              <th>Aadhar Number</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.dob}</td>
                <td>{employee.contact_number}</td>
                <td>{employee.driving_license_number}</td>
                <td>{employee.aadhar_number}</td>
                <td>{employee.home_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewEmployees;
