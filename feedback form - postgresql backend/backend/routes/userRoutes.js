import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();

// Login route with JWT token creation
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user /* && password is correct */) {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
  u.serial_id,u.id, u.name, u.email, u.phone, u.address, u.dob,
  CASE WHEN f.email IS NOT NULL THEN true ELSE false END AS has_submitted_feedback
FROM users u
LEFT JOIN feedback f ON u.email = f.email
`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users and their feedback submission status
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
  u.serial_id, u.id, u.name, u.email, u.phone, u.address, u.dob
FROM users u
INNER JOIN feedback f ON u.email = f.email
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching feedback status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /users/feedback-status/not-submitted
router.get('/not', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.serial_id,u.id, u.name, u.email, u.phone, u.address, u.dob
      FROM users u
      WHERE NOT EXISTS (
        SELECT 1 FROM feedback f WHERE f.email = u.email
      )
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching non-submitters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get user by email
router.get('/:email', async (req, res) => {
  const email = decodeURIComponent(req.params.email);

  try {
    const result = await pool.query(
      'SELECT serial_id, id, name, email, phone, address, dob FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user by ID
router.put('/:id', async (req, res) => {
  const profileId = req.params.id;
  const { name, phone, address, dob, email } = req.body;

  console.log("Incoming PUT request to update user:");
  console.log({ profileId, name, phone, address, dob,email });

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1, phone = $2, address = $3, dob = $4, email = $5
       WHERE id = $6
       RETURNING *`,
      [name, phone, address, dob, email, profileId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user:', error); // <-- This is what we need the output from
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
