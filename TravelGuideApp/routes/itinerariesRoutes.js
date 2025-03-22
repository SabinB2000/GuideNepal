const express = require("express");
const { generateItinerary, createItinerary, getItineraries, deleteItinerary } = require("../controllers/itineraryController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// ✅ Auto-generate itinerary
router.post("/generate", authenticate, generateItinerary);

// ✅ Manually create an itinerary
router.post("/create", authenticate, createItinerary);

// ✅ Get all itineraries
router.get("/", authenticate, getItineraries);

// ✅ Delete an itinerary
router.delete("/:id", authenticate, deleteItinerary);

module.exports = router;
