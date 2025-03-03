const express = require("express");
const Place = require("../models/Place"); // ✅ Make sure the model is correct
const router = express.Router();

// ✅ Fetch all places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find(); // ✅ Get all places from DB
    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
