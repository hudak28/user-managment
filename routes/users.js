// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin, isAdminOrSelf } = require('../middleware/authorize');
// GET /users (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
try {
const users = await User.findAll({ attributes: { exclude: ['password'] } });
res.json(users);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});
// GET /users/:id (admin or self)
router.get('/:id', authenticateToken, isAdminOrSelf, async (req, res) => {
try {
const user = await User.findByPk(req.params.id, { attributes: { exclude:
['password'] } });
if (!user) return res.status(404).json({ message: 'User not found' });
res.json(user);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});
// PUT /users/:id (admin or self)
router.put('/:id', authenticateToken, isAdminOrSelf, async (req, res) => {
try {
const { username, email, password, role } = req.body;
const user = await User.findByPk(req.params.id);
if (!user) return res.status(404).json({ message: 'User not found' });
// Only admins can change role
if (role && req.user.role !== 'admin') return res.status(403).json({
message: 'Only admins can change roles' });
if (username) user.username = username;
if (email) user.email = email;
if (password) user.password = await bcrypt.hash(password, 10);
if (role) user.role = role;
await user.save();
res.json({ user: user.toJSON() });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});
// DELETE /users/:id (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
try {
const user = await User.findByPk(req.params.id);
if (!user) return res.status(404).json({ message: 'User not found' });
await user.destroy();
res.json({ message: 'User deleted' });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});
module.exports = router;