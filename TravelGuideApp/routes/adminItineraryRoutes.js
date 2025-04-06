// routes/adminItineraryRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  getItineraries,
  addItinerary,
  editItinerary,
  deleteItinerary
} = require("../controllers/itineraryController");

// Route to retrieve all itineraries
router.get("/", authenticate, isAdmin, getItineraries);
// Route to add a new itinerary
router.post("/", authenticate, isAdmin, addItinerary);
// Route to edit an existing itinerary
router.put("/:id", authenticate, isAdmin, editItinerary);
// Route to delete an itinerary
router.delete("/:id", authenticate, isAdmin, deleteItinerary);

module.exports = router;
