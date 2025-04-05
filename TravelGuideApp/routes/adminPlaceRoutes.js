const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const { addPlace, getAllPlaces, deletePlace } = require("../controllers/placeController");
const Place = require("../models/Place");

// ✅ Routes
router.get("/", authenticate, isAdmin, getAllPlaces);
router.post("/", authenticate, isAdmin, addPlace);
router.delete("/:id", authenticate, isAdmin, deletePlace);

router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, location, image } = req.body;
    const updated = await Place.findByIdAndUpdate(
      req.params.id,
      { title, description, location, image },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

module.exports = router;
