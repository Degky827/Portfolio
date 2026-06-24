const Project = require('../../shared/models/Project')
const AuditLog = require('../../shared/models/AuditLog')
const { createNotification } = require('../../admin/notifications/notifications.controller')
const { slugify, ensureUniqueSlug } = require('../../shared/utilities/slugify')
const { escapeRegex } = require('../../shared/utilities/escapeRegex')

async function logActivity({ userId, action, resource, resourceId, details, req }) {
  try {
    await AuditLog.create({
      user: userId,
      action,
      resource,
      resourceId: String(resourceId),
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress || '',
      userAgent: req?.headers?.['user-agent'] || '',
    })
  } catch (err) {
    console.error('[activityLog] Failed to log:', err.message)
  }
}

async function createProject(req, res) {
  try {
    const {
      title, shortDescription, fullDescription,
      technologies, githubUrl, liveDemoUrl,
      thumbnail, images, category,
      featured, displayOrder, status,
      published, archived,
      metaTitle, metaDescription, keywords,
    } = req.body

    let slug = slugify(title)
    slug = await ensureUniqueSlug(Project, slug, null)

    const projectData = {
      title,
      slug,
      shortDescription,
      fullDescription: fullDescription || '',
      technologies: Array.isArray(technologies) ? technologies : [],
      githubUrl: githubUrl || '',
      liveDemoUrl: liveDemoUrl || '',
      thumbnail: thumbnail || '',
      images: Array.isArray(images) ? images : [],
      category,
      featured: featured === true || featured === 'true',
      displayOrder: parseInt(displayOrder, 10) || 0,
      status: status || 'completed',
      published: published !== false && published !== 'false',
      archived: archived === true || archived === 'true',
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
      keywords: keywords || '',
    }

    const project = await Project.create(projectData)

    await logActivity({
      userId: req.user?._id,
      action: 'CREATE',
      resource: 'Project',
      resourceId: project._id,
      details: { title: project.title, slug: project.slug },
      req,
    })

    await createNotification({
      type: 'project_created',
      title: 'Project Created',
      message: `"${project.title}" has been created successfully.`,
      link: `/admin/projects/${project._id}`,
      metadata: { projectId: project._id },
    })

    res.status(201).json({ success: true, project })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: 'Validation Error: ' + messages.join(', ') })
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid value provided.' })
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A project with this title already exists.' })
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ success: false, message: 'Request body too large. Reduce the content size and try again.' })
    }
    res.status(500).json({ success: false, message: 'Failed to create project.' })
  }
}

async function getProjects(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 12), 50)
    const search = req.query.search || ''
    const category = req.query.category || ''
    const featured = req.query.featured || ''
    const statusFilter = req.query.status || ''
    const technology = req.query.technology || ''
    const publicOnly = req.query.public === 'true'
    const includeArchived = req.query.archived === 'true'

    const skip = (page - 1) * limit
    const query = {}

    if (publicOnly) {
      query.published = true
      query.archived = { $ne: true }
    }

    if (!includeArchived && !publicOnly) {
      query.archived = { $ne: true }
    }

    if (statusFilter) {
      query.status = statusFilter
    }

    if (search) {
      const safeSearch = escapeRegex(search)
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { technologies: { $regex: safeSearch, $options: 'i' } },
        { category: { $regex: safeSearch, $options: 'i' } },
        { shortDescription: { $regex: safeSearch, $options: 'i' } },
      ]
    }
    if (category) {
      query.category = category
    }
    if (technology) {
      query.technologies = { $in: [new RegExp(escapeRegex(technology), 'i')] }
    }
    if (featured === 'true') {
      query.featured = true
    } else if (featured === 'false') {
      query.featured = false
    }

    let sortOption = { displayOrder: 1, createdAt: -1 }
    if (publicOnly) {
      sortOption = { featured: -1, displayOrder: 1, createdAt: -1 }
    }

    const [totalCount, projects] = await Promise.all([
      Project.countDocuments(query),
      Project.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
    ])

    const allCategories = await Project.distinct('category')
    const allTechnologies = await Project.distinct('technologies')

    res.json({
      success: true,
      totalCount,
      projects,
      categories: allCategories,
      technologies: allTechnologies.flat().filter(Boolean).sort(),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        hasMore: skip + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('[projects] getProjects error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch projects' })
  }
}

async function getProject(req, res) {
  try {
    const project = await Project.findById(req.params.id).lean()
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    res.json({ success: true, project })
  } catch (error) {
    console.error('[projects] getProject error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch project' })
  }
}

async function getProjectBySlug(req, res) {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true, archived: { $ne: true } }).lean()
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    res.json({ success: true, project })
  } catch (error) {
    console.error('[projects] getProjectBySlug error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch project' })
  }
}

async function updateProject(req, res) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const editableFields = [
      'title', 'shortDescription', 'fullDescription',
      'technologies', 'githubUrl', 'liveDemoUrl',
      'thumbnail', 'images', 'category',
      'featured', 'displayOrder', 'status',
      'published', 'archived',
      'metaTitle', 'metaDescription', 'keywords',
    ]

    let slugChanged = false

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'featured') {
          project[field] = req.body[field] === true || req.body[field] === 'true'
        } else if (field === 'displayOrder') {
          project[field] = parseInt(req.body[field], 10) || 0
        } else if (field === 'technologies') {
          project[field] = typeof req.body[field] === 'string'
            ? req.body[field].split(',').map((s) => s.trim()).filter(Boolean)
            : Array.isArray(req.body[field]) ? req.body[field] : []
        } else if (field === 'images') {
          project[field] = typeof req.body[field] === 'string'
            ? req.body[field].split(',').map((s) => s.trim()).filter(Boolean)
            : Array.isArray(req.body[field]) ? req.body[field] : []
        } else if (field === 'published') {
          project[field] = req.body[field] !== false && req.body[field] !== 'false'
        } else if (field === 'archived') {
          project[field] = req.body[field] === true || req.body[field] === 'true'
        } else if (field === 'title') {
          if (project.title !== req.body[field]) {
            slugChanged = true
          }
          project[field] = req.body[field]
        } else {
          project[field] = req.body[field]
        }
      }
    })

    if (slugChanged) {
      let slug = slugify(project.title)
      slug = await ensureUniqueSlug(Project, slug, project._id)
      project.slug = slug
    }

    await project.save()

    await logActivity({
      userId: req.user?._id,
      action: 'UPDATE',
      resource: 'Project',
      resourceId: project._id,
      details: { title: project.title, slug: project.slug },
      req,
    })

    await createNotification({
      type: 'project_updated',
      title: 'Project Updated',
      message: `"${project.title}" has been updated.`,
      link: `/admin/projects/${project._id}`,
      metadata: { projectId: project._id },
    })

    res.json({ success: true, project })
  } catch (error) {
    console.error('[projects] updateProject error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A project with this slug already exists.' })
    }
    res.status(500).json({ success: false, message: 'Failed to update project' })
  }
}

async function deleteProject(req, res) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    await logActivity({
      userId: req.user?._id,
      action: 'DELETE',
      resource: 'Project',
      resourceId: req.params.id,
      details: { title: project.title },
      req,
    })

    await createNotification({
      type: 'project_deleted',
      title: 'Project Deleted',
      message: `"${project.title}" has been deleted.`,
      metadata: { projectId: req.params.id },
    })

    res.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    console.error('[projects] deleteProject error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete project' })
  }
}

async function duplicateProject(req, res) {
  try {
    const source = await Project.findById(req.params.id)
    if (!source) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const baseTitle = `${source.title} (Copy)`
    let slug = slugify(baseTitle)
    slug = await ensureUniqueSlug(Project, slug, null)

    const duplicate = await Project.create({
      title: baseTitle,
      slug,
      shortDescription: source.shortDescription,
      fullDescription: source.fullDescription,
      technologies: source.technologies,
      githubUrl: source.githubUrl,
      liveDemoUrl: source.liveDemoUrl,
      thumbnail: source.thumbnail,
      images: source.images,
      category: source.category,
      featured: false,
      displayOrder: (source.displayOrder || 0) + 1,
      status: source.status,
      published: false,
      archived: false,
      metaTitle: source.metaTitle,
      metaDescription: source.metaDescription,
      keywords: source.keywords,
    })

    await logActivity({
      userId: req.user?._id,
      action: 'CREATE',
      resource: 'Project',
      resourceId: duplicate._id,
      details: { title: duplicate.title, duplicatedFrom: source.title },
      req,
    })

    await createNotification({
      type: 'project_created',
      title: 'Project Duplicated',
      message: `"${duplicate.title}" has been created from "${source.title}".`,
      link: `/admin/projects/${duplicate._id}`,
      metadata: { projectId: duplicate._id },
    })

    res.status(201).json({ success: true, project: duplicate })
  } catch (error) {
    console.error('[projects] duplicateProject error:', error)
    res.status(500).json({ success: false, message: 'Failed to duplicate project' })
  }
}

async function toggleFeatured(req, res) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    project.featured = !project.featured
    await project.save()

    await logActivity({
      userId: req.user?._id,
      action: 'UPDATE',
      resource: 'Project',
      resourceId: project._id,
      details: { title: project.title, featured: project.featured },
      req,
    })

    res.json({ success: true, project })
  } catch (error) {
    console.error('[projects] toggleFeatured error:', error)
    res.status(500).json({ success: false, message: 'Failed to toggle featured' })
  }
}

async function togglePublish(req, res) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    project.published = !project.published
    await project.save()

    await logActivity({
      userId: req.user?._id,
      action: 'UPDATE',
      resource: 'Project',
      resourceId: project._id,
      details: { title: project.title, published: project.published },
      req,
    })

    await createNotification({
      type: 'project_published',
      title: project.published ? 'Project Published' : 'Project Unpublished',
      message: `"${project.title}" has been ${project.published ? 'published' : 'unpublished'}.`,
      link: `/admin/projects/${project._id}`,
      metadata: { projectId: project._id },
    })

    res.json({ success: true, project })
  } catch (error) {
    console.error('[projects] togglePublish error:', error)
    res.status(500).json({ success: false, message: 'Failed to toggle publish status' })
  }
}

async function toggleArchive(req, res) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    project.archived = !project.archived
    await project.save()

    await logActivity({
      userId: req.user?._id,
      action: 'UPDATE',
      resource: 'Project',
      resourceId: project._id,
      details: { title: project.title, archived: project.archived },
      req,
    })

    await createNotification({
      type: 'project_archived',
      title: project.archived ? 'Project Archived' : 'Project Restored',
      message: `"${project.title}" has been ${project.archived ? 'archived' : 'restored'}.`,
      link: `/admin/projects/${project._id}`,
      metadata: { projectId: project._id },
    })

    res.json({ success: true, project })
  } catch (error) {
    console.error('[projects] toggleArchive error:', error)
    res.status(500).json({ success: false, message: 'Failed to toggle archive status' })
  }
}

async function reorderProjects(req, res) {
  try {
    const { orders } = req.body
    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'orders must be an array of { _id, displayOrder }' })
    }

    const operations = orders.map(({ _id, displayOrder }) => ({
      updateOne: {
        filter: { _id },
        update: { displayOrder: parseInt(displayOrder, 10) || 0 },
      },
    }))

    await Project.bulkWrite(operations)

    await logActivity({
      userId: req.user?._id,
      action: 'UPDATE',
      resource: 'Project',
      resourceId: 'bulk',
      details: { reordered: true, count: orders.length },
      req,
    })

    res.json({ success: true, message: 'Projects reordered successfully' })
  } catch (error) {
    console.error('[projects] reorderProjects error:', error)
    res.status(500).json({ success: false, message: 'Failed to reorder projects' })
  }
}

async function updateImages(req, res) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const { thumbnail, images } = req.body

    if (thumbnail !== undefined) {
      project.thumbnail = thumbnail
    }
    if (images !== undefined) {
      project.images = Array.isArray(images) ? images : []
    }

    await project.save()

    await logActivity({
      userId: req.user?._id,
      action: 'UPDATE',
      resource: 'Project',
      resourceId: project._id,
      details: { title: project.title, imagesUpdated: true },
      req,
    })

    res.json({ success: true, project })
  } catch (error) {
    console.error('[projects] updateImages error:', error)
    res.status(500).json({ success: false, message: 'Failed to update images' })
  }
}

module.exports = {
  createProject,
  getProjects,
  getProject,
  getProjectBySlug,
  updateProject,
  deleteProject,
  duplicateProject,
  toggleFeatured,
  togglePublish,
  toggleArchive,
  reorderProjects,
  updateImages,
}
