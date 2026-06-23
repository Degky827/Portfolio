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
    page: {
      type: String,
      trim: true,
      default: '/',
    },
    referrer: {
      type: String,
      trim: true,
      default: 'Direct',
    },
    visitorId: {
      type: String,
      trim: true,
      index: true,
    },
    visitorType: {
      type: String,
      enum: ['new', 'returning'],
      default: 'new',
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
    isBot: {
      type: Boolean,
      default: false,
    },
    interaction: {
      type: String,
      default: '',
    },
    discoveryChannel: {
      type: String,
      default: '',
    },
    pagesViewed: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

visitSchema.index({ timestamp: -1 })
visitSchema.index({ 'location.country': 1 })
visitSchema.index({ isBot: 1 })

module.exports = mongoose.model('Visit', visitSchema)
