// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    address: '',
    contact: '',
    license: '',
    aadhar: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('Registration successful');
        navigate('/dashboard');
      } else {
        alert('Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 p-8 rounded-xl shadow-xl w-full max-w-md backdrop-blur">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Register Trucker Entry</h2>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Trucker Name"
          className="w-full p-2 mb-3 rounded bg-white bg-opacity-80"
          required
        />
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          placeholder="DOB"
          className="w-full p-2 mb-3 rounded bg-white bg-opacity-80"
          required
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Home Address"
          className="w-full p-2 mb-3 rounded bg-white bg-opacity-80"
          required
        />
        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full p-2 mb-3 rounded bg-white bg-opacity-80"
          required
        />
        <input
          type="text"
          name="license"
          value={form.license}
          onChange={handleChange}
          placeholder="Driving License Number"
          className="w-full p-2 mb-3 rounded bg-white bg-opacity-80"
          required
        />
        <input
          type="text"
          name="aadhar"
          value={form.aadhar}
          onChange={handleChange}
          placeholder="Aadhar Number"
          className="w-full p-2 mb-5 rounded bg-white bg-opacity-80"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-800 text-white font-bold py-2 px-4 rounded hover:bg-blue-900"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
