const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken, authorizeSuperAdmin } = require('../../shared/middleware/auth')
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
