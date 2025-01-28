export function ensureAuthorRole(req, res, next) {
    if (req.user && req.user.role === 'author') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden: Only artists can perform this action' });
}