const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Add this role field 👇
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  profilePicture: String,
  savedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }], // ✅ Store saved places
});

module.exports = mongoose.model("User", userSchema);
