// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.authenticateToken = (req, res, next) => {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Access token required' });
jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
if (err) return res.status(403).json({ message: 'Invalid or expired token' });
// payload contains { id, role }
req.user = payload;
next();
});
};