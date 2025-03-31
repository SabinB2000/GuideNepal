const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const translate = require("google-translate-api-x");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const userRoutes = require("./routes/userRoutes");
const placesRoutes = require("./routes/placesRoutes");
const savedPlacesRoutes = require("./routes/savedPlacesRoutes");
const itineraryRoutes = require("./routes/itinerariesRoutes");
const eventRoutes = require("./routes/eventsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminEventRoutes = require("./routes/adminEventRoutes");
const adminPlaceRoutes = require("./routes/adminPlaceRoutes");

dotenv.config();
const app = express();

// ✅ MongoDB Connection
connectDB().catch((err) => {
  console.error("❌ MongoDB Connection Failed:", err);
});

// ✅ Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ✅ Route Handlers
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/searches", searchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/saved-places", savedPlacesRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin/stats", adminRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/places", adminPlaceRoutes);
app.use('/api/admin/itineraries', require('./routes/adminItineraryRoutes'));
app.use("/api/admin/events", require("./routes/adminEventRoutes"));





// ✅ Translation Endpoint
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

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🌍 Guide Nepal API is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
