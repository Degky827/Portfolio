const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [150, 'Role cannot exceed 150 characters'],
    },
    organization: {
      type: String,
      default: '',
      trim: true,
    },
    organizationUrl: {
      type: String,
      default: '',
    },
    organizationLogo: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    relationship: {
      type: String,
      enum: ['Supervisor', 'Team Lead', 'Client', 'Colleague', 'Mentor', 'Other'],
      default: 'Colleague',
    },
    avatar: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    highlights: {
      type: [String],
      default: [],
    },
    project: {
      type: String,
      default: '',
    },
    projectUrl: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: false,
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
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
  },
)

testimonialSchema.index({ status: 1, displayOrder: 1 })
testimonialSchema.index({ featured: 1 })

module.exports = mongoose.model('Testimonial', testimonialSchema)
