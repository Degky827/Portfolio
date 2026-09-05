const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      required: [true, 'Badge label is required'],
      trim: true,
      maxlength: [50, 'Badge cannot exceed 50 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [200, 'Role cannot exceed 200 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyUrl: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    period: {
      type: String,
      required: [true, 'Period is required'],
      trim: true,
    },
    dateYear: {
      type: String,
      required: [true, 'Date year is required'],
      trim: true,
    },
    dateSub: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    summary: {
      type: String,
      default: '',
      maxlength: [1000, 'Summary cannot exceed 1000 characters'],
    },
    primaryTags: {
      type: [String],
      default: [],
    },
    extraTags: {
      type: [String],
      default: [],
    },
    contributions: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    analyticsEnabled: {
      type: Boolean,
      default: true,
      description: 'Controls whether view counts and analytics are tracked for this experience',
    },
    viewCount: {
      type: Number,
      default: 0,
      min: [0, 'View count cannot be negative'],
      description: 'Number of times this experience has been viewed (only tracked if analyticsEnabled is true)',
    },
  },
  {
    timestamps: true,
  },
)

experienceSchema.index({ status: 1, displayOrder: 1 })

// Index for filtering by status and display order
experienceSchema.index({ status: 1, displayOrder: 1 })

// Index for analytics queries - commonly filters by analyticsEnabled
experienceSchema.index({ analyticsEnabled: 1 })

// Compound index for efficient queries filtering both analytics and status
experienceSchema.index({ analyticsEnabled: 1, status: 1 })

module.exports = mongoose.model('Experience', experienceSchema)
