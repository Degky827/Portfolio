const Skill = require('../models/Skill')

async function createSkill(req, res) {
  try {
    const {
      name, category, icon, proficiency,
      description, displayOrder, featured, status,
    } = req.body

    const skill = await Skill.create({
      name,
      category,
      icon: icon || '',
      proficiency: parseInt(proficiency, 10) || 0,
      description: description || '',
      displayOrder: parseInt(displayOrder, 10) || 0,
      featured: featured === true || featured === 'true',
      status: status || 'active',
    })

    res.status(201).json({ success: true, skill })
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

    const [totalCount, skills] = await Promise.all([
      Skill.countDocuments(query),
      Skill.find(query).sort({ displayOrder: 1, name: 1 }).skip(skip).limit(limit).lean(),
    ])

    const categories = await Skill.distinct('category')

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

    const fields = [
      'name', 'category', 'icon', 'proficiency',
      'description', 'displayOrder', 'featured', 'status',
    ]

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'featured') {
          skill[field] = req.body[field] === true || req.body[field] === 'true'
        } else if (field === 'proficiency' || field === 'displayOrder') {
          skill[field] = parseInt(req.body[field], 10) || 0
        } else {
          skill[field] = req.body[field]
        }
      }
    })

    await skill.save()

    res.json({ success: true, skill })
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

    await Skill.findByIdAndDelete(req.params.id)

    res.json({ success: true, message: 'Skill deleted successfully' })
  } catch (error) {
    console.error('[skills] deleteSkill error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete skill' })
  }
}

module.exports = { createSkill, getSkills, getSkill, updateSkill, deleteSkill }
