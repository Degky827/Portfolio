const Visit = require('../../shared/models/Visit')
const Project = require('../../shared/models/Project')
const { extractIP, lookupLocation } = require('../../shared/utilities/ipLookup')
const { parseUserAgent } = require('../../shared/utilities/parseUserAgent')

const BOT_KEYWORDS = ['headlesschrome', 'lighthouse', 'bot', 'crawl', 'spider', 'prerender', 'wget', 'curl', 'python-requests', 'go-http-client', 'bingpreview', 'facebookexternalhit', 'twitterbot', 'linkedinbot']

const ADMIN_PAGE_PATTERNS = [/^\/admin/, /^\/login/, /^\/dashboard/]

function isBotAgent(ua) {
  if (!ua) return false
  const lower = ua.toLowerCase()
  return BOT_KEYWORDS.some((kw) => lower.includes(kw))
}

function isPublicPage(page) {
  if (!page) return false
  return !ADMIN_PAGE_PATTERNS.some((pattern) => pattern.test(page))
}

function publicOnlyFilter() {
  return {
    page: { $not: /^\/(admin|login|dashboard)/ },
    isBot: false,
  }
}

function parseDiscoveryChannel(referrer, queryParams) {
  if (!referrer || referrer === '' || referrer === 'Direct') {
    if (queryParams?.src === 'resume_qr') return 'Resume QR Code'
    return 'Direct Link / Bookmarks'
  }
  try {
    const url = new URL(referrer)
    const host = url.hostname.replace('www.', '')
    if (host.includes('linkedin')) return 'LinkedIn Referral'
    if (host.includes('github')) return 'GitHub Profile'
    if (host.includes('google')) return 'Google Search'
    if (host.includes('facebook') || host.includes('fb.com')) return 'Facebook'
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter / X'
    if (host.includes('instagram')) return 'Instagram'
    if (host.includes('bing')) return 'Bing Search'
    if (host.includes('yahoo')) return 'Yahoo Search'
    if (host.includes('duckduckgo')) return 'DuckDuckGo'
    if (host.includes('stackoverflow')) return 'Stack Overflow'
    if (host.includes('medium')) return 'Medium'
    if (host.includes('dev.to')) return 'Dev.to'
    if (host.includes('youtube')) return 'YouTube'
    return 'Other Referral'
  } catch {
    return 'Direct Link / Bookmarks'
  }
}

async function logVisit(req, res) {
  try {
    const page = req.body.page || '/'
    const userAgent = req.headers['user-agent']
    const ipAddress = extractIP(req)

    console.log(`[Analytics] Tracking page: ${page} | IP: ${ipAddress} | UA: ${userAgent || 'none'}`)

    if (!isPublicPage(page)) {
      console.log(`[Analytics] Skipped: admin page "${page}"`)
      return res.status(200).json({ success: true, skipped: true, reason: 'admin_page' })
    }

    const isBot = isBotAgent(userAgent)
    if (isBot) {
      console.log(`[Analytics] Skipped: bot detected "${userAgent}"`)
      return res.status(200).json({ success: true, skipped: true, reason: 'bot' })
    }

    const visitorName = req.body.visitorName || req.body.viewerName || 'Anonymous'
    const referrer = req.body.referrer || req.headers.referer || ''
    const visitorId = req.body.visitorId || null
    const interaction = req.body.interaction || ''

    const discoveryChannel = parseDiscoveryChannel(referrer, req.body)

    const [location, deviceInfo] = await Promise.all([
      lookupLocation(ipAddress),
      Promise.resolve(parseUserAgent(userAgent)),
    ])

    let visitorType = 'new'
    if (visitorId) {
      const existing = await Visit.findOne({ visitorId, isBot: false }).sort({ timestamp: -1 }).lean()
      if (existing) visitorType = 'returning'
    }

    const visit = await Visit.create({
      visitorName,
      ipAddress,
      page,
      referrer: discoveryChannel,
      visitorId,
      visitorType,
      location,
      deviceInfo,
      isBot,
      interaction,
      discoveryChannel,
    })

    console.log(`[Analytics] Visitor saved: ${visit._id} | page: ${page} | type: ${visitorType}`)
    res.status(201).json({ success: true, visitId: visit._id, visitorType, isBot })
  } catch (error) {
    console.error('[Analytics] logVisit error:', error)
    res.status(500).json({ success: false, message: 'Failed to log visit' })
  }
}

async function logEngagement(req, res) {
  try {
    const { action, page, visitorId, referrer } = req.body
    if (!action) {
      return res.status(400).json({ success: false, message: 'Action is required' })
    }

    const trackPage = page || '/'
    const userAgent = req.headers['user-agent']
    const ipAddress = extractIP(req)

    console.log(`[Analytics] Engagement: ${action} | page: ${trackPage} | IP: ${ipAddress}`)

    if (!isPublicPage(trackPage)) {
      console.log(`[Analytics] Skipped engagement: admin page "${trackPage}"`)
      return res.status(200).json({ success: true, skipped: true, reason: 'admin_page' })
    }

    if (isBotAgent(userAgent)) {
      console.log(`[Analytics] Skipped engagement: bot detected`)
      return res.status(200).json({ success: true, isBot: true })
    }

    const interactionLabels = {
      cv_download: 'Downloaded CV',
      contact_submit: 'Submitted Contact Form',
      project_click: 'Viewed Project Detail',
      social_click: 'Clicked Social Link',
    }

    const interaction = interactionLabels[action] || action

    const discoveryChannel = parseDiscoveryChannel(referrer || '', req.body)

    const [location, deviceInfo] = await Promise.all([
      lookupLocation(ipAddress),
      Promise.resolve(parseUserAgent(userAgent)),
    ])

    const visit = await Visit.create({
      visitorName: 'Anonymous',
      ipAddress,
      page: trackPage,
      referrer: discoveryChannel,
      visitorId: visitorId || null,
      visitorType: 'returning',
      location,
      deviceInfo,
      isBot: false,
      interaction,
      discoveryChannel,
    })

    console.log(`[Analytics] Engagement saved: ${visit._id} | action: ${interaction}`)
    res.status(201).json({ success: true })
  } catch (error) {
    console.error('[Analytics] logEngagement error:', error)
    res.status(500).json({ success: false, message: 'Failed to log engagement' })
  }
}

async function getMetrics(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 100)
    const search = req.query.search || ''
    const deviceType = req.query.deviceType || ''
    const browser = req.query.browser || ''
    const country = req.query.country || ''
    const source = req.query.source || ''
    const dateFrom = req.query.dateFrom || ''
    const dateTo = req.query.dateTo || ''
    const includeBots = req.query.includeBots === 'true'

    const skip = (page - 1) * limit

    const query = includeBots
      ? { page: { $not: /^\/(admin|login|dashboard)/ } }
      : publicOnlyFilter()
    if (search) {
      query.$or = [
        { visitorName: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.region': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } },
        { 'deviceInfo.browser': { $regex: search, $options: 'i' } },
        { 'deviceInfo.os': { $regex: search, $options: 'i' } },
        { 'deviceInfo.deviceType': { $regex: search, $options: 'i' } },
        { referrer: { $regex: search, $options: 'i' } },
      ]
    }
    if (deviceType) query['deviceInfo.deviceType'] = { $regex: `^${deviceType}$`, $options: 'i' }
    if (browser) query['deviceInfo.browser'] = { $regex: `^${browser}$`, $options: 'i' }
    if (country) query['location.country'] = { $regex: country, $options: 'i' }
    if (source) query.referrer = { $regex: `^${source}$`, $options: 'i' }
    if (dateFrom || dateTo) {
      query.timestamp = {}
      if (dateFrom) query.timestamp.$gte = new Date(dateFrom)
      if (dateTo) {
        const end = new Date(dateTo)
        end.setHours(23, 59, 59, 999)
        query.timestamp.$lte = end
      }
    }

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

async function getDashboardStats(_req, res) {
  try {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const baseFilter = publicOnlyFilter()

    const [totalCount, uniqueVisitors, todayCount, weekCount, monthCount, recentVisits, projectCount, publishedCount] = await Promise.all([
      Visit.countDocuments(baseFilter),
      Visit.distinct('visitorId', baseFilter).then((ids) => ids.filter(Boolean).length),
      Visit.countDocuments({ ...baseFilter, timestamp: { $gte: startOfToday } }),
      Visit.countDocuments({ ...baseFilter, timestamp: { $gte: startOfWeek } }),
      Visit.countDocuments({ ...baseFilter, timestamp: { $gte: startOfMonth } }),
      Visit.find(baseFilter).sort({ timestamp: -1 }).limit(5).lean(),
      Project.countDocuments({ archived: { $ne: true } }),
      Project.countDocuments({ published: true, archived: { $ne: true } }),
    ])

    res.json({ success: true, totalCount, uniqueVisitors, todayCount, weekCount, monthCount, recentVisits, projectCount, publishedCount })
  } catch (error) {
    console.error('[analytics] getDashboardStats error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' })
  }
}

async function getAnalyticsDashboard(req, res) {
  try {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOf7Days = new Date(now)
    startOf7Days.setDate(now.getDate() - 6)
    startOf7Days.setHours(0, 0, 0, 0)
    const startOf30Days = new Date(now)
    startOf30Days.setDate(now.getDate() - 29)
    startOf30Days.setHours(0, 0, 0, 0)

    const baseFilter = publicOnlyFilter()

    const dateFrom = req.query.dateFrom || ''
    const dateTo = req.query.dateTo || ''
    const countryFilter = req.query.country || ''
    const deviceFilter = req.query.deviceType || ''
    const browserFilter = req.query.browser || ''
    const sourceFilter = req.query.source || ''

    function applyFilters(extra = {}) {
      const f = { ...baseFilter, ...extra }
      if (dateFrom) {
        f.timestamp = { ...(f.timestamp || {}), $gte: new Date(dateFrom) }
      }
      if (dateTo) {
        const end = new Date(dateTo)
        end.setHours(23, 59, 59, 999)
        f.timestamp = { ...(f.timestamp || {}), $lte: end }
      }
      if (countryFilter) f['location.country'] = { $regex: countryFilter, $options: 'i' }
      if (deviceFilter) f['deviceInfo.deviceType'] = { $regex: `^${deviceFilter}$`, $options: 'i' }
      if (browserFilter) f['deviceInfo.browser'] = { $regex: `^${browserFilter}$`, $options: 'i' }
      if (sourceFilter) f.referrer = { $regex: `^${sourceFilter}$`, $options: 'i' }
      return f
    }

    const filterAll = applyFilters()

    const [
      totalCount,
      uniqueCount,
      todayCount,
      weekCount,
      monthCount,
      trend7,
      trend30,
      deviceDist,
      browserDist,
      topCountries,
      trafficSources,
      botCount,
      cvDownloadCount,
      contactInquiryCount,
    ] = await Promise.all([
      Visit.countDocuments(filterAll),
      Visit.distinct('visitorId', filterAll).then((ids) => ids.filter(Boolean).length),
      Visit.countDocuments(applyFilters({ timestamp: { $gte: startOfToday } })),
      Visit.countDocuments(applyFilters({ timestamp: { $gte: startOfWeek } })),
      Visit.countDocuments(applyFilters({ timestamp: { $gte: startOfMonth } })),
      Visit.aggregate([
        { $match: applyFilters({ timestamp: { $gte: startOf7Days } }) },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Visit.aggregate([
        { $match: applyFilters({ timestamp: { $gte: startOf30Days } }) },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Visit.aggregate([
        { $match: filterAll },
        { $group: { _id: '$deviceInfo.deviceType', value: { $sum: 1 } } },
        { $sort: { value: -1 } },
      ]),
      Visit.aggregate([
        { $match: filterAll },
        { $group: { _id: '$deviceInfo.browser', value: { $sum: 1 } } },
        { $sort: { value: -1 } },
        { $limit: 10 },
      ]),
      Visit.aggregate([
        { $match: filterAll },
        { $group: { _id: '$location.country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Visit.aggregate([
        { $match: filterAll },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Visit.countDocuments({
        page: { $not: /^\/(admin|login|dashboard)/ },
        isBot: true,
      }),
      Visit.countDocuments({ ...baseFilter, interaction: 'Downloaded CV' }),
      Visit.countDocuments({ ...baseFilter, interaction: 'Submitted Contact Form' }),
    ])

    function fillDateRange(startDate, days, data) {
      const map = {}
      data.forEach((d) => { map[d._id] = d.count })
      const result = []
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        const key = d.toISOString().split('T')[0]
        result.push({ date: key, count: map[key] || 0 })
      }
      return result
    }

    res.json({
      success: true,
      stats: {
        totalViews: totalCount,
        uniqueVisitors: uniqueCount,
        todayCount,
        weekCount,
        monthCount,
        cvDownloads: cvDownloadCount,
        contactInquiries: contactInquiryCount,
        botCount,
      },
      trends7days: fillDateRange(startOf7Days, 7, trend7),
      trends30days: fillDateRange(startOf30Days, 30, trend30),
      deviceDistribution: deviceDist.map((d) => ({ name: d._id || 'Desktop', value: d.value })),
      browserDistribution: browserDist.map((d) => ({ name: d._id || 'Unknown', value: d.value })),
      topCountries: topCountries.map((d) => ({ country: d._id || 'Unknown', count: d.count })),
      trafficSources: trafficSources.map((d) => ({ source: d._id || 'Unknown', count: d.count })),
    })
  } catch (error) {
    console.error('[analytics] getAnalyticsDashboard error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch analytics data' })
  }
}

module.exports = { logVisit, logEngagement, getMetrics, getDashboardStats, getAnalyticsDashboard }
