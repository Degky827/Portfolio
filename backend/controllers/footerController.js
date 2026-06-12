const fs = require('fs')
const path = require('path')
const FooterContent = require('../models/FooterContent')

async function getFooterContent(_req, res) {
  try {
    let content = await FooterContent.findOne().lean()
    if (!content) {
      content = await FooterContent.create({})
    }
    res.json({ success: true, content })
  } catch (error) {
    console.error('[footer] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch footer content' })
  }
}

async function updateFooterContent(req, res) {
  try {
    let content = await FooterContent.findOne()
    if (!content) {
      content = new FooterContent()
    }

    const textFields = [
      'brandName', 'footerDescription', 'copyrightText', 'status',
      'locationLine1', 'locationLine2',
      'email', 'emailProtocol',
      'phone', 'phoneProtocol', 'phoneCustomUrl',
      'visualSeparator', 'techAttribution',
    ]
    textFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field]
      }
    })

    if (req.body.quickLinks) {
      let quickLinks = req.body.quickLinks
      if (typeof quickLinks === 'string') {
        try { quickLinks = JSON.parse(quickLinks) } catch { /* ignore */ }
      }
      content.quickLinks = Array.isArray(quickLinks) ? quickLinks : []
    }

    if (req.body.socialLinks) {
      let socialLinks = req.body.socialLinks
      if (typeof socialLinks === 'string') {
        try { socialLinks = JSON.parse(socialLinks) } catch { /* ignore */ }
      }
      content.socialLinks = Array.isArray(socialLinks) ? socialLinks : []
    }

    if (req.file) {
      if (content.footerLogo && content.footerLogo.startsWith('/uploads/')) {
        const oldPath = path.resolve(__dirname, '..', content.footerLogo)
        try { fs.unlinkSync(oldPath) } catch { /* file may not exist */ }
      }
      content.footerLogo = `/uploads/${req.file.filename}`
    } else if (req.body.footerLogoUrl) {
      content.footerLogo = req.body.footerLogoUrl
    }

    await content.save()
    res.json({ success: true, content })
  } catch (error) {
    console.error('[footer] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update footer content' })
  }
}

module.exports = { getFooterContent, updateFooterContent }
