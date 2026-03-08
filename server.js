import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Create Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(conn => {
        console.log('✅ MySQL Connected successfully!');
        conn.release();
    })
    .catch(err => {
        console.error('❌ MySQL Connection Failed:', err.message);
    });

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// GET: Load all designs (or just the latest)
app.get('/api/designs', async (req, res) => {
    console.log('GET /api/designs requested');
    try {
        const [rows] = await pool.query('SELECT * FROM designs ORDER BY updated_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching designs:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// POST: Save or Update a design
app.post('/api/designs', async (req, res) => {
    console.log('POST /api/designs called');
    const { id, name, design_data } = req.body;

    try {
        if (id) {
            await pool.query(
                'UPDATE designs SET name = ?, design_data = ? WHERE id = ?',
                [name, JSON.stringify(design_data), id]
            );
            console.log(`✅ Design updated! (ID: ${id})`);
            res.json({ message: 'Design updated successfully', id });
        } else {
            const [result] = await pool.query(
                'INSERT INTO designs (name, design_data) VALUES (?, ?)',
                [name || 'Untitled Design', JSON.stringify(design_data)]
            );
            console.log(`✅ New Design saved! (ID: ${result.insertId})`);
            res.json({ message: 'Design saved successfully', id: result.insertId });
        }
    } catch (error) {
        console.error('Error saving design:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.listen(PORT, (err) => {
    if (err) {
        console.error('❌ Server failed to start:', err);
        return;
    }
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
