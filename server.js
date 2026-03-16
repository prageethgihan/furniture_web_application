import express from 'express';
import sqlite3 from 'sqlite3';
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

// Create SQLite database connection
const db = new sqlite3.Database('./furniture.db', (err) => {
    if (err) {
        console.error('❌ SQLite Connection Failed:', err.message);
    } else {
        console.log('✅ SQLite Connected successfully!');
    }
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
        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT DEFAULT 'user',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('✅ Users table is ready.');

        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS designs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    design_data TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('✅ Designs table is ready.');

        // Insert default superadmin
        const defaultEmail = 'superadmin@gmail.com';
        const defaultPassword = '123456789'; // In production, we should hash this

        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [defaultEmail], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!existingUser) {
            await new Promise((resolve, reject) => {
                db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [defaultEmail, defaultPassword, 'superadmin'], function(err) {
                    if (err) reject(err);
                    else resolve();
                });
            });
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
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ? AND password = ?', [emailToCheck, password], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (user) {
            res.json({ success: true, user: { email: user.email, role: user.role } });
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
        const designs = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM designs ORDER BY updated_at DESC', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        res.json(designs);
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
            await new Promise((resolve, reject) => {
                db.run(
                    'UPDATE designs SET name = ?, design_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [name, JSON.stringify(design_data), id],
                    function(err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
            console.log(`✅ Design updated! (ID: ${id})`);
            res.json({ message: 'Design updated successfully', id });
        } else {
            const result = await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO designs (name, design_data) VALUES (?, ?)',
                    [name || 'Untitled Design', JSON.stringify(design_data)],
                    function(err) {
                        if (err) reject(err);
                        else resolve({ insertId: this.lastID });
                    }
                );
            });
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
