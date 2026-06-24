const CustomPage = require('../../shared/models/CustomPage')
const { auditLog } = require('../../shared/utilities/auditLogger')
const { createNotification } = require('../notifications/notifications.controller')
const { slugify, ensureUniqueSlug } = require('../../shared/utilities/slugify')
const { escapeRegex } = require('../../shared/utilities/escapeRegex')

async function getCustomPages(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 50)
    const search = req.query.search || ''
    const statusFilter = req.query.status || ''
    const skip = (page - 1) * limit
    const query = {}

    if (statusFilter) {
      query.status = statusFilter
    }

    if (search) {
      const safeSearch = escapeRegex(search)
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { slug: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ]
    }

    const [totalCount, pages] = await Promise.all([
      CustomPage.countDocuments(query),
      CustomPage.find(query)
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
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        hasMore: skip + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('[customPages] getCustomPages error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch custom pages' })
  }
}

async function getCustomPageById(req, res) {
  try {
    const page = await CustomPage.findById(req.params.id).lean()
    if (!page) {
      return res.status(404).json({ success: false, message: 'Custom page not found' })
    }
    res.json({ success: true, page })
  } catch (error) {
    console.error('[customPages] getCustomPageById error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch custom page' })
  }
}

async function getCustomPageBySlug(req, res) {
  try {
    const page = await CustomPage.findOne({
      slug: req.params.slug,
      status: 'published',
    }).lean()
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' })
    }
    res.json({ success: true, page })
  } catch (error) {
    console.error('[customPages] getCustomPageBySlug error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch page' })
  }
}

async function createCustomPage(req, res) {
  try {
    const {
      title, description, metaTitle, metaDescription,
      featuredImage, sections, status,
    } = req.body

    let slug = slugify(title)
    slug = await ensureUniqueSlug(CustomPage, slug, null)

    const page = await CustomPage.create({
      title,
      slug,
      description: description || '',
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
      featuredImage: featuredImage || '',
      sections: Array.isArray(sections) ? sections : [],
      status: status || 'draft',
      createdBy: req.user?._id,
    })

    await auditLog({
      userId: req.user?._id,
      action: 'CREATE',
      resource: 'CustomPage',
      resourceId: page._id,
      details: { title: page.title, slug: page.slug },
      req,
    })

    await createNotification({
      type: 'custom_page_created',
      title: 'Custom Page Created',
      message: `"${page.title}" has been created.`,
      link: `/admin/custom-pages/${page._id}`,
      metadata: { customPageId: page._id },
    })

    res.status(201).json({ success: true, page })
  } catch (error) {
    console.error('[customPages] createCustomPage error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A page with this slug already exists.' })
    }
    res.status(500).json({ success: false, message: 'Failed to create custom page' })
  }
}

async function updateCustomPage(req, res) {
  try {
    const page = await CustomPage.findById(req.params.id)
    if (!page) {
      return res.status(404).json({ success: false, message: 'Custom page not found' })
    }

    const editableFields = [
      'title', 'description', 'metaTitle', 'metaDescription',
      'featuredImage', 'sections', 'status',
    ]

    let slugChanged = false

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'title') {
          if (page.title !== req.body[field]) {
            slugChanged = true
          }
          page[field] = req.body[field]
        } else if (field === 'sections') {
          page[field] = Array.isArray(req.body[field]) ? req.body[field] : []
        } else {
          page[field] = req.body[field]
        }
      }
    })

    if (slugChanged) {
      let slug = slugify(page.title)
      slug = await ensureUniqueSlug(CustomPage, slug, page._id)
      page.slug = slug
    }

    await page.save()

    await auditLog({
      userId: req.user?._id,
      action: 'UPDATE',
      resource: 'CustomPage',
      resourceId: page._id,
      details: { title: page.title, slug: page.slug },
      req,
    })

    await createNotification({
      type: 'custom_page_updated',
      title: 'Custom Page Updated',
      message: `"${page.title}" has been updated.`,
      link: `/admin/custom-pages/${page._id}`,
      metadata: { customPageId: page._id },
    })

    res.json({ success: true, page })
  } catch (error) {
    console.error('[customPages] updateCustomPage error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A page with this slug already exists.' })
    }
    res.status(500).json({ success: false, message: 'Failed to update custom page' })
  }
}

async function deleteCustomPage(req, res) {
  try {
    const page = await CustomPage.findByIdAndDelete(req.params.id)
    if (!page) {
      return res.status(404).json({ success: false, message: 'Custom page not found' })
    }

    await auditLog({
      userId: req.user?._id,
      action: 'DELETE',
      resource: 'CustomPage',
      resourceId: req.params.id,
      details: { title: page.title },
      req,
    })

    await createNotification({
      type: 'custom_page_deleted',
      title: 'Custom Page Deleted',
      message: `"${page.title}" has been deleted.`,
      metadata: { customPageId: req.params.id },
    })

    res.json({ success: true, message: 'Custom page deleted successfully' })
  } catch (error) {
    console.error('[customPages] deleteCustomPage error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete custom page' })
  }
}

async function toggleCustomPageStatus(req, res) {
  try {
    const page = await CustomPage.findById(req.params.id)
    if (!page) {
      return res.status(404).json({ success: false, message: 'Custom page not found' })
    }
    page.status = page.status === 'published' ? 'draft' : 'published'
    await page.save()

    await auditLog({
      userId: req.user?._id,
      action: 'UPDATE',
      resource: 'CustomPage',
      resourceId: page._id,
      details: { title: page.title, status: page.status },
      req,
    })

    await createNotification({
      type: 'custom_page_status_changed',
      title: page.status === 'published' ? 'Page Published' : 'Page Unpublished',
      message: `"${page.title}" has been ${page.status === 'published' ? 'published' : 'unpublished'}.`,
      link: `/admin/custom-pages/${page._id}`,
      metadata: { customPageId: page._id },
    })

    res.json({ success: true, page })
  } catch (error) {
    console.error('[customPages] toggleCustomPageStatus error:', error)
    res.status(500).json({ success: false, message: 'Failed to toggle page status' })
  }
}

module.exports = {
  getCustomPages,
  getCustomPageById,
  getCustomPageBySlug,
  createCustomPage,
  updateCustomPage,
  deleteCustomPage,
  toggleCustomPageStatus,
}
