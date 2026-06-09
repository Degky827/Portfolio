const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const User = require('../models/User')

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portkiro'
  await mongoose.connect(uri)
  console.log(`Connected to MongoDB at ${uri}`)

  const existingSuperAdmin = await User.findOne({ role: 'super_admin' })
  if (existingSuperAdmin) {
    console.log('Production super admin already exists in Atlas:')
    console.log(`  Email: ${existingSuperAdmin.email}`)
    console.log('  Skipping seed — no test users created.')
    await mongoose.disconnect()
    return
  }

  console.log('No super_admin found in database.')
  console.log('Create your admin account via the application or insert it manually in MongoDB Atlas.')
  console.log('Expects an existing super_admin user with 2FA pre-configured for production.')

  await mongoose.disconnect()
  console.log('Seed check complete.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
