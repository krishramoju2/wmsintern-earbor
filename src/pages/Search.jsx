import React, { useState } from 'react';

const Search = () => {
  const [empId, setEmpId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    const id = e.target.value;
    setEmpId(id);
    setResult(null);
    setError('');

    if (!id) return;

    try {
      const res = await fetch(`http://localhost:8080/employee/${id}`);
      if (!res.ok) {
        setError('No matching trucker found.');
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Error fetching trucker info.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h2 className="text-xl font-bold mb-4">🔍 Search Trucker by ID</h2>
        <input
          type="number"
          value={empId}
          onChange={handleSearch}
          placeholder="Enter Trucker ID..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        />

        {error && <p className="text-red-600">{error}</p>}

        {result && (
          <div className="bg-blue-50 p-4 rounded shadow">
            <p><strong>ID:</strong> {result.id}</p>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Date of Birth:</strong> {result.date_of_birth}</p>
            <p><strong>Contact:</strong> {result.contact_number}</p>
            <p><strong>Address:</strong> {result.address}</p>
            <p><strong>PAN:</strong> {result.pan_number}</p>
            <p><strong>Aadhar:</strong> {result.aadhar_number}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
