const { Router } = require('express')
const { body } = require('express-validator')
const { authenticateToken } = require('../../shared/middleware/auth')
const { handleValidation } = require('../../shared/middleware/validate')
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} = require('./categories.controller')

const router = Router()

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
