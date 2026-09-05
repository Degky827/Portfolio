const CVContent = require('../../shared/models/CVContent')
const { auditLog } = require('../../shared/utilities/auditLogger')
const { emitToAll } = require('../../infrastructure/socket')

async function getCVContent(_req, res) {
  try {
    let content = await CVContent.findOne()
    if (!content) {
      content = await CVContent.create({})
    }
    res.json({ success: true, content })
  } catch (error) {
    console.error('[cv] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch CV content' })
  }
}

async function updateCVContent(req, res) {
  try {
    let content = await CVContent.findOne()
    if (!content) {
      content = new CVContent()
    }

    const body = req.body
    if (body.personal) content.personal = { ...content.personal, ...body.personal }
    if (body.summary !== undefined) content.summary = body.summary
    if (body.skills) content.skills = { ...content.skills, ...body.skills }
    if (body.experience) content.experience = body.experience
    if (body.projects) content.projects = body.projects
    if (body.education) content.education = body.education
    if (body.certifications) content.certifications = body.certifications
    if (body.achievements) content.achievements = body.achievements
    if (body.languages) content.languages = body.languages

    await content.save()

    res.json({ success: true, content })
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'CVContent', resourceId: content._id, details: { updatedFields: Object.keys(body) }, req })
    emitToAll('content:updated', { type: 'cv' })
  } catch (error) {
    console.error('[cv] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update CV content' })
  }
}

module.exports = { getCVContent, updateCVContent }
