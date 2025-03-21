const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    // ✅ Refresh session user data
    req.user = { ...req.user.toObject(), username: req.user.username };
    req.session.save(() => next());
};

const requireAdmin = (req, res, next) => {
    console.log(req.user);
    if (!req.user || !req.user.roles.includes("admin")) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

const requireCreatorOrAdmin = (req, res, next) => {
    console.log(req.user);
    if (!req.user || (!req.user.roles.includes("creator") && !req.user.roles.includes("admin"))) {
        return res.status(403).json({ message: "Access denied. Only creators or admins can perform this action." });
    }
    next();
};

module.exports = { requireAuth, requireAdmin, requireCreatorOrAdmin };
