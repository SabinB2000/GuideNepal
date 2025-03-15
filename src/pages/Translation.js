import React, { useState, useEffect } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import "../styles/Translation.css";

const languages = [
  { code: "en", name: "English" },
  { code: "ne", name: "Nepali" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
];

const commonPhrases = [
  { text: "How are you?" },
  { text: "Where is the nearest hotel?" },
  { text: "What's the price?" },
  { text: "Can you help me?" },
  { text: "Where is the bathroom?" },
  { text: "I need a taxi." },
];

const Translation = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ne");
  const [isListening, setIsListening] = useState(false);
  const [translatedImageText, setTranslatedImageText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (inputText.trim() !== "") {
      handleTranslate();
    }
  }, [inputText]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    console.log("Sending API request with:", {
        text: inputText,
        from: sourceLang,
        to: targetLang
    });

    try {
        const response = await axios.post("http://localhost:5000/api/translate", {
            text: inputText,
            from: sourceLang,
            to: targetLang,
        });

        console.log("Translation Response:", response.data);
        setTranslatedText(response.data.translatedText || "Translation failed.");
    } catch (error) {
        console.error("Translation Error:", error.response?.data || error.message);
        setTranslatedText("Translation failed. Try again.");
    }
};

const speakWithDelay = (text, lang) => {
  window.speechSynthesis.onvoiceschanged = () => {
      handlePlayTranslation(text, lang);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
      handlePlayTranslation(text, lang);
  }
};

const handlePlayTranslation = () => {
  if (!translatedText.trim()) return;

  // Stop any ongoing speech before starting new one
  window.speechSynthesis.cancel();

  // Get available voices
  let voices = window.speechSynthesis.getVoices();
  console.log("Available Voices:", voices);

  const utterance = new SpeechSynthesisUtterance(translatedText);
  utterance.lang = targetLang; // Set language

  // Fallback for Nepali (Use Hindi if Nepali isn't available)
  if (targetLang === "ne") {
      const nepaliVoice = voices.find((v) => v.lang.includes("hi") || v.lang.includes("ne"));
      if (nepaliVoice) {
          utterance.voice = nepaliVoice;
      } else {
          console.warn("No Nepali/Hindi voice found, using default.");
      }
  } else {
      // For other languages, pick the best available match
      const selectedVoice = voices.find((v) => v.lang.includes(targetLang));
      if (selectedVoice) {
          utterance.voice = selectedVoice;
      }
  }

  // Ensure voices are fully loaded before speaking
  if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.speak(utterance);
      };
  } else {
      window.speechSynthesis.speak(utterance);
  }
};



  const handleVoiceInput = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = sourceLang;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInputText(spokenText);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      Tesseract.recognize(reader.result, "eng+nep", { logger: (m) => console.log(m) })
        .then(({ data: { text } }) => {
          handleTranslateImageText(text);
        })
        .catch((error) => {
          console.error("OCR Error:", error);
          setTranslatedImageText("OCR failed. Please try another image.");
        });
    };
  };

  const handleTranslateImageText = async (text) => {
    if (!text.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/translate", {
        text: text,
        from: "auto",
        to: "en",
      });

      setTranslatedImageText(response.data.translatedText || "Translation failed.");
    } catch (error) {
      console.error("Translation Error:", error);
      setTranslatedImageText("Translation failed. Try again.");
    }
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setTranslatedImageText("");
  };

  return (
    <div className="translation-container">
      <h2 className="title">Text Translation</h2>

      <div className="language-selection">
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>

        <button className="swap-button" onClick={() => { setSourceLang(targetLang); setTargetLang(sourceLang); }}>
          ↔️
        </button>

        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div className="translation-box">
        <textarea className="input-box" placeholder="Enter text..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
        <button className="mic-button" onClick={handleVoiceInput} disabled={isListening}>
          {isListening ? "Listening..." : "Speak"}
        </button>
        <textarea className="output-box" placeholder="Translation will appear here..." value={translatedText} readOnly />
      </div>

      <button className="translate-button" onClick={handleTranslate}>Translate</button>
      <button className="play-button" onClick={handlePlayTranslation}>Play</button>

      <h3 className="common-phrases-title">Common Phrases</h3>
      <div className="common-phrases">
        {commonPhrases.map((phrase, index) => (
          <button key={index} className="phrase-button" onClick={() => setInputText(phrase.text)}>
            {phrase.text}
          </button>
        ))}
      </div>

      <h3 className="image-translation-title">Image Translation</h3>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {selectedImage && (
        <div className="image-translation-container">
          <div className="image-section">
            <img src={selectedImage} alt="Uploaded" className="uploaded-image" />
            <button className="close-button" onClick={handleCloseImage}>❌</button>
          </div>
          <textarea className="image-translation-box" value={translatedImageText} readOnly placeholder="Translated text will appear here..." />
        </div>
      )}
    </div>
    
    
  );
};

export default Translation;


