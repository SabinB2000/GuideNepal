const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const {
  getSavedPlaces,
  addSavedPlace,
  removeSavedPlace
} = require("../controllers/savedPlacesController");

// ✅ Get all saved places
router.get("/", authenticate, getSavedPlaces);

// ✅ Save a place
router.post("/", authenticate, addSavedPlace);

// ✅ Remove a saved place
router.delete("/:id", authenticate, removeSavedPlace);

module.exports = router;
