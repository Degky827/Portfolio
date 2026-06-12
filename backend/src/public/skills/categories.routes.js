const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} = require('./categories.controller')

const router = Router()

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((e) => e.msg).join(', '),
    })
  }
  next()
}

const categoryValidation = [
  body('title').trim().notEmpty().withMessage('Category title is required'),
]

router.post('/', authenticateToken, categoryValidation, handleValidation, createCategory)
router.get('/', getCategories)
router.get('/:id', getCategory)
router.put('/reorder', authenticateToken, reorderCategories)
router.put('/:id', authenticateToken, updateCategory)
router.delete('/:id', authenticateToken, deleteCategory)

module.exports = router
