const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, adminSecret, batch, department, admin_type } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Enforce college email for students
  if (role !== 'admin' && !email.endsWith('@ashokacollege.in')) {
    return res.status(400).json({ message: 'Students must use their official @ashokacollege.in email address' });
  }

  if (role === 'admin' && adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ message: 'Invalid Admin Secret' });
  }

  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const userRole = role === 'admin' ? 'admin' : 'student';

    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role, batch, department, admin_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, password_hash, userRole, batch || null, department || null, admin_type || null]
    );

    const token = jwt.sign({ id: result.insertId, role: userRole, admin_type: admin_type || null }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ id: result.insertId, name, email, role: userRole, admin_type: admin_type || null, batch: batch || null, department: department || null, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, admin_type: user.admin_type }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, admin_type: user.admin_type, batch: user.batch, department: user.department, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Forgot Password (no email service – verify by known email and name, set new password)
router.post('/forgot-password', async (req, res) => {
  const { email, name, newPassword } = req.body;

  if (!email || !name || !newPassword) {
    return res.status(400).json({ message: 'Email, Full Name, and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ? AND name = ?', [email, name]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'No account found matching that email and name' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [password_hash, email]);

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// Update Password
router.put('/password', protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide both passwords' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = users[0];
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, req.user.id]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password update' });
  }
});

module.exports = router;
