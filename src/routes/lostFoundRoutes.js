// src/routes/lostFoundRoutes.js

const express = require('express');
const router = express.Router();
const {
  createLostFoundItem,
  getLostItems,
  getFoundItems,
} = require('../controllers/lostFoundController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/lost-found - Create a new lost or found item (protected)
router.post('/', authMiddleware, createLostFoundItem);

// GET /api/lost-found/lost - Get all lost items
router.get('/lost', getLostItems);

// GET /api/lost-found/found - Get all found items
router.get('/found', getFoundItems);

module.exports = router;
