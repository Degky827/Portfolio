const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: '',
      trim: true,
    },
    proficiency: {
      type: Number,
      default: null,
      min: [0, 'Minimum proficiency is 0'],
      max: [100, 'Maximum proficiency is 100'],
    },
    description: {
      type: String,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    // Certificate-specific fields (used when category = "Certificates")
    issuer: {
      type: String,
      default: '',
      trim: true,
    },
    issueDate: {
      type: String,
      default: '',
      trim: true,
    },
    certificateUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

skillSchema.index({ category: 1, displayOrder: 1 })

module.exports = mongoose.model('Skill', skillSchema)
