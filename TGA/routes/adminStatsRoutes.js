// routes/adminStatsRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const { getAdminStats } = require("../controllers/adminController");

// GET /api/admin/stats
router.get("/stats", authenticate, isAdmin, getAdminStats);

module.exports = router;
