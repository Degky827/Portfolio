const mongoose = require('mongoose')

const passwordPolicySchema = new mongoose.Schema(
  {
    minLength: { type: Number, default: 8, min: 6, max: 128 },
    requireUppercase: { type: Boolean, default: true },
    requireLowercase: { type: Boolean, default: true },
    requireNumbers: { type: Boolean, default: true },
    requireSpecialChars: { type: Boolean, default: true },
    maxAgeDays: { type: Number, default: 90, min: 0, max: 365 },
    preventReuseCount: { type: Number, default: 5, min: 0, max: 24 },
  },
  { _id: false },
)

const sessionConfigSchema = new mongoose.Schema(
  {
    maxConcurrentSessions: { type: Number, default: 10, min: 1, max: 50 },
    idleTimeoutMinutes: { type: Number, default: 30, min: 5, max: 1440 },
    enforceSessionTimeout: { type: Boolean, default: true },
  },
  { _id: false },
)

const twoFactorConfigSchema = new mongoose.Schema(
  {
    enforceForAll: { type: Boolean, default: false },
    allowedMethods: {
      type: [String],
      enum: ['authenticator', 'sms'],
      default: ['authenticator'],
    },
  },
  { _id: false },
)

const loginSecuritySchema = new mongoose.Schema(
  {
    maxFailedAttempts: { type: Number, default: 5, min: 3, max: 20 },
    lockDurationMinutes: { type: Number, default: 15, min: 5, max: 1440 },
    cooldownBetweenAttempts: { type: Number, default: 0, min: 0, max: 60 },
  },
  { _id: false },
)

const securitySettingsSchema = new mongoose.Schema(
  {
    passwordPolicy: { type: passwordPolicySchema, default: () => ({}) },
    sessionConfig: { type: sessionConfigSchema, default: () => ({}) },
    twoFactorConfig: { type: twoFactorConfigSchema, default: () => ({}) },
    loginSecurity: { type: loginSecuritySchema, default: () => ({}) },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('SecuritySettings', securitySettingsSchema)
