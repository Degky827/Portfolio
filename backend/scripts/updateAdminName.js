const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

async function main() {
  await mongoose.connect(process.env.MONGO_URI)
  const User = require('../models/User')

  const result = await User.updateMany(
    { role: { $in: ['super_admin', 'admin'] } },
    { $set: { name: 'Desalegn' } }
  )

  console.log(`Updated ${result.modifiedCount} admin user(s) to name "Desalegn"`)
  await mongoose.disconnect()
}

main().catch(console.error)
