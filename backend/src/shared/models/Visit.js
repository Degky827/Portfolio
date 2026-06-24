const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      default: 'Anonymous',
      trim: true,
      maxlength: 100,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      trim: true,
      maxlength: 45,
    },
    page: {
      type: String,
      trim: true,
      default: '/',
      maxlength: 500,
    },
    referrer: {
      type: String,
      trim: true,
      default: 'Direct',
      maxlength: 500,
    },
    visitorId: {
      type: String,
      trim: true,
      index: true,
      maxlength: 100,
    },
    visitorType: {
      type: String,
      enum: ['new', 'returning'],
      default: 'new',
    },
    location: {
      country: { type: String, trim: true, maxlength: 100 },
      region: { type: String, trim: true, maxlength: 100 },
      city: { type: String, trim: true, maxlength: 100 },
    },
    deviceInfo: {
      browser: { type: String, trim: true, maxlength: 100 },
      os: { type: String, trim: true, maxlength: 100 },
      deviceType: { type: String, trim: true, maxlength: 50 },
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
