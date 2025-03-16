const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getSavedPlaces } = require("../controllers/savedPlacesController");

const router = express.Router();

router.get("/", protect, getSavedPlaces); // ✅ Get user's saved places

module.exports = router;
