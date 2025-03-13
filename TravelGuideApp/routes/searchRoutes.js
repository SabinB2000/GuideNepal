// backend/routes/searchRoutes.js
const router = require('express').Router();
const Search = require('../models/Search');
const { protect } = require('../middleware/authMiddleware'); // ✅ Import 'protect' correctly
const { getSearches } = require('../controllers/searchController');

// ✅ Protect search routes with authentication
router.get('/', protect, getSearches);

router.get('/', protect, async (req, res) => {
  try {
    const searches = await Search.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(searches);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
