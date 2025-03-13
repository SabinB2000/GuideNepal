const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
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

module.exports = { protect };
