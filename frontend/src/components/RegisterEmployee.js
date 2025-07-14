import React, { useState } from 'react';

function RegisterEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    home_address: '',
    contact_number: '',
    driving_license_number: '',
    aadhar_number: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/employees/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Trucker registered successfully!');
        setFormData({
          name: '', dob: '', home_address: '', contact_number: '', driving_license_number: '', aadhar_number: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to register trucker.');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
    }
  };

  return (
    <div className="form-card">
      <h2>Register Trucker Entry</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Trucker Name" value={formData.name} onChange={handleChange} required />
        <input type="date" name="dob" placeholder="dd / mm / yyyy" value={formData.dob} onChange={handleChange} required />
        <input type="text" name="home_address" placeholder="Home Address" value={formData.home_address} onChange={handleChange} required />
        <input type="text" name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} required />
        <input type="text" name="driving_license_number" placeholder="Driving License Number" value={formData.driving_license_number} onChange={handleChange} required />
        <input type="text" name="aadhar_number" placeholder="Aadhar Number" value={formData.aadhar_number} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default RegisterEmployee;
