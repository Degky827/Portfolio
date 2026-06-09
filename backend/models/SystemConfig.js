const mongoose = require('mongoose')

const systemConfigSchema = new mongoose.Schema({
  apiUrl: { type: String, default: '', trim: true },
  uploadMaxFileSize: { type: Number, default: 5 },
  uploadAllowedExtensions: { type: [String], default: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'] },
  sessionTimeoutMinutes: { type: Number, default: 60 },
  cacheEnabled: { type: Boolean, default: true },
  cacheDurationSeconds: { type: Number, default: 300 },
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: 'Site is under maintenance. Please check back later.' },
}, { timestamps: true })

module.exports = mongoose.model('SystemConfig', systemConfigSchema)
