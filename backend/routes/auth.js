const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

const authRouter = express.Router();

// Database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

// Register
authRouter.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    
    try {
        // Check if user exists
        const [existing] = await db.execute(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role || 'student']
        );
        
        res.status(201).json({ 
            message: 'User registered successfully',
            userId: result.insertId 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Store in session
        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.username = user.username;
        
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout
authRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Check session
authRouter.get('/session', (req, res) => {
    if (req.session.userId) {
        res.json({
            loggedIn: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                role: req.session.role
            }
        });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = authRouter;