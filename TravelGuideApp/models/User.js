// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profilePicture: String,
  savedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
});

module.exports = mongoose.model("User", userSchema);
