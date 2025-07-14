import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [totalTruckers, setTotalTruckers] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [truckersRes, documentsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/dashboard/total_truckers`),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/dashboard/total_documents`)
        ]);

        if (!truckersRes.ok) throw new Error('Failed to fetch total truckers.');
        if (!documentsRes.ok) throw new Error('Failed to fetch total documents.');

        const truckersData = await truckersRes.json();
        const documentsData = await documentsRes.json();

        setTotalTruckers(truckersData.total_truckers_registered);
        setTotalDocuments(documentsData.total_trucking_documents_uploaded);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="content-card">
      <h2>Warehouse Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-box">
          <h3>Total Truckers Registered:</h3>
          <p>{totalTruckers}</p>
        </div>
        <div className="stat-box">
          <h3>Total Trucking Documents Uploaded:</h3>
          <p>{totalDocuments}</p>
        </div>
      </div>
      <p className="info-note yellow-background">
        <i className="icon">🚚</i> Did you know? The average trucker in India covers over <strong>4000 km per week</strong>, making it essential to keep their compliance docs up-to-date.
      </p>
      <p className="info-note yellow-background">
        <i className="icon">📄</i> Ensure all trucking personnel upload documents like <strong>vehicle fitness certificates, road permits</strong>, and <strong>driver medical records</strong> along with standard PAN/Aadhar paperwork.
      </p>
      <p className="info-note yellow-background">
        <i className="icon">🛣️</i> Smooth logistics = smoother highways.
      </p>
    </div>
  );
}

export default Dashboard;
