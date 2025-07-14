// backend/routes/employeeRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /api/employee
router.post("/employee", (req, res) => {
  const { name, dob, address, contact, pan, aadhar } = req.body;
  if (!name || !dob || !address || !contact || !pan || !aadhar) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO employees (name, dob, address, contact, pan, aadhar) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, dob, address, contact, pan, aadhar],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Employee created", id: this.lastID });
    }
  );
});

// GET /api/employee
router.get("/employee", (req, res) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/employee/:id
router.get("/employee/:id", (req, res) => {
  db.get("SELECT * FROM employees WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Employee not found" });
    res.json(row);
  });
});

// GET /api/search?query=
router.get("/search", (req, res) => {
  const query = `%${req.query.query}%`;
  db.all("SELECT * FROM employees WHERE name LIKE ?", [query], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/stats
router.get("/stats", (req, res) => {
  db.get("SELECT COUNT(*) AS count FROM employees", [], (err, empRow) => {
    if (err) return res.status(500).json({ error: err.message });

    fs.readdir(uploadDir, (err, files) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ employees: empRow.count, documents: files.length });
    });
  });
});

// POST /api/upload/:id
router.post("/upload/:id", upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }
  res.json({ message: "Files uploaded successfully." });
});

module.exports = router;
