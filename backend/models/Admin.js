const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    twoFactorSecret: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Admin', adminSchema)
