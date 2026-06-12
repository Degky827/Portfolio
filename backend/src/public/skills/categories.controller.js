const Category = require('../../shared/models/Category')
const Skill = require('../../shared/models/Skill')

async function createCategory(req, res) {
  try {
    const { title, icon, color, order, type } = req.body

    const existing = await Category.findOne({ title: { $regex: `^${title}$`, $options: 'i' } })
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this title already exists' })
    }

    const category = await Category.create({
      title,
      icon: icon || '',
      color: color || '#6366f1',
      order: parseInt(order, 10) || 0,
      type: type || 'skills',
    })

    res.status(201).json({ success: true, category })
  } catch (error) {
    console.error('[categories] createCategory error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to create category' })
  }
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
    console.log('[categories] Created default categories')
  }
}

async function getCategories(req, res) {
  try {
    await ensureDefaultCategories()
    const categories = await Category.find().sort({ order: 1 }).lean()
    res.json({ success: true, categories })
  } catch (error) {
    console.error('[categories] getCategories error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch categories' })
  }
}

async function getCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id).lean()
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }
    res.json({ success: true, category })
  } catch (error) {
    console.error('[categories] getCategory error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch category' })
  }
}

async function updateCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    const fields = ['title', 'icon', 'color', 'order', 'type']
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'order') {
          category[field] = parseInt(req.body[field], 10) || 0
        } else {
          category[field] = req.body[field]
        }
      }
    })

    if (req.body.title && req.body.title !== category.title) {
      const oldTitle = category.title
      await Skill.updateMany(
        { category: oldTitle },
        { $set: { category: req.body.title } },
      )
      category.title = req.body.title
    }

    await category.save()

    res.json({ success: true, category })
  } catch (error) {
    console.error('[categories] updateCategory error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to update category' })
  }
}

async function deleteCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    await Skill.deleteMany({ category: category.title })
    await Category.findByIdAndDelete(req.params.id)

    res.json({ success: true, message: 'Category and its skills deleted successfully' })
  } catch (error) {
    console.error('[categories] deleteCategory error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete category' })
  }
}

async function reorderCategories(req, res) {
  try {
    const { orderedIds } = req.body
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array' })
    }

    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }))

    await Category.bulkWrite(operations)

    const categories = await Category.find().sort({ order: 1 }).lean()
    res.json({ success: true, categories })
  } catch (error) {
    console.error('[categories] reorderCategories error:', error)
    res.status(500).json({ success: false, message: 'Failed to reorder categories' })
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
}
