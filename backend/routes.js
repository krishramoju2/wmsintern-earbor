// backend/routes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("./db");

const upload = multer({ dest: "uploads/" });

// Create employee
router.post("/employee", (req, res) => {
  const {
    name,
    date_of_birth,
    address,
    contact_number,
    pan_number,
    aadhar_number,
  } = req.body;

  db.run(
    `INSERT INTO employees (name, date_of_birth, address, contact_number, pan_number, aadhar_number) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, date_of_birth, address, contact_number, pan_number, aadhar_number],
    function (err) {
      if (err) return res.status(500).json({ detail: "Failed to insert." });
      return res.json({ id: this.lastID });
    }
  );
});

// List employees
router.get("/employee", (req, res) => {
  db.all(`SELECT * FROM employees`, [], (err, rows) => {
    if (err) return res.status(500).json({ detail: "Failed to list." });
    res.json(rows);
  });
});

// Get by ID
router.get("/employee/:id", (req, res) => {
  db.get(`SELECT * FROM employees WHERE id = ?`, [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ detail: "Not found." });
    res.json(row);
  });
});

// Search
router.get("/employee/search", (req, res) => {
  const name = `%${req.query.name}%`;
  db.all(`SELECT * FROM employees WHERE name LIKE ?`, [name], (err, rows) => {
    if (err) return res.status(500).json({ detail: "Failed to search." });
    res.json(rows);
  });
});

// Upload documents
router.post("/files/upload/:id", upload.fields([
  { name: "resume" },
  { name: "educational_certificates" },
  { name: "offer_letters" },
  { name: "pan_card" },
  { name: "aadhar_card" },
  { name: "form_16_or_it_returns" },
]), (req, res) => {
  const empId = req.params.id;
  const files = req.files;
  const stmt = db.prepare(
    `INSERT INTO documents (employee_id, doc_type, file_path) VALUES (?, ?, ?)`
  );

  try {
    Object.keys(files).forEach((key) => {
      const file = files[key][0];
      const finalPath = `uploads/${empId}_${key}_${file.originalname}`;
      fs.renameSync(file.path, finalPath);
      stmt.run(empId, key, finalPath);
    });
    stmt.finalize();
    res.json({ message: "Uploaded" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ detail: "Upload failed." });
  }
});

// Stats
router.get("/stats/employees", (req, res) => {
  db.get(`SELECT COUNT(*) as count FROM employees`, (err, row) => {
    if (err) return res.status(500).json({ detail: "Error" });
    res.json(row);
  });
});

router.get("/stats/documents", (req, res) => {
  db.get(`SELECT COUNT(*) as count FROM documents`, (err, row) => {
    if (err) return res.status(500).json({ detail: "Error" });
    res.json(row);
  });
});

module.exports = router;
