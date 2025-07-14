// backend/index.js

import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import pg from "pg";

const app = express();
const port = process.env.PORT || 8080;

// PostgreSQL setup
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/warehouse_db",
});

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Routes
app.get("/employee", async (req, res) => {
  const result = await pool.query("SELECT * FROM employees ORDER BY id DESC");
  res.json(result.rows);
});

app.get("/employee/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM employees WHERE id = $1", [id]);
  if (result.rows.length === 0) return res.status(404).json({ detail: "Employee not found" });
  res.json(result.rows[0]);
});

app.get("/employee/search", async (req, res) => {
  const { name } = req.query;
  const result = await pool.query("SELECT * FROM employees WHERE name ILIKE $1", [`%${name}%`]);
  res.json(result.rows);
});

app.post("/employee", async (req, res) => {
  const { name, date_of_birth, address, contact_number, pan_number, aadhar_number } = req.body;
  const result = await pool.query(
    `INSERT INTO employees (name, date_of_birth, address, contact_number, pan_number, aadhar_number)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [name, date_of_birth, address, contact_number, pan_number, aadhar_number]
  );
  res.status(201).json({ id: result.rows[0].id });
});

app.post("/files/upload/:id", upload.fields([
  { name: "resume" },
  { name: "educational_certificates" },
  { name: "offer_letters" },
  { name: "pan_card" },
  { name: "aadhar_card" },
  { name: "form_16_or_it_returns" }
]), async (req, res) => {
  const { id } = req.params;
  const files = req.files;
  try {
    await pool.query(
      `INSERT INTO documents (employee_id, resume, educational_certificates, offer_letters, pan_card, aadhar_card, form_16_or_it_returns)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, files.resume[0].filename, files.educational_certificates[0].filename,
        files.offer_letters[0].filename, files.pan_card[0].filename,
        files.aadhar_card[0].filename, files.form_16_or_it_returns[0].filename]
    );
    res.status(200).json({ message: "Files uploaded" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ detail: "File upload failed" });
  }
});

app.get("/stats/employees", async (req, res) => {
  const result = await pool.query("SELECT COUNT(*) FROM employees");
  res.json({ count: parseInt(result.rows[0].count) });
});

app.get("/stats/documents", async (req, res) => {
  const result = await pool.query("SELECT COUNT(*) FROM documents");
  res.json({ count: parseInt(result.rows[0].count) });
});

app.listen(port, () => console.log(`✅ Backend running on http://localhost:${port}`));
