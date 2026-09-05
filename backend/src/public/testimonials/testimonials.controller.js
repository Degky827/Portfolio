const Testimonial = require('../../shared/models/Testimonial')
const { auditLog } = require('../../shared/utilities/auditLogger')
const { emitToAll } = require('../../infrastructure/socket')

async function getTestimonials(req, res) {
  try {
    const { status, featured, limit = 50, skip = 0 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (featured !== undefined) filter.featured = featured === 'true'

    const testimonials = await Testimonial.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))

    const total = await Testimonial.countDocuments(filter)
    res.json({ success: true, testimonials, total })
  } catch (error) {
    console.error('[testimonials] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' })
  }
}

async function getTestimonialById(req, res) {
  try {
    const testimonial = await Testimonial.findById(req.params.id)
    if (!testimonial) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, testimonial })
  } catch (error) {
    console.error('[testimonials] get by id error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch testimonial' })
  }
}

async function createTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.create(req.body)
    res.status(201).json({ success: true, testimonial })
    await auditLog({ userId: req.user?._id, action: 'CREATE', resource: 'Testimonial', resourceId: testimonial._id, details: { name: testimonial.name }, req })
    emitToAll('content:updated', { type: 'testimonials' })
  } catch (error) {
    console.error('[testimonials] create error:', error)
    res.status(500).json({ success: false, message: error.message || 'Failed to create testimonial' })
  }
}

async function updateTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!testimonial) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, testimonial })
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'Testimonial', resourceId: testimonial._id, details: { updatedFields: Object.keys(req.body) }, req })
    emitToAll('content:updated', { type: 'testimonials' })
  } catch (error) {
    console.error('[testimonials] update error:', error)
    res.status(500).json({ success: false, message: error.message || 'Failed to update testimonial' })
  }
}

async function deleteTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id)
    if (!testimonial) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, message: 'Deleted' })
    await auditLog({ userId: req.user?._id, action: 'DELETE', resource: 'Testimonial', resourceId: req.params.id, details: { name: testimonial.name }, req })
    emitToAll('content:updated', { type: 'testimonials' })
  } catch (error) {
    console.error('[testimonials] delete error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete testimonial' })
  }
}

async function reorderTestimonials(req, res) {
  try {
    const { orders } = req.body
    if (!Array.isArray(orders)) return res.status(400).json({ success: false, message: 'orders array required' })
    for (const { id, displayOrder } of orders) {
      await Testimonial.findByIdAndUpdate(id, { displayOrder })
    }
    res.json({ success: true, message: 'Reordered' })
    emitToAll('content:updated', { type: 'testimonials' })
  } catch (error) {
    console.error('[testimonials] reorder error:', error)
    res.status(500).json({ success: false, message: 'Failed to reorder' })
  }
}

module.exports = { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial, reorderTestimonials }
