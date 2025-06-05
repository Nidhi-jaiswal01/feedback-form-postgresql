import express from 'express';
const router = express.Router();
import pool from '../db.js';  // default import of pool

// Add new feedback
router.post('/', async (req, res) => {
  try {
    const {
      email,
      name,
      category,
      communication,
      diversity,
      leadership,
      foodservice,
      recognition,
      message,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO feedback (email, name, category, communication, diversity, leadership, foodservice, recognition, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [email, name, category, communication, diversity, leadership, foodservice, recognition, message]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('INSERT ERROR:', err.stack);  // full error stack
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if feedback already exists for an email
router.get('/check/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const feedbackExists = await pool.query(
      'SELECT 1 FROM feedback WHERE email = $1 LIMIT 1',
      [email]
    );
    if (feedbackExists.rowCount > 0) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    console.error('Error checking feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// Get all feedback
router.get('/', async (req, res) => {
  try {
    const { category, email } = req.query;  // get email from query
    let query = 'SELECT * FROM feedback';
    let params = [];
    let conditions = [];

    if (category) {
      conditions.push(`category = $${conditions.length + 1}`);
      params.push(category);
    }

    if (email) {
      conditions.push(`email = $${conditions.length + 1}`);
      params.push(email);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('DB Error in GET /api/feedbacks:', err.message);
    res.status(500).json({ error: 'Server error while fetching feedbacks.' });
  }
});

router.get('/department-count', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT category AS department, COUNT(*) AS count
      FROM feedback
      GROUP BY category
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching department counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;

