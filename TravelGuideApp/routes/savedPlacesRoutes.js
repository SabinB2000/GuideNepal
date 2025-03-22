const express = require("express");
const router = express.Router();
const SavedPlace = require("../models/SavedPlace");
const { protect } = require("../middleware/authMiddleware");

// ✅ Get Saved Places
router.get("/", protect, async (req, res) => {
  try {
    const savedPlaces = await SavedPlace.find({ user: req.user.id }).populate("placeId");
    res.json(savedPlaces);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Save a Place
router.post("/", protect, async (req, res) => {
  try {
    const { placeId } = req.body;
    const userId = req.user.id;

    const existingSave = await SavedPlace.findOne({ user: userId, placeId });
    if (existingSave) return res.status(400).json({ message: "Place already saved" });

    const savedPlace = new SavedPlace({ user: userId, placeId });
    await savedPlace.save();

    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Remove a Saved Place
router.delete("/:id", protect, async (req, res) => {
  try {
    const savedPlace = await SavedPlace.findById(req.params.id);
    if (!savedPlace) return res.status(404).json({ message: "Saved place not found" });

    if (savedPlace.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    await savedPlace.deleteOne();
    res.json({ message: "Place removed from saved places" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
