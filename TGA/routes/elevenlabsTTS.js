// const express = require("express");
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// const router = express.Router();

// // ✅ Replace with your ElevenLabs API Key
// const ELEVEN_LABS_API_KEY = "sk_6ee096267157d76953d4d3c006b63d19e960144c072b7893";

// // ✅ ElevenLabs Voice ID for multilingual support (you can change this)
// const ELEVEN_LABS_VOICE_ID = "TxGEqnHWrfWFTfGW9XjX"; // Default voice

// // 🎤 Convert Text to Speech using ElevenLabs
// router.post("/synthesize", async (req, res) => {
//   try {
//     const { text, language } = req.body;

//     const response = await axios.post(
//       `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`,
//       {
//         text: text,
//         voice_settings: {
//           stability: 0.5,
//           similarity_boost: 0.5,
//         },
//       },
//       {
//         headers: {
//           "xi-api-key": ELEVEN_LABS_API_KEY,
//           "Content-Type": "application/json",
//         },
//         responseType: "arraybuffer", // Get audio file as binary data
//       }
//     );

//     // ✅ Save the generated audio file
//     const filePath = path.join(__dirname, "../public/audio/output.mp3");
//     fs.writeFileSync(filePath, response.data);

//     res.json({ audioUrl: `/audio/output.mp3` });
//   } catch (error) {
//     console.error("ElevenLabs TTS Error:", error.response ? error.response.data : error);
//     res.status(500).json({ error: "Text-to-Speech conversion failed." });
//   }
// });

// module.exports = router;

const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// ✅ ElevenLabs API Key from .env
const ELEVENLABS_API_KEY = "sk_6ee096267157d76953d4d3c006b63d19e960144c072b7893";


router.post("/synthesize", async (req, res) => {
  const { text, language } = req.body;

  if (!text || !language) {
    return res.status(400).json({ error: "Missing text or language" });
  }

  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", // ✅ Ensure correct voice_id
      {
        text,
        model_id: "eleven_monolingual_v1",
        voice_id: "21m00Tcm4TlvDq8ikWAM", // ✅ Adjust this for different languages
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY, // ✅ Your API key from .env
        },
      }
    );

    if (!response.data.audio_url) {
      console.error("Error: No audio URL received from ElevenLabs.");
      return res.status(500).json({ error: "No audio URL received from ElevenLabs." });
    }

    res.json({ audioUrl: response.data.audio_url });

  } catch (error) {
    console.error("ElevenLabs API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "TTS API Failed" });
  }
});

module.exports = router;

