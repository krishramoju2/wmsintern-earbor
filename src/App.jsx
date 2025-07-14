// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          🚛📦 Warehouse & Trucker Management
        </h1>
        <nav className="mb-6 flex gap-4 text-blue-600">
          <Link to="/register">Register</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/search">Search</Link>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
