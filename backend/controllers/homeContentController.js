const fs = require('fs')
const path = require('path')
const HomeContent = require('../models/HomeContent')

async function getHomeContent(_req, res) {
  try {
    let content = await HomeContent.findOne().lean()
    if (!content) {
      content = await HomeContent.create({})
    }
    res.json({ success: true, content })
  } catch (error) {
    console.error('[homeContent] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch home content' })
  }
}

async function updateHomeContent(req, res) {
  try {
    let content = await HomeContent.findOne()
    if (!content) {
      content = new HomeContent()
    }

    const textFields = [
      'heroTitle', 'heroSubtitle', 'heroDescription',
      'resumeUrl', 'primaryButtonText', 'primaryButtonLink',
      'secondaryButtonText', 'secondaryButtonLink',
    ]

    textFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field]
      }
    })

    if (req.body.socialLinks) {
      let socialLinks = req.body.socialLinks
      if (typeof socialLinks === 'string') {
        try { socialLinks = JSON.parse(socialLinks) } catch { /* ignore */ }
      }
      if (!content.socialLinks) content.socialLinks = {}
      ;['github', 'linkedin', 'telegram', 'twitter', 'facebook', 'instagram'].forEach((key) => {
        if (socialLinks[key] !== undefined) {
          content.socialLinks[key] = socialLinks[key]
        }
      })
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
    console.error('[homeContent] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update home content' })
  }
}

module.exports = { getHomeContent, updateHomeContent }
