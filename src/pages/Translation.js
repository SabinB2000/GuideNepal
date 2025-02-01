import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Using Axios for API calls
import "../styles/Translation.css";

const languages = [
  { code: "en", name: "English" },
  { code: "ne", name: "Nepali" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "zh", name: "Chinese" },
  { code: "de", name: "German" }, // ✅ Added German Language
];

const commonPhrases = [
  { text: "How are you?", emoji: "😊" },
  { text: "Where is the nearest hotel?", emoji: "🏨" },
  { text: "What's the price?", emoji: "💰" },
  { text: "Can you help me?", emoji: "🆘" },
  { text: "Where is the bathroom?", emoji: "🚻" },
  { text: "I need a taxi.", emoji: "🚖" },
];

const Translation = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ne");
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Automatically translate when `inputText` updates
  useEffect(() => {
    if (inputText.trim() !== "") {
      handleTranslate();
    }
  }, [inputText]); // ✅ Runs whenever `inputText` changes

  // ✅ Translate function (using backend API)
  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    try {
      const response = await axios.post("http://localhost:3000/api/translate", {
        text: inputText,
        from: sourceLang,
        to: targetLang,
      });

      console.log("Translation Response:", response.data); // Debugging

      setTranslatedText(response.data.translatedText || "Translation failed.");
    } catch (error) {
      console.error("Translation Error:", error);
      setTranslatedText("Translation failed. Try again.");
    }
  };

  // ✅ Handle voice recognition (auto translates)
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
      setInputText(spokenText); // ✅ Auto-translation triggers via useEffect
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="translation-container">
      <h2 className="title">🌍 Text Translation</h2>

      {/* Language Selection */}
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

      {/* Input and Output Sections */}
      <div className="translation-box">
        <textarea
          className="input-box"
          placeholder="Enter text..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button className="mic-button" onClick={handleVoiceInput} disabled={isListening}>
          🎤 {isListening ? "Listening..." : "Speak"}
        </button>

        <textarea
          className="output-box"
          placeholder="Translation will appear here..."
          value={translatedText}
          readOnly
        />
      </div>

      {/* Translate Button */}
      <button className="translate-button" onClick={handleTranslate}>Translate</button>

      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Common Phrases */}
      <h3 className="common-phrases-title">Common Phrases</h3>
      <div className="common-phrases">
        {commonPhrases.map((phrase, index) => (
          <button key={index} className="phrase-button" onClick={() => setInputText(phrase.text)}>
            {phrase.emoji} {phrase.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Translation;
