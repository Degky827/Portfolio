/**
 * Experience Analytics Helper Utility
 * 
 * Provides safe accessors for analytics fields on Experience documents.
 * Handles backwards compatibility with documents that may be missing
 * analyticsEnabled or viewCount fields.
 */

/**
 * Get analytics enabled status with fallback for missing field
 * @param {Object} experience - Experience document
 * @returns {Boolean} Analytics enabled status (defaults to true for new docs)
 */
function isAnalyticsEnabled(experience) {
  if (!experience) return true
  return experience.analyticsEnabled !== false // Default true for backwards compatibility
}

/**
 * Get view count with fallback for missing field
 * @param {Object} experience - Experience document
 * @returns {Number} View count (defaults to 0 for old docs)
 */
function getViewCount(experience) {
  if (!experience) return 0
  const count = experience.viewCount
  return typeof count === 'number' ? count : 0
}

/**
 * Safely increment view count if analytics is enabled
 * @param {Object} experience - Experience document
 * @returns {Promise<Number>} Updated view count
 */
async function incrementViewCount(experience) {
  if (!experience || !isAnalyticsEnabled(experience)) {
    return getViewCount(experience)
  }

  try {
    const updated = await experience.updateOne({
      $inc: { viewCount: 1 },
    })
    return getViewCount(updated)
  } catch (error) {
    console.error('Failed to increment view count:', error)
    return getViewCount(experience)
  }
}

/**
 * Toggle analytics for an experience
 * @param {Object} experience - Experience document
 * @param {Boolean} enabled - Analytics enabled status
 * @returns {Promise<Object>} Updated experience document
 */
async function setAnalyticsEnabled(experience, enabled) {
  if (!experience) return null

  try {
    return await experience.updateOne({
      analyticsEnabled: Boolean(enabled),
    })
  } catch (error) {
    console.error('Failed to update analytics setting:', error)
    throw error
  }
}

/**
 * Reset view count to zero
 * @param {Object} experience - Experience document
 * @returns {Promise<Object>} Updated experience document
 */
async function resetViewCount(experience) {
  if (!experience) return null

  try {
    return await experience.updateOne({
      viewCount: 0,
    })
  } catch (error) {
    console.error('Failed to reset view count:', error)
    throw error
  }
}

/**
 * Get analytics summary for multiple experiences
 * @param {Array} experiences - Array of Experience documents
 * @returns {Object} Analytics summary with total views and enabled count
 */
function getAnalyticsSummary(experiences) {
  if (!Array.isArray(experiences)) {
    return { totalViews: 0, enabledCount: 0, documentCount: 0 }
  }

  return {
    documentCount: experiences.length,
    enabledCount: experiences.filter(isAnalyticsEnabled).length,
    totalViews: experiences.reduce((sum, exp) => sum + getViewCount(exp), 0),
    averageViews: experiences.length > 0 ? 
      experiences.reduce((sum, exp) => sum + getViewCount(exp), 0) / experiences.length : 0,
  }
}

module.exports = {
  isAnalyticsEnabled,
  getViewCount,
  incrementViewCount,
  setAnalyticsEnabled,
  resetViewCount,
  getAnalyticsSummary,
}
