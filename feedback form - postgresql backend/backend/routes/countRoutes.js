import { Router } from 'express';
import pool from '../db.js'; 
const router = Router();

router.get('/', async (req, res) => {
  try {
    const userCountResult = await pool.query('SELECT COUNT(*) FROM users');
    const feedbackCountResult = await pool.query('SELECT COUNT(*) FROM feedback');

    const userCount = parseInt(userCountResult.rows[0].count, 10);
    const feedbackCount = parseInt(feedbackCountResult.rows[0].count, 10);

    res.json({ userCount, feedbackCount });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
