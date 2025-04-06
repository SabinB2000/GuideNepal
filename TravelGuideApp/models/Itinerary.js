// models/Itinerary.js
const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, 
  // A large text field for your day-by-day schedule
  detailedSchedule: { type: String }, 
  // Optional: link to places in your DB
  places: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Itinerary", ItinerarySchema);
