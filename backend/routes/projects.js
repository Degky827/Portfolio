const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken, authorizeSuperAdmin } = require('../middleware/auth')
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
} = require('../controllers/projectController')

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

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
]

// Public routes
router.get('/', getProjects)
router.get('/slug/:slug', getProjectBySlug)
router.get('/:id', getProject)

// Protected routes
router.post(
  '/',
  authenticateToken,
  authorizeSuperAdmin,
  projectValidation,
  handleValidation,
  createProject,
)

router.put(
  '/:id',
  authenticateToken,
  authorizeSuperAdmin,
  projectValidation,
  handleValidation,
  updateProject,
)

router.delete(
  '/:id',
  authenticateToken,
  authorizeSuperAdmin,
  deleteProject,
)

router.post(
  '/:id/duplicate',
  authenticateToken,
  authorizeSuperAdmin,
  duplicateProject,
)

router.patch(
  '/:id/featured',
  authenticateToken,
  authorizeSuperAdmin,
  toggleFeatured,
)

router.patch(
  '/:id/publish',
  authenticateToken,
  authorizeSuperAdmin,
  togglePublish,
)

router.patch(
  '/:id/archive',
  authenticateToken,
  authorizeSuperAdmin,
  toggleArchive,
)

router.put(
  '/reorder',
  authenticateToken,
  authorizeSuperAdmin,
  reorderProjects,
)

router.patch(
  '/:id/images',
  authenticateToken,
  authorizeSuperAdmin,
  updateImages,
)

module.exports = router
