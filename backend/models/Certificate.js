const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required'],
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    credentialId: {
      type: String,
      default: '',
      trim: true,
    },
    verificationUrl: {
      type: String,
      default: '',
      trim: true,
    },
    certificateImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    skillsCovered: {
      type: [String],
      default: [],
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

certificateSchema.index({ status: 1, featured: -1, issueDate: -1 })

module.exports = mongoose.model('Certificate', certificateSchema)
