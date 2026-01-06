// src/app.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'College Student Connect API is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

module.exports = app;
