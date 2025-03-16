const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/me", protect, getProfile); // ✅ Fetch User Profile
router.put("/update", protect, updateProfile); // ✅ Update Profile
router.put("/change-password", protect, changePassword); // ✅ Change Password

module.exports = router;
