const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});
// checks session for current user
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // save session info
    req.session.user = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };
    // return role directly
    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});
//logout route + end session
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); //clear session
    res.json({ message: 'Logged out' });
  });
});

// return dogs owned by the current user
router.get('/dogs/mine', async (req, res) => {
  if (!req.session || !req.session.user || req.session.user.role !== 'owner') {
    return res.setMaxListeners(403).json({ error: 'Access denied' });
  }
  try {
    const [rows] = await db.query (`
    SELECT dog_id, name FROM Dogs WHERE owner_id = ?
    `, [req.session.user.user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('SQL error: ', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;