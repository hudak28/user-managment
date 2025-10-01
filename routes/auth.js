// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
require('dotenv').config();
// Register
router.post('/register', async (req, res) => {
try {
const { username, email, password, role } = req.body;
if (!username || !email || !password) return res.status(400).json({
message: 'username, email and password are required' });
// check existing username or email
const existing = await User.findOne({ where: { [Op.or]: [{ username }, {
email }] } });
if (existing) return res.status(400).json({ message: 'Username or email already exists' });
const hashed = await bcrypt.hash(password, 10);
const user = await User.create({ username, email, password: hashed, role:
role || 'user' });
res.status(201).json({ user: user.toJSON() });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error', error: err.message });
}
});
// Login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
const user = await User.findOne({ where: { email } });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });
const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(400).json({ message: 'Invalid credentials' });
const token = jwt.sign({ id: user.id, role: user.role },
process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
res.json({ token, user: user.toJSON() });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});
module.exports = router;