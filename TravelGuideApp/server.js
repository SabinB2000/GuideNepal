const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Check if this function is working
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const translate = require("google-translate-api-x");
const elevenlabsTTSRoute = require("./routes/elevenlabsTTS");

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"] })); 
app.use(express.json()); // ✅ Required to parse JSON requests

// ✅ Ensure MongoDB is connected
connectDB();

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/elevenlabs-tts", elevenlabsTTSRoute);

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
