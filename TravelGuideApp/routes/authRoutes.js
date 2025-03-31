const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware"); // ✅ FIXED NAME

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile/me", authenticate, getProfile); // ✅ FIXED NAME

module.exports = router;
