// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { 
  signup, 
  register, 
  login, 
  googleAuth, 
  verifyToken, 
  logout,
  updateProfile
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/auth/register - Register new user (backwards compatibility)
router.post('/register', register);

// POST /api/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/google - Google authentication
router.post('/google', googleAuth);

// GET /api/auth/verify - Verify token
router.get('/verify', authMiddleware, verifyToken);

// POST /api/auth/logout - Logout user
router.post('/logout', logout);

// PUT /api/auth/profile - Update user profile
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
