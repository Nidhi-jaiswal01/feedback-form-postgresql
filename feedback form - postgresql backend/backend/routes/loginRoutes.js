import express from 'express';
const router = express.Router();

import { body, validationResult } from 'express-validator';
import { compare } from 'bcryptjs';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import { authMiddleware } from '../middleware/authMiddleware.js';
import pool from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

console.log('loginRoutes loaded');

// Middleware to log all requests hitting this router (for debugging)
router.use((req, res, next) => {
  console.log(`[loginRoutes] ${req.method} ${req.originalUrl}`);
  next();
});

// Test GET route
router.get('/test', (req, res) => {
  console.log('GET /test route hit');
  res.send('Login route is working');
});

router.get("/", (req, res) => {
  res.send("Login endpoint is working. Use POST to log in.");
});

// POST login route
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Query user by email selecting explicit fields including role
      const userResult = await pool.query(
        'SELECT automated_id, id, name, email, phone, password, role FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const user = userResult.rows[0];

      // Compare password hash
      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Sign JWT token with user emp_id
      const token = sign({ userId: user.emp_id }, JWT_SECRET, { expiresIn: '1h' });

      // Return user info including role (excluding password)
      const { password: _, ...userWithoutPassword } = user;

      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// **Protected route using authMiddleware**
router.get('/protected', authMiddleware, async (req, res) => {
  try {
    // Fetch user info including role by emp_id from req.user
    const { rows } = await pool.query(
      'SELECT emp_id, id, name, email, phone, role FROM users WHERE emp_id = $1',
      [req.user]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Protected route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
