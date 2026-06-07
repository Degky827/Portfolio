const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      default: 'Anonymous',
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    location: {
      country: { type: String, trim: true },
      region: { type: String, trim: true },
      city: { type: String, trim: true },
    },
    deviceInfo: {
      browser: { type: String, trim: true },
      os: { type: String, trim: true },
      deviceType: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  },
)

visitSchema.index({ timestamp: -1 })
visitSchema.index({ 'location.country': 1 })

module.exports = mongoose.model('Visit', visitSchema)
