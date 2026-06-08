const fs = require('fs')
const path = require('path')
const Project = require('../models/Project')

async function createProject(req, res) {
  try {
    const {
      title, shortDescription, fullDescription,
      technologies, githubUrl, liveDemoUrl,
      category, featured, displayOrder, status,
    } = req.body

    const project = await Project.create({
      title,
      shortDescription,
      fullDescription: fullDescription || '',
      technologies: technologies || [],
      githubUrl: githubUrl || '',
      liveDemoUrl: liveDemoUrl || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
      category,
      featured: featured === true || featured === 'true',
      displayOrder: parseInt(displayOrder, 10) || 0,
      status: status || 'active',
    })

    res.status(201).json({ success: true, project })
  } catch (error) {
    console.error('[projects] createProject error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to create project' })
  }
}

async function getProjects(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 50)
    const search = req.query.search || ''
    const category = req.query.category || ''
    const featured = req.query.featured || ''
    const statusFilter = req.query.status || ''
    const publicOnly = req.query.public === 'true'

    const skip = (page - 1) * limit
    const query = {}

    if (publicOnly) {
      query.status = 'active'
    } else if (statusFilter) {
      query.status = statusFilter
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ]
    }
    if (category) {
      query.category = category
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

    res.json({
      success: true,
      totalCount,
      projects,
      categories: allCategories,
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

async function updateProject(req, res) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const fields = [
      'title', 'shortDescription', 'fullDescription',
      'technologies', 'githubUrl', 'liveDemoUrl',
      'category', 'featured', 'displayOrder', 'status',
    ]

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'featured') {
          project[field] = req.body[field] === true || req.body[field] === 'true'
        } else if (field === 'displayOrder') {
          project[field] = parseInt(req.body[field], 10) || 0
        } else if (field === 'technologies') {
          project[field] = typeof req.body[field] === 'string'
            ? req.body[field].split(',').map((s) => s.trim()).filter(Boolean)
            : req.body[field] || []
        } else {
          project[field] = req.body[field]
        }
      }
    })

    if (req.file) {
      if (project.image && project.image.startsWith('/uploads/')) {
        const oldPath = path.resolve(__dirname, '..', project.image)
        try { fs.unlinkSync(oldPath) } catch { /* file may not exist */ }
      }
      project.image = `/uploads/${req.file.filename}`
    }

    await project.save()

    res.json({ success: true, project })
  } catch (error) {
    console.error('[projects] updateProject error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to update project' })
  }
}

async function deleteProject(req, res) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (project.image && project.image.startsWith('/uploads/')) {
      const filePath = path.resolve(__dirname, '..', project.image)
      try { fs.unlinkSync(filePath) } catch { /* file may not exist */ }
    }

    await Project.findByIdAndDelete(req.params.id)

    res.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    console.error('[projects] deleteProject error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete project' })
  }
}

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject }
