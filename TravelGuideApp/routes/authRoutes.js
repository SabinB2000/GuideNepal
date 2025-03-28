const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile/me", protect, getProfile);

module.exports = router;
