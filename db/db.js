const config = require('config');
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUrl);
  } catch (error) {
    console.log('MongoDB connected: ' + error);
  }
}

module.exports = connectDB;
