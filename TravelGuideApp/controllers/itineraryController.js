// controllers/itineraryController.js
const Itinerary = require("../models/Itinerary");

// GET /api/itineraries/admin and GET /api/itineraries/ (public)
exports.getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate("places");
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/itineraries/admin
exports.addItinerary = async (req, res) => {
  try {
    const { title, description, places } = req.body;
    const newItinerary = new Itinerary({ title, description, places });
    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/itineraries/admin/:id
exports.editItinerary = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/itineraries/admin/:id
exports.deleteItinerary = async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deletedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
