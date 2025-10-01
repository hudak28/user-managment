// middleware/authorize.js
exports.isAdmin = (req, res, next) => {
if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
if (req.user.role !== 'admin') return res.status(403).json({ message:
'Forbidden — admin only' });
next();
};
exports.isAdminOrSelf = (req, res, next) => {
const targetId = parseInt(req.params.id, 10);
if (req.user.role === 'admin' || req.user.id === targetId) {
return next();
}
return res.status(403).json({ message: 'Forbidden' });
};