'use strict';

const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas using the MONGO_URI env variable.
 * Exits the process on failure so the app doesn't start broken.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌  MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
