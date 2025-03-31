const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const Place = require("../models/Place");

// ✅ Get all places (Admin view)
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const places = await Place.find().populate("addedBy", "email");
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch places", error: error.message });
  }
});

// ✅ Add a new place
router.post("/", authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, location, image } = req.body;
    const newPlace = new Place({
      title,
      description,
      location,
      image,
      addedBy: req.user.id,
    });
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ message: "Failed to add place", error: error.message });
  }
});

// ✅ Delete a place
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

// ✅ Edit/Update a place
router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, location, image } = req.body;
    const updated = await Place.findByIdAndUpdate(
      req.params.id,
      { title, description, location, image },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

module.exports = router;
