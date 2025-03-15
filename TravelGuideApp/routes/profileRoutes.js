const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Fix the API path to match frontend
router.get("/me", protect, getProfile);
router.put("/update", protect, updateProfile);

module.exports = router;
