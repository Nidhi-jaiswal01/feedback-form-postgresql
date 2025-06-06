import express from 'express';
const router = express.Router();

import { body, validationResult } from 'express-validator';
import { genSalt, hash } from 'bcryptjs';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

import pool from '../db.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

router.post(
  "/",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
    body("dob").isDate().withMessage("Invalid date of birth"),
    body("address").notEmpty().withMessage("Address is required"),
    body("phone").matches(/^\d{10}$/).withMessage("Phone number must be exactly 10 digits"),
    body("Id").notEmpty().withMessage("Employee ID is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, dob, address, phone, Id } = req.body;
    const role = 'user'; // default role

    try {
      // Check if user already exists by email or Id
      const userExists = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR Id = $2",
        [email, Id]
      );
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate serial_id: YY/MM/nnn
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2); // "24"
      const month = String(now.getMonth() + 1).padStart(2, '0'); // "06"
      const period = `${year}/${month}`;

      const countRes = await pool.query(
        `SELECT COUNT(*) FROM users WHERE TO_CHAR(created_at, 'YY/MM') = $1`,
        [period]
      );

      const count = parseInt(countRes.rows[0].count, 10) + 1;
      const sequence = String(count).padStart(3, '0');
      const serial_id = `${period}/${sequence}`; 

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      // Insert user, return id (primary key) too
      const newUser = await pool.query(
        `INSERT INTO users (email, password, name, dob, address, phone, Id, role, serial_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, email, name, dob, address, phone, Id, role, serial_id, created_at`,
        [email, hashedPassword, name, dob, address, phone, Id, role, serial_id]
      );

      const user = newUser.rows[0];

      // Use JWT_SECRET variable here (not process.env.JWT_SECRET directly)
      const token = sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token, user });
    } catch (err) {
      console.error("Registration error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get Current User (GET /api/auth/me)
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No or invalid token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded.id;  // fallback on id if userId not found
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const { rows } = await pool.query(
      "SELECT serial_id, id, email, name, phone, role FROM users WHERE id = $1",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Error verifying token:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
});


export default router;
