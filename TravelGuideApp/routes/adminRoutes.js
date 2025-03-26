const express = require('express');
const router = express.Router();

const { getAdminStats } = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const isAdmin = require('../middleware/isAdmin');

// ✅ Route: GET /api/admin/stats
router.get('/stats', authenticate, isAdmin, getAdminStats);

module.exports = router;
