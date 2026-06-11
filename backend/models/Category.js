const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Category title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    icon: {
      type: String,
      default: '',
      trim: true,
    },
    color: {
      type: String,
      default: '#6366f1',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['skills', 'certificates'],
      default: 'skills',
    },
  },
  {
    timestamps: true,
  },
)

categorySchema.index({ order: 1 })

module.exports = mongoose.model('Category', categorySchema)
