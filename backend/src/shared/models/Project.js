const mongoose = require('mongoose')
const { slugify } = require('../utilities/slugify')

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      default: '',
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    fullDescription: {
      type: String,
      default: '',
    },
    technologies: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['completed', 'in_progress', 'planned'],
      default: 'completed',
    },
    published: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    keywords: {
      type: String,
      default: '',
    },
    platform: {
      type: String,
      enum: ['iOS', 'Android', 'Web', 'Cross-platform', ''],
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    appUrl: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    accentColor: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

projectSchema.pre('save', function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title)
  }
})

projectSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate()
  if (update.title && !update.slug) {
    update.slug = slugify(update.title)
  }
})

projectSchema.index({ published: 1, archived: 1, featured: -1, displayOrder: 1 })
projectSchema.index({ slug: 1 })
projectSchema.index({ status: 1 })
projectSchema.index({ technologies: 1 })

module.exports = mongoose.model('Project', projectSchema)
