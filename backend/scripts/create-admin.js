const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const User = require('../src/shared/models/User')

function randomPassword(len = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-='
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio'
  await mongoose.connect(uri)
  console.log(`Connected to MongoDB at ${uri}`)

  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  if (!email) {
    console.error('ADMIN_EMAIL not set in .env — please set it and retry.')
    process.exit(1)
  }

  const existing = await User.findOne({ email })
  if (existing) {
    console.log(`User with email ${email} already exists. No action taken.`)
    await mongoose.disconnect()
    return
  }

  const password = process.env.ADMIN_PASSWORD || randomPassword()

  const user = new User({
    name: 'Super Admin',
    email,
    password,
    role: 'super_admin',
    provider: 'local',
    isActive: true,
  })

  await user.save()
  console.log('Created super_admin:')
  console.log(`  email: ${email}`)
  console.log(`  password: ${password}`)

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Failed to create admin:', err)
  process.exit(1)
})
