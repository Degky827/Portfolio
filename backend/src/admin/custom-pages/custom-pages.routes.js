const { Router } = require('express')
const { body } = require('express-validator')
const { authenticateToken } = require('../../shared/middleware/auth')
const { handleValidation } = require('../../shared/middleware/validate')
const {
  getCustomPages,
  getCustomPageById,
  getCustomPageBySlug,
  createCustomPage,
  updateCustomPage,
  deleteCustomPage,
  toggleCustomPageStatus,
} = require('./custom-pages.controller')

const router = Router()

const pageValidation = [
  body('title').trim().notEmpty().withMessage('Page title is required'),
]

router.get('/custom-pages', authenticateToken, getCustomPages)
router.get('/custom-pages/:id', authenticateToken, getCustomPageById)
router.post('/custom-pages', authenticateToken, pageValidation, handleValidation, createCustomPage)
router.put('/custom-pages/:id', authenticateToken, pageValidation, handleValidation, updateCustomPage)
router.delete('/custom-pages/:id', authenticateToken, deleteCustomPage)
router.patch('/custom-pages/:id/status', authenticateToken, toggleCustomPageStatus)

module.exports = router
