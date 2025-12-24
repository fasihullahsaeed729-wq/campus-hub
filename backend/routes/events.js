const router = require('express').Router();

const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Get all events
router.get('/', requireAuth, async (req, res) => {
    try {
        const [events] = await db.execute(`
            SELECT e.*, u.username as creator_name 
            FROM events e 
            LEFT JOIN users u ON e.created_by = u.id
            ORDER BY e.date DESC
        `);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create event
router.post('/', requireAuth, async (req, res) => {
    const { title, description, date, time, location } = req.body;
    
    try {
        const [result] = await db.execute(
            'INSERT INTO events (title, description, date, time, location, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, date, time, location, req.session.userId]
        );
        
        res.status(201).json({ 
            message: 'Event created',
            eventId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update event (admin/creator only)
router.put('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { title, description, date, time, location } = req.body;
    
    try {
        // Check permission
        const [events] = await db.execute(
            'SELECT created_by FROM events WHERE id = ?',
            [id]
        );
        
        if (events.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        const event = events[0];
        const isAdmin = req.session.role === 'admin';
        const isCreator = event.created_by === req.session.userId;
        
        if (!isAdmin && !isCreator) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        await db.execute(
            'UPDATE events SET title=?, description=?, date=?, time=?, location=? WHERE id=?',
            [title, description, date, time, location, id]
        );
        
        res.json({ message: 'Event updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete event (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    
    try {
        await db.execute('DELETE FROM events WHERE id = ?', [id]);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;