// src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { HTTP_STATUS } = require('../utils/constants');

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'User not found',
      });
    }

    next();
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized, token failed',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
