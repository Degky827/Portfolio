const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../../shared/middleware/auth')
const { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial, reorderTestimonials } = require('./testimonials.controller')

router.get('/', getTestimonials)
router.get('/:id', getTestimonialById)
router.post('/', authenticateToken, createTestimonial)
router.put('/:id', authenticateToken, updateTestimonial)
router.delete('/:id', authenticateToken, deleteTestimonial)
router.put('/reorder/all', authenticateToken, reorderTestimonials)

module.exports = router
