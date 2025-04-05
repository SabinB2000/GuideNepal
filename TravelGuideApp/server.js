// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const translate = require("google-translate-api-x");

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("❌ MongoDB Connection Failed:", err);
});

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Route Handlers
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/searches", require("./routes/searchRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/places", require("./routes/placesRoutes"));
app.use("/api/saved-places", require("./routes/savedPlacesRoutes"));
app.use("/api/itineraries", require("./routes/itinerariesRoutes"));
app.use("/api/events", require("./routes/eventsRoutes"));

// Admin Routes
app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/api/admin/places", require("./routes/adminPlaceRoutes"));
app.use("/api/admin/itineraries", require("./routes/adminItineraryRoutes"));
app.use("/api/admin/events", require("./routes/adminEventRoutes"));
app.use("/api/admin", require("./routes/adminStatsRoutes"));

// Translation Endpoint (unchanged)
app.post("/api/translate", async (req, res) => {
  const { text, from, to } = req.body;
  if (!text || !from || !to) {
    return res.status(400).json({ error: "Missing required fields (text, from, to)" });
  }
  try {
    const result = await translate(text, { from, to });
    res.json({ translatedText: result.text });
  } catch (error) {
    console.error("Translation Error:", error);
    res.status(500).json({ error: "Translation failed. Try again later." });
  }
});

// Health Check
app.get("/", (req, res) => {
  res.send("🌍 Guide Nepal API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
