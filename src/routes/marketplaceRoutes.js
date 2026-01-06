// src/routes/marketplaceRoutes.js

const express = require('express');
const router = express.Router();
const {
  createMarketplaceItem,
  getBuyItems,
  getSellItems,
} = require('../controllers/marketplaceController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');

// POST /api/marketplace - Create a new marketplace item (protected, with image upload)
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  handleMulterError,
  createMarketplaceItem
);

// GET /api/marketplace/buy - Get all buy items
router.get('/buy', getBuyItems);

// GET /api/marketplace/sell - Get all sell items
router.get('/sell', getSellItems);

module.exports = router;
