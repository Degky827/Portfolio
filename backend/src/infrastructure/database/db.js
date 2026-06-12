const mongoose = require('mongoose')
const config = require('../config')

async function connectDB() {
  const opts = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, opts)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
