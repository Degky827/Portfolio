const fs = require('fs')
const path = require('path')
const AboutContent = require('../models/AboutContent')

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

async function updateAboutContent(req, res) {
  try {
    let content = await AboutContent.findOne()
    if (!content) {
      content = new AboutContent()
    }

    const textFields = [
      'title', 'subtitle', 'description', 'location', 'cvUrl', 'status',
    ]
    textFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field]
      }
    })

    if (req.body.yearsOfExperience !== undefined) {
      content.yearsOfExperience = parseInt(req.body.yearsOfExperience, 10) || 0
    }

    if (req.body.education) {
      let education = req.body.education
      if (typeof education === 'string') {
        try { education = JSON.parse(education) } catch { /* ignore */ }
      }
      content.education = Array.isArray(education) ? education : []
    }

    if (req.body.experience) {
      let experience = req.body.experience
      if (typeof experience === 'string') {
        try { experience = JSON.parse(experience) } catch { /* ignore */ }
      }
      content.experience = Array.isArray(experience) ? experience : []
    }

    if (req.body.achievements) {
      let achievements = req.body.achievements
      if (typeof achievements === 'string') {
        try { achievements = JSON.parse(achievements) } catch { /* ignore */ }
      }
      content.achievements = Array.isArray(achievements) ? achievements : []
    }

    if (req.file) {
      if (content.profileImage && content.profileImage.startsWith('/uploads/')) {
        const oldPath = path.resolve(__dirname, '..', content.profileImage)
        try { fs.unlinkSync(oldPath) } catch { /* file may not exist */ }
      }
      content.profileImage = `/uploads/${req.file.filename}`
    }

    await content.save()
    res.json({ success: true, content })
  } catch (error) {
    console.error('[about] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update about content' })
  }
}

module.exports = { getAboutContent, updateAboutContent }
