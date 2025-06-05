import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import countRoutes from './routes/countRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import authRoutes from './routes/authRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
console.log('Imported loginRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true); // Allow all localhost ports (for dev)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json());

app.get('/api/auth/me', (req, res) => {
  res.json({ message: "User data here" });
});

app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/login', loginRoutes); 
console.log('Registering login routes...'); // <- This mounts all routes in loginRoutes on /api/login
app.use('/api/user', userRoutes); 
app.use('/api/counts', countRoutes); 

console.log('✅ All routes registered. Starting server...');

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
