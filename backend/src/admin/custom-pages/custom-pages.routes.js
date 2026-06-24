const { Router } = require('express')
const { body } = require('express-validator')
const { authenticateToken, authorizeSuperAdmin } = require('../../shared/middleware/auth')
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

router.get('/custom-pages', authenticateToken, authorizeSuperAdmin, getCustomPages)
router.get('/custom-pages/:id', authenticateToken, authorizeSuperAdmin, getCustomPageById)
router.post('/custom-pages', authenticateToken, authorizeSuperAdmin, pageValidation, handleValidation, createCustomPage)
router.put('/custom-pages/:id', authenticateToken, authorizeSuperAdmin, pageValidation, handleValidation, updateCustomPage)
router.delete('/custom-pages/:id', authenticateToken, authorizeSuperAdmin, deleteCustomPage)
router.patch('/custom-pages/:id/status', authenticateToken, authorizeSuperAdmin, toggleCustomPageStatus)

module.exports = router
