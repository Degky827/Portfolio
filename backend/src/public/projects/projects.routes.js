const { Router } = require('express')
const { body } = require('express-validator')
const { authenticateToken } = require('../../shared/middleware/auth')
const { handleValidation } = require('../../shared/middleware/validate')
const {
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
} = require('./projects.controller')

const router = Router()

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Project title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required').isLength({ max: 500 }).withMessage('Description too long'),
  body('category').trim().notEmpty().withMessage('Category is required').isLength({ max: 100 }).withMessage('Category too long'),
]

router.get('/', getProjects)
router.get('/slug/:slug', getProjectBySlug)
router.get('/:id', getProject)

router.post('/', authenticateToken, projectValidation, handleValidation, createProject)
router.put('/reorder', authenticateToken, reorderProjects)
router.put('/:id', authenticateToken, projectValidation, handleValidation, updateProject)
router.delete('/:id', authenticateToken, deleteProject)
router.post('/:id/duplicate', authenticateToken, duplicateProject)
router.patch('/:id/featured', authenticateToken, toggleFeatured)
router.patch('/:id/publish', authenticateToken, togglePublish)
router.patch('/:id/archive', authenticateToken, toggleArchive)
router.patch('/:id/images', authenticateToken, updateImages)

module.exports = router
