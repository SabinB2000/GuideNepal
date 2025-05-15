// routes/adminItineraryRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllItineraries,
  getItinerary,
  createItinerary,
  updateItinerary,
  deleteItinerary
} = require("../controllers/adminItineraryController");

const { authenticate, authorizeRole } = require("../middleware/authMiddleware");

// Only admin can manage:
router.use(authenticate, authorizeRole("admin"));

// List all
router.get("/", getAllItineraries);

// Get one
router.get("/:id", getItinerary);

// Create
router.post("/", createItinerary);

// Update
router.put("/:id", updateItinerary);

// Delete
router.delete("/:id", deleteItinerary);

module.exports = router;
