const { Router } = require('express')
const { body } = require('express-validator')
const { authenticateToken } = require('../../shared/middleware/auth')
const { handleValidation } = require('../../shared/middleware/validate')
const {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
} = require('./skills.controller')

const router = Router()

const skillValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('category').trim().notEmpty().withMessage('Category is required').isLength({ max: 100 }).withMessage('Category too long'),
]

router.post('/', authenticateToken, skillValidation, handleValidation, createSkill)
router.get('/', getSkills)
router.get('/:id', getSkill)
router.put('/:id', authenticateToken, skillValidation, handleValidation, updateSkill)
router.delete('/:id', authenticateToken, deleteSkill)

module.exports = router
