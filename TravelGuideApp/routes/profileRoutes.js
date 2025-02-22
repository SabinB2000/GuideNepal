const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Define the routes
router.get('/me', protect, getUserProfile); // Get user profile
router.put('/me', protect, updateUserProfile); // Update user profile

module.exports = router;
