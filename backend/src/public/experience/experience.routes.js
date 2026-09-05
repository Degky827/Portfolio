const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../../shared/middleware/auth')
const { getExperiences, getExperienceById, createExperience, updateExperience, deleteExperience, reorderExperiences } = require('./experience.controller')

router.get('/', getExperiences)
router.get('/:id', getExperienceById)
router.post('/', authenticateToken, createExperience)
router.put('/:id', authenticateToken, updateExperience)
router.delete('/:id', authenticateToken, deleteExperience)
router.put('/reorder/all', authenticateToken, reorderExperiences)

module.exports = router
