const User = require("../models/User");

const getSavedPlaces = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedPlaces");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedPlaces);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getSavedPlaces };
