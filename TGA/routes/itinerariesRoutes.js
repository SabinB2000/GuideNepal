// routes/itinerariesRoutes.js
const express = require("express");
const router = express.Router();
const {
  getItineraries,
  addItinerary,
  editItinerary,
  deleteItinerary,
} = require("../controllers/itineraryController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// Admin routes for itinerary management
router.get("/admin", authenticate, isAdmin, getItineraries);
router.post("/admin", authenticate, isAdmin, addItinerary);
router.put("/admin/:id", authenticate, isAdmin, editItinerary);
router.delete("/admin/:id", authenticate, isAdmin, deleteItinerary);

// Public route for users to view itineraries
router.get("/", getItineraries);

module.exports = router;
