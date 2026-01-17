// src/routes/lostFoundRoutes.js

const express = require('express');
const router = express.Router();
const {
  createLostFoundItem,
  getLostItems,
  getFoundItems,
  getUserLostFoundItems,
  updateLostFoundItem,
  deleteLostFoundItem,
  getLostFoundItemById,
} = require('../controllers/lostFoundController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');

// POST /api/lost-found - Create a new lost or found item (protected)
router.post('/', authMiddleware, upload.single('image'), handleMulterError, createLostFoundItem);

// GET /api/lost-found/lost - Get all lost items
router.get('/lost', getLostItems);

// GET /api/lost-found/found - Get all found items
router.get('/found', getFoundItems);

// GET /api/lost-found/my-items - Get user's own items (protected)
router.get('/my-items', authMiddleware, getUserLostFoundItems);

// GET /api/lost-found/:id - Get single item by ID
router.get('/:id', getLostFoundItemById);

// PUT /api/lost-found/:id - Update an item (protected)
router.put('/:id', authMiddleware, updateLostFoundItem);

// DELETE /api/lost-found/:id - Delete an item (protected)
router.delete('/:id', authMiddleware, deleteLostFoundItem);

module.exports = router;
