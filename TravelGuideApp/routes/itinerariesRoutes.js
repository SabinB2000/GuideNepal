// routes/itinerariesRoutes.js
const express = require("express");
const router = express.Router();

const {
  getItineraries,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} = require("../controllers/itineraryController");

const { authenticate } = require("../middleware/authMiddleware");

// Public: list & view
router.get("/", authenticate, getItineraries);
router.get("/:id", authenticate, getItineraryById);

// Protected: create/update/delete
router.post("/", authenticate, createItinerary);
router.put("/:id", authenticate, updateItinerary);
router.delete("/:id", authenticate, deleteItinerary);

module.exports = router;
