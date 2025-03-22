const express = require("express");
const router = express.Router(); // ✅ Define router properly
const Place = require("../models/Place"); // Import your Place model

const { getUniquePlaces } = require("../controllers/placesController");


// ✅ Fetch place suggestions based on category
router.get("/suggestions/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const places = await Place.find({ category });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/unique", getUniquePlaces);


module.exports = router; // ✅ Export the router
