// controllers/itineraryController.js
const Itinerary = require("../models/Itinerary");

// GET /api/itineraries
exports.getItineraries = async (req, res) => {
  try {
    const list = await Itinerary.find({ user: req.user._id });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching itineraries" });
  }
};

// GET /api/itineraries/:id
exports.getItineraryById = async (req, res) => {
  try {
    const it = await Itinerary.findById(req.params.id);
    if (!it) return res.status(404).json({ message: "Not found" });
    res.json(it);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/itineraries
exports.createItinerary = async (req, res) => {
  try {
    const newIt = new Itinerary({ ...req.body, user: req.user._id });
    await newIt.save();
    res.status(201).json(newIt);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// PUT /api/itineraries/:id
exports.updateItinerary = async (req, res) => {
  try {
    const updated = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// DELETE /api/itineraries/:id
exports.deleteItinerary = async (req, res) => {
  try {
    const del = await Itinerary.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
