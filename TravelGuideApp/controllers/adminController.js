const User = require('../models/User');
const Place = require('../models/Place');
const Itinerary = require('../models/Itinerary');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const totalItineraries = await Itinerary.countDocuments();

    res.json({ totalUsers, totalPlaces, totalItineraries });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};

module.exports = { getAdminStats };
