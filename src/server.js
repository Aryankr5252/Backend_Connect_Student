// src/server.js

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/dbConfig');

const PORT = process.env.PORT || 4000;

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
    // console.log(`Network URL: http://10.80.31.28:${PORT}`);
  });
};

startServer();
