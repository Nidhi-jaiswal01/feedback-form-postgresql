import express from 'express';
const router = express.Router();
import pool from '../db.js';  // default import of pool

// Add new feedback
router.post('/', async (req, res) => {
  try {
    const {
      email,
      name,
      userid,
      category, // full department name (e.g., "Finance")
      communication,
      diversity,
      leadership,
      foodservice,
      recognition,
      message,
    } = req.body;

    // Get current year and month
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // "24"
    const month = String(now.getMonth() + 1).padStart(2, '0'); // "06"

    // Get first two uppercase letters of category
    const deptCode = category.slice(0, 2).toUpperCase(); // "FI"

    // Count how many feedbacks already exist in the same department/month
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM feedback 
       WHERE UPPER(SUBSTRING(category, 1, 2)) = $1 
       AND TO_CHAR(created_at, 'YY-MM') = $2`,
      [deptCode, `${year}-${month}`]
    );

    const sequence = String(parseInt(countResult.rows[0].count) + 1).padStart(3, '0');

    // Final ID format
    const id = `${deptCode}/${year}/${month}/${sequence}`;

    // Insert feedback with custom ID
    const result = await pool.query(
      `INSERT INTO feedback 
      (id, userid, email, name, category, communication, diversity, leadership, foodservice, recognition, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)
      RETURNING *`,
      [id, userid, email, name, category, communication, diversity, leadership, foodservice, recognition, message]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('INSERT ERROR:', err.stack);
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

