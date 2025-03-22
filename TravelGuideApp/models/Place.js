const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description: { type: String },
  category: { type: String, enum: ["natural", "historical", "cultural", "entertainment"], required: true },
  imageUrl: { type: String },
  mainAttraction: { type: Boolean, default: false }, // ✅ Mark main attractions
});

module.exports = mongoose.model("Place", PlaceSchema);
