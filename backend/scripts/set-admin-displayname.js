const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const User = require('../src/shared/models/User')

function titleCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio'
  await mongoose.connect(uri)
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  if (!adminEmail) {
    console.error('ADMIN_EMAIL not set in .env')
    process.exit(1)
  }
  const user = await User.findOne({ email: adminEmail })
  if (!user) {
    console.error(`No user found with email ${adminEmail}`)
    await mongoose.disconnect()
    process.exit(1)
  }

  const local = adminEmail.split('@')[0]
  let display = local.split(/[._-]/)[0]
  if (display.startsWith('desalegn')) display = 'Desalegn'
  else display = titleCase(display)

  user.displayName = display
  await user.save()
  console.log(`Set displayName for ${adminEmail} -> ${display}`)
  await mongoose.disconnect()
}

run().catch((err) => { console.error(err); process.exit(1) })
