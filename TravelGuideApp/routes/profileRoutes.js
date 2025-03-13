const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController"); // ✅ Fix import
const { protect } = require("../middleware/authMiddleware"); 

const router = express.Router();

router.get("/me", protect, getProfile); // ✅ Fixed function names
router.put("/update", protect, updateProfile);

module.exports = router;
