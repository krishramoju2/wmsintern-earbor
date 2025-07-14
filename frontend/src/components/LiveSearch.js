import React, { useState } from 'react';

function LiveSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSearchResults([]);

    if (!searchQuery) {
      setError("Please enter a Driver ID or Employee ID to search.");
      return;
    }

    const payload = {};
    if (!isNaN(searchQuery) && !searchQuery.includes('DL')) { // Assuming employee ID is numeric
      payload.employee_id = parseInt(searchQuery, 10);
    } else {
      payload.driver_id = searchQuery;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/search_truckers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setSearchResults(data);
          setMessage(`Found ${data.length} result(s).`);
        } else {
          setMessage('No truckers found matching your query.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to search truckers.');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
    }
  };

  return (
    <div className="content-card">
      <h2>Search Trucker by Driver ID / Employee ID</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Driver ID or Employee ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results:</h3>
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
              {searchResults.map((employee) => (
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
        </div>
      )}

      <p className="info-note yellow-background">
        <i className="icon">💡</i> Did you know? Truckers often carry over <strong>15+ official documents</strong> including route permits, fitness certificates, and load clearance forms alongside personal ID.
      </p>
      <p className="info-note yellow-background">
        <i className="icon">📦</i> Make sure each registered trucker has their <strong>PAN, Aadhar, and emergency contact</strong> verified in the system.
      </p>
    </div>
  );
}

export default LiveSearch;
