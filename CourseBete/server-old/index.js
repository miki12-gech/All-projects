require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS CONFIGURATION ---
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://course-bete.vercel.app', // <--- CORRECT URL (From your error log)
        'https://course-bete.vercel.app/' // (Adding with slash just to be safe)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS for pre-checks
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json()); 

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');

app.use('/api', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
  res.send('CourseBete API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});