const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'],
    },
    icon: {
      type: String,
      default: '',
      trim: true,
    },
    proficiency: {
      type: Number,
      required: [true, 'Proficiency is required'],
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
  },
  {
    timestamps: true,
  },
)

skillSchema.index({ category: 1, displayOrder: 1 })

module.exports = mongoose.model('Skill', skillSchema)
