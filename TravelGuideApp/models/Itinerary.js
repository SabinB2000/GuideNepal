const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  itinerary: [
    {
      day: Number,
      places: [
        {
          name: String,
          location: { lat: Number, lng: Number },
          description: String,
          image: String, // Optional Image URL
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Itinerary", itinerarySchema);
