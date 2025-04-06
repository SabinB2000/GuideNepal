// src/routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { getProfile, updateProfile, changePassword } = require("../controllers/profileController");

// For image uploads via multer
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// GET profile
router.get("/me", authenticate, getProfile);
// PUT update profile (optional image)
router.put("/update", authenticate, upload.single("profilePicture"), updateProfile);
// PUT change password
router.put("/change-password", authenticate, changePassword);

module.exports = router;
