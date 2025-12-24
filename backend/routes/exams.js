const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const examRouter = express.Router();

// Database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

// Middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Authentication required' });
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.session.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
};

// Get all exams
examRouter.get('/', requireAuth, async (req, res) => {
    try {
        const [exams] = await db.execute(`
            SELECT e.*, u.username as creator_name 
            FROM exams e 
            LEFT JOIN users u ON e.created_by = u.id
            ORDER BY e.exam_date ASC
        `);
        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get exams by date range
examRouter.get('/upcoming', requireAuth, async (req, res) => {
    try {
        const [exams] = await db.execute(`
            SELECT * FROM exams 
            WHERE exam_date >= CURDATE()
            ORDER BY exam_date ASC
            LIMIT 10
        `);
        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create exam (admin only)
examRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
    const {
        exam_name, course_code, course_name, exam_date,
        start_time, end_time, room_number, building,
        total_marks, passing_marks, examiner_id
    } = req.body;
    
    try {
        const [result] = await db.execute(
            `INSERT INTO exams 
            (exam_name, course_code, course_name, exam_date, start_time, end_time, 
             room_number, building, total_marks, passing_marks, examiner_id, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [exam_name, course_code, course_name, exam_date, start_time, end_time,
             room_number, building, total_marks, passing_marks, examiner_id, req.session.userId]
        );
        
        res.status(201).json({ 
            message: 'Exam scheduled successfully',
            examId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update exam
examRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const examData = req.body;
    
    try {
        const updateFields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(examData)) {
            if (value !== undefined) {
                updateFields.push(`${key} = ?`);
                values.push(value);
            }
        }
        
        values.push(id);
        
        await db.execute(
            `UPDATE exams SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );
        
        res.json({ message: 'Exam updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete exam
examRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    
    try {
        await db.execute('DELETE FROM exams WHERE id = ?', [id]);
        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get exam by course
examRouter.get('/course/:code', requireAuth, async (req, res) => {
    const { code } = req.params;
    
    try {
        const [exams] = await db.execute(
            'SELECT * FROM exams WHERE course_code = ? ORDER BY exam_date ASC',
            [code]
        );
        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = examRouter;