const ContactContent = require('../../shared/models/ContactContent')
const FooterContent = require('../../shared/models/FooterContent')
const SiteSettings = require('../../shared/models/SiteSettings')
const { auditLog } = require('../../shared/utilities/auditLogger')
const { syncContactSocial } = require('../../shared/utilities/socialSync')

async function getContactContent(_req, res) {
  try {
    let content = await ContactContent.findOne().lean()
    if (!content) {
      content = await ContactContent.create({})
    }
    res.json({ success: true, content })
  } catch (error) {
    console.error('[contact] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch contact content' })
  }
}

async function updateContactContent(req, res) {
  try {
    let content = await ContactContent.findOne()
    if (!content) {
      content = new ContactContent()
    }

    const fields = ['email', 'phone', 'address', 'mapLink']
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field]
      }
    })

    if (req.body.contactFormEnabled !== undefined) {
      content.contactFormEnabled = req.body.contactFormEnabled === true || req.body.contactFormEnabled === 'true'
    }

    if (req.body.socialChannels) {
      let channels = req.body.socialChannels
      if (typeof channels === 'string') {
        try { channels = JSON.parse(channels) } catch { /* ignore */ }
      }
      if (Array.isArray(channels)) {
        content.socialChannels = channels
          .filter((ch) => ch.channelName && ch.linkUrl)
          .map((ch) => ({
            channelName: ch.channelName || '',
            linkUrl: ch.linkUrl || '',
            iconVector: ch.iconVector || '',
            displayWeight: parseInt(ch.displayWeight, 10) || 0,
          }))
      } else {
        content.socialChannels = []
      }
    }

    await content.save()

    res.json({ success: true, content })
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'ContactContent', resourceId: content._id, details: { updatedFields: Object.keys(req.body) }, req })

    const footerSync = {}
    const siteSync = {}
    if (req.body.email !== undefined) {
      footerSync.emailAddress = req.body.email
      siteSync.email = req.body.email
    }
    if (req.body.phone !== undefined) {
      footerSync.phoneNumber = req.body.phone
      siteSync.phone = req.body.phone
    }
    if (req.body.address !== undefined) {
      footerSync.locationHeadline = req.body.address
      footerSync.subLocation = ''
    }
    if (req.body.mapLink !== undefined) {
      footerSync.locationMapUrl = req.body.mapLink
    }
    if (Object.keys(footerSync).length > 0) {
      try { await FooterContent.findOneAndUpdate({}, { $set: footerSync }, { upsert: true }) } catch (e) { console.error('[contact] sync FooterContent:', e.message) }
    }
    if (Object.keys(siteSync).length > 0) {
      try { await SiteSettings.findOneAndUpdate({}, { $set: siteSync }, { upsert: true }) } catch (e) { console.error('[contact] sync SiteSettings:', e.message) }
    }

    if (req.body.socialChannels) {
      try { await syncContactSocial(content.socialChannels) } catch (e) { console.error('[contact] syncContactSocial:', e.message) }
    }
  } catch (error) {
    console.error('[contact] update error:', error.message, error.errors || '')
    res.status(500).json({ success: false, message: 'Failed to update contact content' })
  }
}

module.exports = { getContactContent, updateContactContent }
