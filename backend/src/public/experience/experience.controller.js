const Experience = require('../../shared/models/Experience')
const { auditLog } = require('../../shared/utilities/auditLogger')
const { emitToAll } = require('../../infrastructure/socket')

async function getExperiences(req, res) {
  try {
    const { status, limit = 50, skip = 0 } = req.query
    const filter = {}
    if (status) filter.status = status

    const experiences = await Experience.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))

    const total = await Experience.countDocuments(filter)
    res.json({ success: true, experiences, total })
  } catch (error) {
    console.error('[experience] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch experiences' })
  }
}

async function getExperienceById(req, res) {
  try {
    const experience = await Experience.findById(req.params.id)
    if (!experience) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, experience })
  } catch (error) {
    console.error('[experience] get by id error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch experience' })
  }
}

async function createExperience(req, res) {
  try {
    const experience = await Experience.create(req.body)
    res.status(201).json({ success: true, experience })
    await auditLog({ userId: req.user?._id, action: 'CREATE', resource: 'Experience', resourceId: experience._id, details: { role: experience.role }, req })
    emitToAll('content:updated', { type: 'experience' })
  } catch (error) {
    console.error('[experience] create error:', error)
    res.status(500).json({ success: false, message: error.message || 'Failed to create experience' })
  }
}

async function updateExperience(req, res) {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!experience) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, experience })
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'Experience', resourceId: experience._id, details: { updatedFields: Object.keys(req.body) }, req })
    emitToAll('content:updated', { type: 'experience' })
  } catch (error) {
    console.error('[experience] update error:', error)
    res.status(500).json({ success: false, message: error.message || 'Failed to update experience' })
  }
}

async function deleteExperience(req, res) {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id)
    if (!experience) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, message: 'Deleted' })
    await auditLog({ userId: req.user?._id, action: 'DELETE', resource: 'Experience', resourceId: req.params.id, details: { role: experience.role }, req })
    emitToAll('content:updated', { type: 'experience' })
  } catch (error) {
    console.error('[experience] delete error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete experience' })
  }
}

async function reorderExperiences(req, res) {
  try {
    const { orders } = req.body
    if (!Array.isArray(orders)) return res.status(400).json({ success: false, message: 'orders array required' })
    for (const { id, displayOrder } of orders) {
      await Experience.findByIdAndUpdate(id, { displayOrder })
    }
    res.json({ success: true, message: 'Reordered' })
    emitToAll('content:updated', { type: 'experience' })
  } catch (error) {
    console.error('[experience] reorder error:', error)
    res.status(500).json({ success: false, message: 'Failed to reorder' })
  }
}

module.exports = { getExperiences, getExperienceById, createExperience, updateExperience, deleteExperience, reorderExperiences }
