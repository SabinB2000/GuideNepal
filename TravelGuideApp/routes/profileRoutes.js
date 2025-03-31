const express = require("express");
const { authenticate } = require("../middleware/authMiddleware"); // ✅ FIXED NAME
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/me", authenticate, getProfile); // ✅ Fetch User Profile
router.put("/update", authenticate, updateProfile); // ✅ Update Profile
router.put("/change-password", authenticate, changePassword); // ✅ Change Password

module.exports = router;
