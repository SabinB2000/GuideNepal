const express = require("express");
const router = express.Router();
const { getEvents } = require("../controllers/eventController");

// ✅ Fetch Events (No Auth Required)
router.get("/", getEvents);

module.exports = router;
