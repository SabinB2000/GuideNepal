const express = require("express");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  getAllItineraries,
  createItinerary,
  deleteItinerary,
  updateItinerary
} = require("../controllers/itineraryController");

const router = express.Router();

router.get("/", authenticate, isAdmin, getAllItineraries);
router.post("/", authenticate, isAdmin, createItinerary);
router.delete("/:id", authenticate, isAdmin, deleteItinerary);
router.put("/:id", authenticate, isAdmin, updateItinerary);

module.exports = router;
