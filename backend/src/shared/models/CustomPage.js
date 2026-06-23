const mongoose = require('mongoose')

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const sectionSchema = new mongoose.Schema(
  {
    sectionType: {
      type: String,
      required: true,
      enum: ['text', 'image', 'gallery', 'video', 'button', 'html'],
    },
    sectionData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
)

const customPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)

customPageSchema.pre('save', function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title)
  }
})

customPageSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate()
  if (update.title && !update.slug) {
    update.slug = slugify(update.title)
  }
})

customPageSchema.index({ slug: 1 })
customPageSchema.index({ status: 1 })
customPageSchema.index({ createdAt: -1 })

module.exports = mongoose.model('CustomPage', customPageSchema)
