const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  profilePicture: String,
  savedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }], // ✅ Store saved places
});

module.exports = mongoose.model("User", userSchema);
