import express from 'express';
const router = express.Router();

import { body, validationResult } from 'express-validator';
import { genSalt, hash } from 'bcryptjs';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

import pool from '../db.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Registration Route (POST /api/auth)
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
    const role = 'user'; // default role assigned on registration

    try {
      // Check if user exists by email or employee ID
      const userExists = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR Id = $2",
        [email, Id]
      );
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      // Insert user with role
      const newUser = await pool.query(
        `INSERT INTO users (email, password, name, dob, address, phone, Id, role)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING emp_id, id, email, name, dob, address, phone, Id, role, created_at`,
        [email, hashedPassword, name, dob, address, phone, Id, role]
      );

      const user = newUser.rows[0];
      // Create JWT token with userId (emp_id)
      const token = sign({ userId: user.emp_id }, JWT_SECRET, { expiresIn: "1h" });

      // Respond with token and user info (including role)
      res.json({ token, user });
    } catch (err) {
      console.error(err.message);
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
    const userEmail = decoded.email;  // <-- get email from token

    const { rows } = await pool.query(
      "SELECT emp_id, id, email, name, phone, role FROM users WHERE email = $1",
      [userEmail]    // query by email now
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
