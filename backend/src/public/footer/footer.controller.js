const fs = require('fs')
const path = require('path')
const FooterContent = require('../../shared/models/FooterContent')

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
      'brandName', 'brandDescription', 'copyrightText', 'status',
      'locationHeadline', 'subLocation', 'locationMapUrl',
      'emailAddress', 'emailProtocol',
      'phoneNumber', 'phoneProtocol', 'phoneCustomUrl',
      'visualSeparator', 'attributionText',
    ]
    textFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field]
      }
    })

    if (req.body.navigation) {
      let navigation = req.body.navigation
      if (typeof navigation === 'string') {
        try { navigation = JSON.parse(navigation) } catch { /* ignore */ }
      }
      if (Array.isArray(navigation)) {
        content.navigation = navigation.map((n) => ({
          label: n.label || '',
          url: n.url || '',
          order: parseInt(n.order, 10) || 0,
        }))
      } else {
        content.navigation = []
      }
    }

    if (req.body.socialLinks) {
      let socialLinks = req.body.socialLinks
      if (typeof socialLinks === 'string') {
        try { socialLinks = JSON.parse(socialLinks) } catch { /* ignore */ }
      }
      if (Array.isArray(socialLinks)) {
        content.socialLinks = socialLinks.map((s) => ({
          platform: s.platform || '',
          url: s.url || '',
          displayOrder: parseInt(s.displayOrder, 10) || 0,
          active: Boolean(s.active),
        }))
      } else {
        content.socialLinks = []
      }
    }

    if (req.body.phoneProtocol !== undefined) {
      const validProtocols = ['tel', 'whatsapp', 'telegram', 'custom']
      content.phoneProtocol = validProtocols.includes(req.body.phoneProtocol) ? req.body.phoneProtocol : 'tel'
    }

    if (req.file) {
      if (content.footerLogo && content.footerLogo.startsWith('/uploads/')) {
        const oldPath = path.resolve(__dirname, '..', '..', '..', content.footerLogo)
        try { fs.unlinkSync(oldPath) } catch { /* file may not exist */ }
      }
      content.footerLogo = `/uploads/${req.file.filename}`
    } else if (req.body.footerLogoUrl) {
      content.footerLogo = req.body.footerLogoUrl
    }

    await content.save()
    res.json({ success: true, content })
  } catch (error) {
    console.error('[footer] update error:', error.message, error.errors || '')
    res.status(500).json({ success: false, message: 'Failed to update footer content' })
  }
}

module.exports = { getFooterContent, updateFooterContent }
