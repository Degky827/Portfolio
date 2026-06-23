const SiteSettings = require('../../shared/models/SiteSettings')
const { auditLog } = require('../../shared/utilities/auditLogger')

async function getSiteSettings(_req, res) {
  try {
    let settings = await SiteSettings.findOne()
    if (!settings) {
      settings = await SiteSettings.create({})
    }
    res.json({ success: true, settings })
  } catch (error) {
    console.error('[site-settings] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch site settings' })
  }
}

const textFields = [
  'brandName', 'brandNameAm', 'nameAmharic', 'professionalBadge', 'professionalBadgeAm', 'logoText', 'logoImage', 'logoSubtitle',
  'greeting', 'greetingAm', 'shortIntroduction', 'shortIntroductionAm', 'email', 'phone',
  'contactButtonText', 'contactButtonLink',
  'brandDescription', 'brandDescriptionAm', 'copyrightText', 'defaultLanguage',
]

const booleanFields = ['logoEnabled', 'languageEnabled']

const resumeKeys = ['url', 'fileName', 'buttonText']
const socialKeys = ['github', 'linkedin', 'twitter', 'telegram', 'facebook', 'instagram', 'youtube']
const themeKeys = ['primaryColor', 'secondaryColor']

async function updateSiteSettings(req, res) {
  try {
    let settings = await SiteSettings.findOne()
    if (!settings) {
      settings = new SiteSettings()
    }

    const body = req.body

    textFields.forEach((field) => {
      if (body[field] !== undefined) settings[field] = body[field]
    })

    booleanFields.forEach((field) => {
      if (body[field] !== undefined) settings[field] = body[field]
    })

    if (body.typingWords !== undefined) settings.typingWords = body.typingWords
    if (body.resume) {
      resumeKeys.forEach((key) => {
        if (body.resume[key] !== undefined) settings.resume[key] = body.resume[key]
      })
    }
    if (body.socialLinks) {
      socialKeys.forEach((key) => {
        if (body.socialLinks[key] !== undefined) settings.socialLinks[key] = body.socialLinks[key]
      })
    }
    if (body.theme) {
      themeKeys.forEach((key) => {
        if (body.theme[key] !== undefined) settings.theme[key] = body.theme[key]
      })
    }

    await settings.save()

    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'SiteSettings', resourceId: settings._id, details: { updatedFields: Object.keys(body) }, req })

    res.json({ success: true, settings })
  } catch (error) {
    console.error('[site-settings] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update site settings' })
  }
}

module.exports = { getSiteSettings, updateSiteSettings }
