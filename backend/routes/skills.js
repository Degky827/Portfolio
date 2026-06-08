const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken } = require('../middleware/auth')
const {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController')

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

const skillValidation = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('proficiency').isInt({ min: 0, max: 100 }).withMessage('Proficiency must be between 0 and 100'),
]

router.post(
  '/',
  authenticateToken,
  skillValidation,
  handleValidation,
  createSkill,
)

router.get('/', getSkills)

router.get('/:id', getSkill)

router.put(
  '/:id',
  authenticateToken,
  skillValidation,
  handleValidation,
  updateSkill,
)

router.delete('/:id', authenticateToken, deleteSkill)

module.exports = router
