const express = require("express");
const router = express.Router();
const placeController = require('../controllers/placeController');

const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  getRecommendedPlaces,
  getUniquePlaces,
  getAllPlaces,
  addPlace,
  deletePlace
} = require("../controllers/placeController");

// ✅ Public routes
router.get("/recommended", getRecommendedPlaces);
router.get("/unique", getUniquePlaces);
router.get("/suggestions/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const Place = require("../models/Place");
    const places = await Place.find({ category });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Admin routes
router.get("/admin", authenticate, isAdmin, getAllPlaces);
router.post("/admin", authenticate, isAdmin, addPlace);
router.delete("/admin/:id", authenticate, isAdmin, deletePlace);

module.exports = router;
