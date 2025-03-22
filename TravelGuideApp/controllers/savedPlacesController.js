const User = require("../models/User");


const SavedPlace = require("../models/SavedPlace"); // Make sure you have this model

// ✅ Get all saved places for a user
const getSavedPlaces = async (req, res) => {
    try {
        const savedPlaces = await SavedPlace.find({ user: req.user.id });
        res.status(200).json(savedPlaces);
    } catch (error) {
        console.error("Error fetching saved places:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Add a new saved place
const addSavedPlace = async (req, res) => {
    const { name, location } = req.body;

    try {
        const newPlace = new SavedPlace({
            user: req.user.id,
            name,
            location
        });

        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (error) {
        console.error("Error adding saved place:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Remove a saved place
const removeSavedPlace = async (req, res) => {
    try {
        const deletedPlace = await SavedPlace.findByIdAndDelete(req.params.id);
        if (!deletedPlace) {
            return res.status(404).json({ message: "Place not found" });
        }
        res.status(200).json({ message: "Place removed successfully" });
    } catch (error) {
        console.error("Error removing place:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getSavedPlaces, addSavedPlace, removeSavedPlace };

