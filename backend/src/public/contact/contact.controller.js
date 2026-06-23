const ContactContent = require('../../shared/models/ContactContent')
const { auditLog } = require('../../shared/utilities/auditLogger')

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
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'ContactContent', resourceId: content._id, details: { updatedFields: Object.keys(req.body) }, req })
    res.json({ success: true, content })
  } catch (error) {
    console.error('[contact] update error:', error.message, error.errors || '')
    res.status(500).json({ success: false, message: 'Failed to update contact content' })
  }
}

module.exports = { getContactContent, updateContactContent }
