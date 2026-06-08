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
async function getMetrics(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 100)
    const search = req.query.search || ''
    const deviceType = req.query.deviceType || ''
    const browser = req.query.browser || ''

    const skip = (page - 1) * limit

    const query = {}
    if (search) {
      query.$or = [
        { visitorName: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.region': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } },
        { 'deviceInfo.browser': { $regex: search, $options: 'i' } },
        { 'deviceInfo.os': { $regex: search, $options: 'i' } },
        { 'deviceInfo.deviceType': { $regex: search, $options: 'i' } },
      ]
    }
    if (deviceType) query['deviceInfo.deviceType'] = { $regex: deviceType, $options: 'i' }
    if (browser) query['deviceInfo.browser'] = { $regex: browser, $options: 'i' }

    const [totalCount, visits] = await Promise.all([
      Visit.countDocuments(query),
      Visit.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
    ])

    res.json({
      success: true,
      totalCount,
      visits,
      pagination: { page, limit, totalPages: Math.ceil(totalCount / limit), hasMore: skip + limit < totalCount },
    })
  } catch (error) {
    console.error('[analytics] getMetrics error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' })
  }
}

// ---------------------------------------------------------------------------
// GET /api/analytics/stats
// ---------------------------------------------------------------------------
async function getDashboardStats(_req, res) {
  try {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalCount, uniqueVisitors, todayCount, monthCount, recentVisits] = await Promise.all([
      Visit.countDocuments(),
      Visit.distinct('visitorName').then((names) => names.length),
      Visit.countDocuments({ timestamp: { $gte: startOfToday } }),
      Visit.countDocuments({ timestamp: { $gte: startOfMonth } }),
      Visit.find().sort({ timestamp: -1 }).limit(5).lean(),
    ])

    res.json({ success: true, totalCount, uniqueVisitors, todayCount, monthCount, recentVisits })
  } catch (error) {
    console.error('[analytics] getDashboardStats error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' })
  }
}

module.exports = { logVisit, getMetrics, getDashboardStats }
