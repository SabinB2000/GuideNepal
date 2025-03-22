const Place = require("../models/Place");

// ✅ Get Recommended Places
const getRecommendedPlaces = async (req, res) => {
  try {
    const places = await Place.find().limit(10); // Fetch top 10 places
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Error fetching places", error: error.message });
  }
};

// ✅ Add a New Place (For testing or admin panel)
const addPlace = async (req, res) => {
  const { name, category, image } = req.body;

  try {
    const newPlace = new Place({ name, category, image });
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ message: "Error adding place", error: error.message });
  }
};

// ✅ Get Unique Places (Main Attractions)
const getUniquePlaces = async (req, res) => {
  try {
    const places = await Place.find({ mainAttraction: true });
    res.status(200).json(places);
  } catch (error) {
    console.error("Get Unique Places Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getRecommendedPlaces,
  addPlace,
  getUniquePlaces,
};
