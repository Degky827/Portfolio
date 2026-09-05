/**
 * Database Migration: Add analytics fields to Experience collection
 * 
 * Purpose: Backfill all existing Experience documents with:
 * - analyticsEnabled: true (default)
 * - viewCount: 0 (default)
 * 
 * This ensures backwards compatibility with documents created before the schema update.
 * Run this migration before deploying the updated Experience model.
 * 
 * Usage: node backend/src/shared/migrations/001-add-experience-analytics.js
 */

const mongoose = require('mongoose')

async function migrateExperienceAnalytics() {
  try {
    console.log('Starting Experience analytics migration...')

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'
    await mongoose.connect(mongoUri)
    console.log('✓ Connected to MongoDB')

    const db = mongoose.connection.db

    // Update all Experience documents that are missing the new fields
    const result = await db.collection('experiences').updateMany(
      {
        // Match documents that don't have these fields yet
        $or: [
          { analyticsEnabled: { $exists: false } },
          { viewCount: { $exists: false } },
        ],
      },
      {
        $set: {
          analyticsEnabled: true,
          viewCount: 0,
        },
      },
    )

    console.log(`✓ Migration completed successfully`)
    console.log(`  - Matched documents: ${result.matchedCount}`)
    console.log(`  - Modified documents: ${result.modifiedCount}`)

    // Verify the migration
    const totalDocs = await db.collection('experiences').countDocuments()
    const docsWithAnalytics = await db.collection('experiences').countDocuments({
      analyticsEnabled: { $exists: true },
      viewCount: { $exists: true },
    })

    console.log(`\n✓ Verification:`)
    console.log(`  - Total Experience documents: ${totalDocs}`)
    console.log(`  - Documents with analytics fields: ${docsWithAnalytics}`)

    if (totalDocs === docsWithAnalytics) {
      console.log('\n✅ Migration successful - all documents updated!')
    } else {
      console.warn(
        `\n⚠️  Warning: ${totalDocs - docsWithAnalytics} documents still missing analytics fields`,
      )
    }

    await mongoose.connection.close()
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateExperienceAnalytics()
}

module.exports = migrateExperienceAnalytics
