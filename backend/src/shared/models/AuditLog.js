const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: [
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'LOGOUT',
        'TOKEN_REFRESH',
        'CREATE',
        'UPDATE',
        'DELETE',
        'ACCOUNT_LOCKED',
        'PASSWORD_CHANGE',
        'ROLE_CHANGE',
        'ACCOUNT_DISABLED',
        'ACCOUNT_ENABLED',
        'GOOGLE_LOGIN',
      ],
    },
    resource: {
      type: String,
      default: '',
    },
    resourceId: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    success: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ user: 1, createdAt: -1 })
auditLogSchema.index({ action: 1 })

module.exports = mongoose.model('AuditLog', auditLogSchema)
