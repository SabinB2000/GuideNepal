const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Auth middleware (renamed to 'authenticate')
const authenticate = async (req, res, next) => {
    let token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    try {
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) return res.status(401).json({ error: "User not found" });

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// ✅ Admin check middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    } else {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
};

module.exports = {
    authenticate,
    isAdmin
};
