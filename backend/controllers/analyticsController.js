const Visit = require('../models/Visit')
const { extractIP, lookupLocation } = require('../utils/ipLookup')
const { parseUserAgent } = require('../utils/parseUserAgent')

// ---------------------------------------------------------------------------
// POST /api/analytics/log-visit
// ---------------------------------------------------------------------------
async function logVisit(req, res) {
  try {
    const visitorName = req.body.viewerName || 'Anonymous'
    const ipAddress = extractIP(req)
    const userAgent = req.headers['user-agent']

    const [location, deviceInfo] = await Promise.all([
      lookupLocation(ipAddress),
      Promise.resolve(parseUserAgent(userAgent)),
    ])

    const visit = await Visit.create({
      visitorName,
      ipAddress,
      location,
      deviceInfo,
    })

    res.status(201).json({ success: true, visitId: visit._id })
  } catch (error) {
    console.error('[analytics] logVisit error:', error)
    res.status(500).json({ success: false, message: 'Failed to log visit' })
  }
}

// ---------------------------------------------------------------------------
// GET /api/analytics/metrics
// ---------------------------------------------------------------------------
async function getMetrics(_req, res) {
  try {
    const [totalCount, recentVisits] = await Promise.all([
      Visit.countDocuments(),
      Visit.find().sort({ timestamp: -1 }).limit(20).lean(),
    ])

    res.json({ success: true, totalCount, recentVisits })
  } catch (error) {
    console.error('[analytics] getMetrics error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' })
  }
}

module.exports = { logVisit, getMetrics }
