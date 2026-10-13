const adminOnly = (req, res, next) => {
    if (req.userRole !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admins only."
        });
    }

    next();
};

module.exports = { adminOnly };