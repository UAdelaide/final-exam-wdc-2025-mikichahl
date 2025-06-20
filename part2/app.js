const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const db = require('./models/db');

const app = express();
// setup express-session to track login state
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// get all dogs
app.get('/api/dogs', async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT d.dog_id, d.name, d.size, d.owner_id
        FROM Dogs d
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'failed to retrieve dogs', err });
    }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;