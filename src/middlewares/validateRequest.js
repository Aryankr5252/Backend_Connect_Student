// src/middlewares/validateRequest.js

const { HTTP_STATUS } = require('../utils/constants');

// Middleware to validate request body
const validateRequest = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (!req.body[field] && req.body[field] !== 0) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = validateRequest;
