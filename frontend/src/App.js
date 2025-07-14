import React, { useState } from 'react';
import './App.css'; // For general app styling
import RegisterEmployee from './components/RegisterEmployee';
import UploadDocuments from './components/UploadDocuments';
import ViewEmployees from './components/ViewEmployees';
import Dashboard from './components/Dashboard';
import LiveSearch from './components/LiveSearch';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // Initial active tab

  const renderContent = () => {
    switch (activeTab) {
      case 'register':
        return <RegisterEmployee />;
      case 'upload':
        return <UploadDocuments />;
      case 'view':
        return <ViewEmployees />;
      case 'dashboard':
        return <Dashboard />;
      case 'search':
        return <LiveSearch />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📦🚚 Warehouse & Trucker Management Dashboard</h1>
        <p>Manage employee data, trucker profiles, and critical logistics documents efficiently</p>
      </header>

      <nav className="tabs-container">
        <button onClick={() => setActiveTab('register')} className={activeTab === 'register' ? 'active' : ''}>
          <i className="icon">📝</i> Register Employee
        </button>
        <button onClick={() => setActiveTab('upload')} className={activeTab === 'upload' ? 'active' : ''}>
          <i className="icon">📤</i> Upload Documents
        </button>
        <button onClick={() => setActiveTab('view')} className={activeTab === 'view' ? 'active' : ''}>
          <i className="icon">👀</i> View Employees
        </button>
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
          <i className="icon">📊</i> Dashboard
        </button>
        <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active' : ''}>
          <i className="icon">🔍</i> Live Search
        </button>
      </nav>

      <main className="content-area">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>Did you know? A single trucker in India can travel over 90,000 KM per year ~ almost twice around the Earth!</p>
        <div className="note-section">
          <p>⚠️ <strong>Note:</strong> Truckers must submit their vehicle logbook and maintain on-time check-in/out logs. Use the document upload section for compliance.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
