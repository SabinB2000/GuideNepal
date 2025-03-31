const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  places: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place"
  }],
  days: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // admin/user
    required: true
  },
  isPublic: { type: Boolean, default: false } // ✅ for user modification feature
}, { timestamps: true });

module.exports = mongoose.model("Itinerary", itinerarySchema);
