// src/routes/marketplaceRoutes.js

const express = require('express');
const router = express.Router();
const {
  createMarketplaceItem,
  getBuyItems,
  getSellItems,
  getUserMarketplaceItems,
  updateMarketplaceItem,
  deleteMarketplaceItem,
  getMarketplaceItemById,
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

// GET /api/marketplace/my-items - Get user's own items (protected)
router.get('/my-items', authMiddleware, getUserMarketplaceItems);

// GET /api/marketplace/:id - Get single item by ID
router.get('/:id', getMarketplaceItemById);

// PUT /api/marketplace/:id - Update an item (protected)
router.put('/:id', authMiddleware, updateMarketplaceItem);

// DELETE /api/marketplace/:id - Delete an item (protected)
router.delete('/:id', authMiddleware, deleteMarketplaceItem);

module.exports = router;
