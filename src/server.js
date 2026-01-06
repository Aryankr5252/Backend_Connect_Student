// src/server.js

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/dbConfig');

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});
