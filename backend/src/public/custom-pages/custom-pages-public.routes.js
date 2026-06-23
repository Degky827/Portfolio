const { Router } = require('express')
const CustomPage = require('../../shared/models/CustomPage')

const router = Router()

router.get('/custom-pages/public', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 50)
    const skip = (page - 1) * limit

    const [totalCount, pages] = await Promise.all([
      CustomPage.countDocuments({ status: 'published' }),
      CustomPage.find({ status: 'published' })
        .select('-sections')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ])

    res.json({
      success: true,
      totalCount,
      pages,
      pagination: { page, limit, totalPages: Math.ceil(totalCount / limit) || 1, hasMore: skip + limit < totalCount },
    })
  } catch (error) {
    console.error('[customPages-public] list error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch pages' })
  }
})

router.get('/custom-pages/public/:slug', async (req, res) => {
  try {
    const page = await CustomPage.findOne({ slug: req.params.slug, status: 'published' }).lean()
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' })
    res.json({ success: true, page })
  } catch (error) {
    console.error('[customPages-public] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch page' })
  }
})

module.exports = router
