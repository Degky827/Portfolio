const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken, authorizeSuperAdmin } = require('../middleware/auth')
const upload = require('../config/upload')
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
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

router.get('/', getProjects)
router.get('/:id', getProject)

router.post(
  '/',
  authenticateToken,
  authorizeSuperAdmin,
  upload.single('image'),
  projectValidation,
  handleValidation,
  createProject,
)

router.put(
  '/:id',
  authenticateToken,
  authorizeSuperAdmin,
  upload.single('image'),
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

module.exports = router
