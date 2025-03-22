const Itinerary = require("../models/Itinerary");
const Place = require("../models/Place");
const SavedPlace = require("../models/SavedPlace");

// ✅ Generate Smart Itinerary
exports.generateItinerary = async (req, res) => {
  try {
    const { title, days } = req.body;
    const userId = req.user.id;

    let places = await SavedPlace.find({ user: userId }).populate("placeId");

    if (places.length === 0) {
      places = await Place.find({ mainAttraction: true }).limit(days * 3);
    } else {
      places = places.map((p) => p.placeId);
    }

    if (places.length === 0) {
      places = await Place.find().limit(days * 3);
    }

    if (places.length === 0) return res.status(400).json({ message: "No places available for itinerary" });

    let itinerary = [];
    for (let i = 0; i < days; i++) {
      itinerary.push({
        day: i + 1,
        places: places.slice(i * 3, i * 3 + 3),
      });
    }

    const newItinerary = new Itinerary({
      user: userId,
      title,
      itinerary,
    });

    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (error) {
    console.error("Itinerary Generation Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Manual Itinerary Creation
exports.createItinerary = async (req, res) => {
  try {
    const { title, days, places } = req.body;
    const userId = req.user.id;

    if (!title || !days || !places.length) {
      return res.status(400).json({ message: "Please provide title, days, and places." });
    }

    const newItinerary = new Itinerary({
      user: userId,
      title,
      itinerary: places.map((place, index) => ({
        day: index % days + 1,
        places: [place],
      })),
    });

    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (error) {
    console.error("Create Itinerary Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get User's Itineraries
exports.getItineraries = async (req, res) => {
  try {
    const userId = req.user.id;
    const itineraries = await Itinerary.find({ user: userId });

    res.status(200).json(itineraries);
  } catch (error) {
    console.error("Get Itineraries Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete an Itinerary
exports.deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" });

    await itinerary.deleteOne();
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("Delete Itinerary Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
