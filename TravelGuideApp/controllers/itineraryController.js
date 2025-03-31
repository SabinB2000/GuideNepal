const Itinerary = require("../models/Itinerary");

// ✅ Admin: Get all itineraries
const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate("createdBy", "email role");
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch itineraries", error: err.message });
  }
};

// ✅ Admin: Create itinerary
const createItinerary = async (req, res) => {
  try {
    const { title, days, places } = req.body;
    const itinerary = new Itinerary({
      title,
      days,
      places,
      createdBy: req.user.id,
    });
    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (err) {
    res.status(500).json({ message: "Failed to create itinerary", error: err.message });
  }
};

// ✅ Admin: Delete itinerary
const deleteItinerary = async (req, res) => {
  try {
    await Itinerary.findByIdAndDelete(req.params.id);
    res.json({ message: "Itinerary deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// ✅ Admin: Update itinerary
const updateItinerary = async (req, res) => {
  try {
    const { title, days, places } = req.body;
    const updated = await Itinerary.findByIdAndUpdate(
      req.params.id,
      { title, days, places },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

module.exports = {
  getAllItineraries,
  createItinerary,
  deleteItinerary,
  updateItinerary,
};
