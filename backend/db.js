// backend/db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'warehouse.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('❌ Failed to connect to SQLite:', err);
  else console.log('📦 Connected to SQLite DB');
});

// Initialize tables
const init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    pan_number TEXT NOT NULL,
    aadhar_number TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    resume TEXT,
    educational_certificates TEXT,
    offer_letters TEXT,
    pan_card TEXT,
    aadhar_card TEXT,
    form_16_or_it_returns TEXT,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  )`);
};

module.exports = { db, init };
