const SavedPlace = require("../models/SavedPlace");

// ✅ Get all saved places for a user
const getSavedPlaces = async (req, res) => {
  try {
    const savedPlaces = await SavedPlace.find({ user: req.user.id }).populate("placeId");
    res.status(200).json(savedPlaces);
  } catch (error) {
    console.error("Error fetching saved places:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add a new saved place
const addSavedPlace = async (req, res) => {
  try {
    const { placeId } = req.body;
    const userId = req.user.id;

    const existingSave = await SavedPlace.findOne({ user: userId, placeId });
    if (existingSave) return res.status(400).json({ message: "Place already saved" });

    const savedPlace = new SavedPlace({ user: userId, placeId });
    await savedPlace.save();

    res.status(201).json(savedPlace);
  } catch (error) {
    console.error("Error adding saved place:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove a saved place
const removeSavedPlace = async (req, res) => {
  try {
    const savedPlace = await SavedPlace.findById(req.params.id);
    if (!savedPlace) return res.status(404).json({ message: "Saved place not found" });

    if (savedPlace.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    await savedPlace.deleteOne();
    res.json({ message: "Place removed from saved places" });
  } catch (error) {
    console.error("Error removing place:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSavedPlaces,
  addSavedPlace,
  removeSavedPlace
};
