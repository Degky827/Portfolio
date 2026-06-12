const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const User = require('../src/shared/models/User')

/**
 * Backslash-safe password seeding
 * ───────────────────────────────
 * If your password contains a trailing or embedded backslash (`\`), you
 * MUST double-escape it in this JavaScript source file so that Node.js
 * stores the exact single backslash in the database.
 *
 *   ❌  '/35@%Dk\'      →  interpreted as string  /35@%Dk   (6 chars)
 *       (the `\'` is an escaped single quote — the `\` is consumed)
 *
 *   ✅  '/35@%Dk\\'     →  interpreted as string  /35@%Dk\  (7 chars)
 *       (`\\` produces a literal backslash in JS)
 *
 * For dotenv (.env) files, wrap the value in single or double quotes:
 *   ADMIN_PASSWORD='/35@%Dk\'    or    ADMIN_PASSWORD="/35@%Dk\\"
 *
 * For shell environment variables, use single quotes to prevent shell
 * expansion of `\`:
 *   export ADMIN_PASSWORD='/35@%Dk\'
 */

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
