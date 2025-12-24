const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true for HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Add Routing
const authRouter = require('./routes/auth');
const eventRoutes = require('./routes/events');

app.use('/api/auth', authRouter);
app.use('/api/events', eventRoutes);


// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add Exam
const examRoutes = require('./routes/exams');
app.use('/api/exams', examRoutes);