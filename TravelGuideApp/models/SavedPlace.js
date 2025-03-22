const mongoose = require("mongoose");

const SavedPlaceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
});

module.exports = mongoose.model("SavedPlace", SavedPlaceSchema);
