const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: { type: String, default: "Kathmandu" },
  image: String,
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // vendor/admin
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Place", placeSchema);
