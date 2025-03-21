const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    // ✅ Refresh session user data after update
    req.user = { ...req.user.toObject(), username: req.user.username };
    req.session.save(() => next());
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = { requireAuth, requireAdmin };
