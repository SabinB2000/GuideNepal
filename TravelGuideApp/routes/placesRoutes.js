const express = require("express");
const Place = require("../models/Place"); // Ensure `Place` model exists
const router = express.Router();

// ✅ Fetch all places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Add a new place
router.post("/", async (req, res) => {
  try {
    const { name, location, description } = req.body;
    const newPlace = new Place({ name, location, description });
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    console.error("Error adding place:", error);
    res.status(500).json({ error: "Failed to add place" });
  }
});

// ✅ Fetch a place by ID
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: "Place not found" });
    res.json(place);
  } catch (error) {
    console.error("Error fetching place:", error);
    res.status(500).json({ error: "Failed to fetch place" });
  }
});

// ✅ Delete a place
router.delete("/:id", async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error("Error deleting place:", error);
    res.status(500).json({ error: "Failed to delete place" });
  }
});

module.exports = router;
