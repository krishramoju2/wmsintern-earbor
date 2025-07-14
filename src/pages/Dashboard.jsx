import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const empRes = await axios.get('/api/stats/employees');
        const docRes = await axios.get('/api/stats/documents');

        setEmployeeCount(empRes.data.count);
        setDocumentCount(docRes.data.count);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>📊 Warehouse Dashboard</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Total Truckers Registered: {employeeCount}</div>
        <div style={{ background: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(employeeCount * 10, 100)}%`,
              height: '20px',
              backgroundColor: '#007bff'
            }}
          ></div>
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Total Trucking Documents Uploaded: {documentCount}</div>
        <div style={{ background: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(documentCount * 10, 100)}%`,
              height: '20px',
              backgroundColor: '#28a745'
            }}
          ></div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', background: '#fff3cd', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
        <p>🚛 <strong>Did you know?</strong> The average trucker in India covers over <strong>4000 km per week</strong>, making it essential to keep their compliance docs up-to-date.</p>
        <ul>
          <li>📄 Ensure all trucking personnel upload documents like <strong>vehicle fitness certificates</strong>, <strong>road permits</strong>, and <strong>driver medical records</strong>.</li>
          <li>🗂 Standard PAN/Aadhar paperwork is still mandatory.</li>
          <li>🛣 Smooth logistics = smoother highways.</li>
        </ul>
      </div>
    </div>
  );
}
