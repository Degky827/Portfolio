const fs = require('fs')
const path = require('path')
const FooterContent = require('../../shared/models/FooterContent')
const NavbarSettings = require('../../shared/models/NavbarSettings')
const HomeContent = require('../../shared/models/HomeContent')
const User = require('../../shared/models/User')
const SiteSettings = require('../../shared/models/SiteSettings')
const ContactContent = require('../../shared/models/ContactContent')
const { auditLog } = require('../../shared/utilities/auditLogger')
const { syncFooterSocial } = require('../../shared/utilities/socialSync')

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
      'brandName', 'brandNameAm', 'brandDescription', 'brandDescriptionAm', 'copyrightText', 'status',
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
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'FooterContent', resourceId: content._id, details: { updatedFields: Object.keys(req.body) }, req })

    const syncBrandName = req.body.brandName
    if (syncBrandName !== undefined) {
      try { await NavbarSettings.findOneAndUpdate({}, { $set: { brandName: syncBrandName } }, { upsert: true }) } catch (e) { console.error('[footer] sync NavbarSettings.brandName:', e.message) }
      try { await HomeContent.findOneAndUpdate({}, { $set: { 'hero.fullName': syncBrandName } }, { upsert: true }) } catch (e) { console.error('[footer] sync HomeContent.hero.fullName:', e.message) }
      try { await User.updateMany({}, { $set: { displayName: syncBrandName } }) } catch (e) { console.error('[footer] sync User.displayName:', e.message) }
      try { await SiteSettings.findOneAndUpdate({}, { $set: { brandName: syncBrandName } }, { upsert: true }) } catch (e) { console.error('[footer] sync SiteSettings.brandName:', e.message) }
    }

    const syncBrandNameAm = req.body.brandNameAm
    if (syncBrandNameAm !== undefined) {
      try { await NavbarSettings.findOneAndUpdate({}, { $set: { brandNameAm: syncBrandNameAm } }, { upsert: true }) } catch (e) { console.error('[footer] sync NavbarSettings.brandNameAm:', e.message) }
      try { await HomeContent.findOneAndUpdate({}, { $set: { 'hero.fullNameAm': syncBrandNameAm } }, { upsert: true }) } catch (e) { console.error('[footer] sync HomeContent.hero.fullNameAm:', e.message) }
      try { await SiteSettings.findOneAndUpdate({}, { $set: { brandNameAm: syncBrandNameAm } }, { upsert: true }) } catch (e) { console.error('[footer] sync SiteSettings.brandNameAm:', e.message) }
    }

    if (content.footerLogo) {
      try { await SiteSettings.findOneAndUpdate({}, { $set: { logoImage: content.footerLogo } }, { upsert: true }) } catch (e) { console.error('[footer] sync SiteSettings.logoImage:', e.message) }
      try { await NavbarSettings.findOneAndUpdate({}, { $set: { logo: content.footerLogo } }, { upsert: true }) } catch (e) { console.error('[footer] sync NavbarSettings.logo:', e.message) }
      try { await HomeContent.findOneAndUpdate({}, { $set: { 'hero.profilePhoto.url': content.footerLogo } }, { upsert: true }) } catch (e) { console.error('[footer] sync HomeContent.profilePhoto:', e.message) }
      try { await User.updateMany({}, { $set: { avatar: content.footerLogo } }) } catch (e) { console.error('[footer] sync User.avatar:', e.message) }
    }

    const contactSync = {}
    if (req.body.emailAddress !== undefined) contactSync.email = req.body.emailAddress
    if (req.body.phoneNumber !== undefined) contactSync.phone = req.body.phoneNumber
    if (req.body.locationHeadline !== undefined || req.body.subLocation !== undefined) {
      const parts = [req.body.locationHeadline || content.locationHeadline, req.body.subLocation || content.subLocation].filter(Boolean)
      contactSync.address = parts.join(', ')
    }
    if (Object.keys(contactSync).length > 0) {
      try { await ContactContent.findOneAndUpdate({}, { $set: contactSync }, { upsert: true }) } catch (e) { console.error('[footer] sync ContactContent:', e.message) }
      try { await SiteSettings.findOneAndUpdate({}, { $set: contactSync }, { upsert: true }) } catch (e) { console.error('[footer] sync SiteSettings contact:', e.message) }
    }

    if (req.body.socialLinks) {
      try { await syncFooterSocial(content.socialLinks) } catch (e) { console.error('[footer] syncFooterSocial:', e.message) }
    }
  } catch (error) {
    console.error('[footer] update error:', error.message, error.errors || '')
    res.status(500).json({ success: false, message: 'Failed to update footer content' })
  }
}

module.exports = { getFooterContent, updateFooterContent }
