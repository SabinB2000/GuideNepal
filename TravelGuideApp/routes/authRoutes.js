const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

// ✅ Signup Route
router.post("/signup", registerUser);

// ✅ Login Route
router.post("/login", loginUser);

// ✅ Profile Route (Protected)
router.get("/profile/me", authenticate, getProfile);

module.exports = router;
