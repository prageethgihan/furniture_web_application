import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

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

// Setup Initial Database Tables and Superadmin
const setupDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table is ready.');

        // Insert default superadmin
        const defaultEmail = 'superadmin@gmail.com';
        const defaultPassword = '123456789'; // In production, we should hash this

        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [defaultEmail]);
        if (rows.length === 0) {
            await pool.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [defaultEmail, defaultPassword, 'superadmin']);
            console.log('✅ Default superadmin created.');
        }
    } catch (error) {
        console.error('❌ Failed to setup database tables:', error);
    }
};
setupDatabase();

// POST: Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Also handling the typo the user made "gmial.com"
        const emailToCheck = email === 'superadmin@gmial.com' ? 'superadmin@gmail.com' : email;
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [emailToCheck, password]);

        if (rows.length > 0) {
            res.json({ success: true, user: { email: rows[0].email, role: rows[0].role } });
        } else {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
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
// For any other request, send back the index.html file
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, (err) => {
    if (err) {
        console.error('❌ Server failed to start:', err);
        return;
    }
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
