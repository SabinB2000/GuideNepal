const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // ✅ Ensure this function works
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes"); 
const translate = require("google-translate-api-x"); // ✅ Import translation package
const searchRoutes = require('./routes/searchRoutes');
const userRoutes = require("./routes/userRoutes");
const placesRoutes = require("./routes/placesRoutes"); // ✅ Add places route
const savedPlacesRoutes = require("./routes/savedPlacesRoutes"); // ✅ Import saved places route
const { protect } = require("./middleware/authMiddleware");


dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // ✅ Ensure CORS is correct
  app.use(express.json()); // ✅ Required to parse JSON requests


app.use(cors({
  origin: ["http://localhost:5000"],
  credentials: true
}));


// ✅ Connect to MongoDB (Remove Duplicate Call)
connectDB().catch((err) => {
  console.error("❌ MongoDB Connection Failed:", err);
});

// ✅ Register Routes
console.log("✅ Auth routes loaded!");
app.use("/api/auth", authRoutes); // ✅ Use `/api/auth` prefix
app.use("/api/profile", profileRoutes); 
app.use("/api/profile", protect, profileRoutes); // ✅ Protect routes
app.use("/api/searches", searchRoutes);
app.use("/api/auth", userRoutes); 
app.use("/api/places", placesRoutes);  // ✅ Fix: Ensure Places Route Exists
app.use("/api/saved-places", savedPlacesRoutes); // ✅ Add saved places route






// ✅ Fix: Ensure the /api/translate route exists
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

// ✅ Default Route (Check if API is running)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
