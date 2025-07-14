import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ empid: '', files: {} });

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: {
        ...formData.files,
        [e.target.name]: e.target.files[0],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('empid', formData.empid);
    Object.entries(formData.files).forEach(([key, file]) => {
      data.append(key, file);
    });

    try {
      const res = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        alert('Documents uploaded successfully');
        navigate('/dashboard');
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Error uploading documents');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Trucker Documents</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="empid"
          placeholder="Trucker/Employee ID"
          className="w-full p-2 rounded border"
          onChange={(e) => setFormData({ ...formData, empid: e.target.value })}
          required
        />
        {['resume', 'educational_certificates', 'offer_letters', 'pan_card', 'aadhar_card', 'form_16_or_it_returns'].map((field) => (
          <input
            key={field}
            type="file"
            name={field}
            onChange={handleFileChange}
            className="w-full"
            required
          />
        ))}
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  );
}
