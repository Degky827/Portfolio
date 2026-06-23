const Skill = require('../../shared/models/Skill')
const Category = require('../../shared/models/Category')
const { createNotification } = require('../../admin/notifications/notifications.controller')
const { auditLog } = require('../../shared/utilities/auditLogger')

const VALID_CATEGORIES = [
  'Frontend Development',
  'Backend Development',
  'Mobile Development',
  'Networking',
  'Tools',
  'Certificates',
]

const CATEGORY_MIGRATION_MAP = {
  frontend: 'Frontend Development',
  'frontend development': 'Frontend Development',
  backend: 'Backend Development',
  'backend development': 'Backend Development',
  mobile: 'Mobile Development',
  'mobile development': 'Mobile Development',
  networking: 'Networking',
  tools: 'Tools',
  certificates: 'Certificates',
  certificate: 'Certificates',
}

const DEFAULT_CATEGORIES = [
  { title: 'Frontend Development', icon: '', color: '#6366f1', order: 0, type: 'skills' },
  { title: 'Backend Development', icon: '', color: '#10b981', order: 1, type: 'skills' },
  { title: 'Mobile Development', icon: '', color: '#3b82f6', order: 2, type: 'skills' },
  { title: 'Networking', icon: '', color: '#8b5cf6', order: 3, type: 'skills' },
  { title: 'Tools', icon: '', color: '#ef4444', order: 4, type: 'skills' },
  { title: 'Certificates', icon: '', color: '#14b8a6', order: 5, type: 'certificates' },
]

async function ensureDefaultCategories() {
  const count = await Category.countDocuments()
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES)
    console.log('[skills] Created default categories')
  }
}

async function migrateOldCategories() {
  const skills = await Skill.find({}).lean()
  let updated = 0
  for (const skill of skills) {
    const old = skill.category?.trim().toLowerCase() || ''
    const mapped = CATEGORY_MIGRATION_MAP[old]
    if (mapped && skill.category !== mapped) {
      await Skill.updateOne({ _id: skill._id }, { $set: { category: mapped } })
      updated++
      console.log(`[skills] Migrated skill "${skill.name}": "${skill.category}" → "${mapped}"`)
    }
  }
  if (updated > 0) {
    console.log(`[skills] Migrated ${updated} skill(s) to new category values`)
  }
}

async function createSkill(req, res) {
  try {
    const {
      name, category, icon, proficiency,
      description, displayOrder, featured, status,
      issuer, issueDate, certificateUrl,
    } = req.body

    console.log('[skills] Incoming category:', JSON.stringify(category))

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `"${category}" is not a valid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      })
    }

    const isCert = category?.toLowerCase() === 'certificates'

    const skill = await Skill.create({
      name,
      category,
      icon: icon || '',
      proficiency: isCert ? null : (parseInt(proficiency, 10) || 0),
      description: description || '',
      displayOrder: parseInt(displayOrder, 10) || 0,
      featured: featured === true || featured === 'true',
      status: status || 'active',
      issuer: issuer || '',
      issueDate: issueDate || '',
      certificateUrl: certificateUrl || '',
    })

    await createNotification({
      type: 'skill_created',
      title: isCert ? 'Certificate Added' : 'Skill Added',
      message: `"${name}" has been created${isCert && issuer ? ` by ${issuer}` : ''}`,
      link: '/admin/skills',
      metadata: { skillId: skill._id, category, isCert },
    })

    res.status(201).json({ success: true, skill })
    await auditLog({ userId: req.user?._id, action: 'CREATE', resource: 'Skill', resourceId: skill._id, details: { name: skill.name, category: skill.category }, req })
  } catch (error) {
    console.error('[skills] createSkill error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to create skill' })
  }
}

async function getSkills(req, res) {
  try {
    await ensureDefaultCategories()
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 50)
    const search = req.query.search || ''
    const category = req.query.category || ''
    const featured = req.query.featured || ''
    const statusFilter = req.query.status || ''

    const skip = (page - 1) * limit
    const query = {}

    if (statusFilter) {
      query.status = statusFilter
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { issuer: { $regex: search, $options: 'i' } },
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

    const [totalCount, skills, categories] = await Promise.all([
      Skill.countDocuments(query),
      Skill.find(query).sort({ displayOrder: 1, name: 1 }).skip(skip).limit(limit).lean(),
      Category.find().sort({ order: 1 }).lean(),
    ])

    res.json({
      success: true,
      totalCount,
      skills,
      categories,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        hasMore: skip + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('[skills] getSkills error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch skills' })
  }
}

async function getSkill(req, res) {
  try {
    const skill = await Skill.findById(req.params.id).lean()
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' })
    }
    res.json({ success: true, skill })
  } catch (error) {
    console.error('[skills] getSkill error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch skill' })
  }
}

async function updateSkill(req, res) {
  try {
    const skill = await Skill.findById(req.params.id)
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' })
    }

    const isCert = req.body.category
      ? req.body.category.toLowerCase() === 'certificates'
      : skill.category?.toLowerCase() === 'certificates'

    const fields = [
      'name', 'category', 'icon', 'proficiency',
      'description', 'displayOrder', 'featured', 'status',
      'issuer', 'issueDate', 'certificateUrl',
    ]

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'featured') {
          skill[field] = req.body[field] === true || req.body[field] === 'true'
        } else if (field === 'proficiency') {
          skill[field] = isCert ? null : (parseInt(req.body[field], 10) || 0)
        } else if (field === 'displayOrder') {
          skill[field] = parseInt(req.body[field], 10) || 0
        } else {
          skill[field] = req.body[field]
        }
      }
    })

    await skill.save()

    await createNotification({
      type: 'skill_updated',
      title: isCert ? 'Certificate Updated' : 'Skill Updated',
      message: `"${skill.name}" has been updated.`,
      link: '/admin/skills',
      metadata: { skillId: skill._id, category: skill.category, isCert },
    })

    res.json({ success: true, skill })
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'Skill', resourceId: skill._id, details: { name: skill.name, category: skill.category }, req })
  } catch (error) {
    console.error('[skills] updateSkill error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to update skill' })
  }
}

async function deleteSkill(req, res) {
  try {
    const skill = await Skill.findById(req.params.id)
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' })
    }

    const isCert = skill.category?.toLowerCase() === 'certificates'

    await Skill.findByIdAndDelete(req.params.id)

    await createNotification({
      type: 'skill_deleted',
      title: isCert ? 'Certificate Deleted' : 'Skill Deleted',
      message: `"${skill.name}" has been deleted.`,
      link: '/admin/skills',
      metadata: { category: skill.category, isCert },
    })

    await auditLog({ userId: req.user?._id, action: 'DELETE', resource: 'Skill', resourceId: skill._id, details: { name: skill.name, category: skill.category }, req })

    res.json({ success: true, message: 'Skill deleted successfully' })
  } catch (error) {
    console.error('[skills] deleteSkill error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete skill' })
  }
}

module.exports = { createSkill, getSkills, getSkill, updateSkill, deleteSkill, migrateOldCategories, VALID_CATEGORIES }
