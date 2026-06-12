const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
} = require('./skills.controller')

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
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
]

router.post('/', authenticateToken, skillValidation, handleValidation, createSkill)
router.get('/', getSkills)
router.get('/:id', getSkill)
router.put('/:id', authenticateToken, skillValidation, handleValidation, updateSkill)
router.delete('/:id', authenticateToken, deleteSkill)

module.exports = router
