// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth header received:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = await User.findById(decoded.id).select("-password");
    console.log("Authenticated user:", req.user);
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { authenticate, isAdmin };
