const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://example.com/default-image.jpg", // ✅ Replace with a default image if none is provided
  },
  description: {
    type: String,
    default: "No description available.",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

const Place = mongoose.model("Place", PlaceSchema);
module.exports = Place;
