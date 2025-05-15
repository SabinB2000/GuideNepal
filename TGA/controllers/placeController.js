const Place = require("../models/Place");

// ✅ Get Recommended Places (For home/explore)
const getRecommendedPlaces = async (req, res) => {
  try {
    const places = await Place.find().limit(10);
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Error fetching places", error: error.message });
  }
};

const getUniquePlaces = async (req, res) => {
  try {
    const uniquePlaces = await Place.find().limit(20);
    const formatted = uniquePlaces.map(p => ({
      ...p._doc,
      name: p.title,         // 👈 Add this
      category: "Kathmandu", // 👈 Optional default category
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unique places", error: error.message });
  }
};

// ✅ Admin: Get All Places
const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: "Error fetching places", error: err.message });
  }
};

// ✅ Admin: Add New Place
const addPlace = async (req, res) => {
  try {
    const { title, description, location, image } = req.body;

    console.log("📝 Add Place Request Body:", req.body); // NEW LINE

    const newPlace = new Place({
      title,
      description,
      location: location || "Kathmandu",
      image,
      addedBy: req.user?.id || "admin", // fallback if no user attached
    });

    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    console.error("❌ Error adding place:", error); // <-- Important
    res.status(500).json({ message: "Error adding place", error: error.message });
  }
};


// ✅ Admin: Delete Place
const deletePlace = async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "Place deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = {
  getRecommendedPlaces,
  getUniquePlaces,
  getAllPlaces,
  addPlace,           
  deletePlace,
};

