const fs = require('fs')
const path = require('path')
const AboutContent = require('../../shared/models/AboutContent')
const { auditLog } = require('../../shared/utilities/auditLogger')

async function getAboutContent(_req, res) {
  try {
    let content = await AboutContent.findOne().lean()
    if (!content) {
      content = await AboutContent.create({})
    }
    res.json({ success: true, content })
  } catch (error) {
    console.error('[about] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch about content' })
  }
}

function parseArrayField(value) {
  if (value === undefined) return undefined
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return undefined }
  }
  return Array.isArray(value) ? value : undefined
}

async function updateAboutContent(req, res) {
  try {
    let content = await AboutContent.findOne()
    if (!content) {
      content = new AboutContent()
    }

    const textFields = ['title', 'titleAm', 'subtitle', 'subtitleAm', 'location', 'status']
    textFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field]
      }
    })

    if (req.body.yearsOfExperience !== undefined) {
      content.yearsOfExperience = parseInt(req.body.yearsOfExperience, 10) || 0
    }

    if (req.body.education) {
      const parsed = parseArrayField(req.body.education)
      if (parsed) {
        content.education = parsed.map((e) => ({
          degree: e.degree || '',
          institution: e.institution || '',
          year: e.year || '',
        }))
      }
    }

    if (req.body.experience) {
      const parsed = parseArrayField(req.body.experience)
      if (parsed) {
        content.experience = parsed.map((e) => ({
          role: e.role || '',
          company: e.company || '',
          duration: e.duration || '',
          description: e.description || '',
        }))
      }
    }

    if (req.body.certifications) {
      const parsed = parseArrayField(req.body.certifications)
      if (parsed) {
        content.certifications = parsed.map((c) => ({
          title: c.title || '',
          verificationUrl: c.verificationUrl || '',
          displayOrder: parseInt(c.displayOrder, 10) || 0,
        }))
      }
    }

    if (req.body.storyPillars) {
      const parsed = parseArrayField(req.body.storyPillars)
      if (parsed) {
        content.storyPillars = parsed.map((p) => ({
          title: p.title || '',
          titleAm: p.titleAm || '',
          content: p.content || '',
          contentAm: p.contentAm || '',
        }))
      }
    }

    if (req.body.idePresentation) {
      let ide = req.body.idePresentation
      if (typeof ide === 'string') {
        try { ide = JSON.parse(ide) } catch { ide = null }
      }
      if (ide && typeof ide === 'object') {
        if (Array.isArray(ide.skills)) content.idePresentation.skills = ide.skills
        if (ide.available !== undefined) content.idePresentation.available = Boolean(ide.available)
        if (ide.location !== undefined) content.idePresentation.location = String(ide.location)
      }
    }

    if (req.body.highlightMetrics) {
      const parsed = parseArrayField(req.body.highlightMetrics)
      if (parsed) {
        content.highlightMetrics = parsed.map((m) => ({
          icon: m.icon || '',
          title: m.title || '',
          titleAm: m.titleAm || '',
          value: m.value || '',
        }))
      }
    }

    if (req.file) {
      if (content.profileImage && content.profileImage.startsWith('/uploads/')) {
        const oldPath = path.resolve(__dirname, '..', '..', '..', content.profileImage)
        try { fs.unlinkSync(oldPath) } catch { /* file may not exist */ }
      }
      content.profileImage = `/uploads/${req.file.filename}`
    } else if (req.body.profileImageUrl) {
      content.profileImage = req.body.profileImageUrl
    }

    await content.save()
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'AboutContent', resourceId: content._id, details: { updatedFields: Object.keys(req.body) }, req })
    res.json({ success: true, content })
  } catch (error) {
    console.error('[about] update error:', error.message, error.errors || '')
    res.status(500).json({ success: false, message: 'Failed to update about content' })
  }
}

module.exports = { getAboutContent, updateAboutContent }
