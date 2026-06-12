const fs = require('fs')
const path = require('path')
const Settings = require('../../shared/models/Settings')

async function getSettings(_req, res) {
  try {
    let settings = await Settings.findOne().lean()
    if (!settings) {
      settings = await Settings.create({})
    }
    res.json({ success: true, settings })
  } catch (error) {
    console.error('[settings] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch settings' })
  }
}

async function getGlobalAppearance(_req, res) {
  try {
    let settings = await Settings.findOne().lean()
    if (!settings) {
      settings = await Settings.create({})
    }
    res.json({
      success: true,
      appearance: settings.globalAppearance || { mode: 'dark' },
    })
  } catch (error) {
    console.error('[settings] getGlobalAppearance error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch global appearance' })
  }
}

async function updateGlobalAppearance(req, res) {
  try {
    let settings = await Settings.findOne()
    if (!settings) settings = new Settings()

    const { mode } = req.body
    if (mode && ['light', 'dark', 'system'].includes(mode)) {
      if (!settings.globalAppearance) settings.globalAppearance = {}
      settings.globalAppearance.mode = mode
      settings.globalAppearance.syncedAt = new Date()
    }

    await settings.save()
    res.json({ success: true, appearance: settings.globalAppearance })
  } catch (error) {
    console.error('[settings] updateGlobalAppearance error:', error)
    res.status(500).json({ success: false, message: 'Failed to update global appearance' })
  }
}

async function updateSettings(req, res) {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }

    const textFields = [
      'ownerName', 'title', 'description',
      'defaultTheme', 'projectsPerPage', 'certificatesPerPage',
      'enableAnalytics', 'enableContactForm',
      'publicEmail', 'publicPhone', 'publicAddress',
    ]

    textFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'projectsPerPage' || field === 'certificatesPerPage') {
          settings[field] = parseInt(req.body[field], 10) || 6
        } else if (field === 'enableAnalytics' || field === 'enableContactForm') {
          settings[field] = req.body[field] === 'true' || req.body[field] === true
        } else {
          settings[field] = req.body[field]
        }
      }
    })

    if (req.body.branding) {
      let branding = req.body.branding
      if (typeof branding === 'string') {
        try { branding = JSON.parse(branding) } catch { /* ignore */ }
      }
      if (typeof branding === 'object' && branding !== null) {
        settings.branding = {
          ...(settings.branding?.toObject?.() || settings.branding || {}),
          ...branding,
        }
      }
    }

    if (req.body.globalAppearance) {
      let ga = req.body.globalAppearance
      if (typeof ga === 'string') {
        try { ga = JSON.parse(ga) } catch { /* ignore */ }
      }
      if (typeof ga === 'object' && ga !== null) {
        if (!settings.globalAppearance) settings.globalAppearance = {}
        if (ga.mode) settings.globalAppearance.mode = ga.mode
        settings.globalAppearance.syncedAt = new Date()
      }
    }

    if (req.body.socialLinks) {
      let socialLinks = req.body.socialLinks
      if (typeof socialLinks === 'string') {
        try { socialLinks = JSON.parse(socialLinks) } catch { /* ignore */ }
      }
      if (!settings.socialLinks) settings.socialLinks = {}
      ;['github', 'linkedin', 'telegram', 'twitter', 'facebook', 'instagram'].forEach((key) => {
        if (socialLinks[key] !== undefined) {
          settings.socialLinks[key] = socialLinks[key]
        }
      })
    }

    const imageFields = ['logo', 'favicon']
    imageFields.forEach((field) => {
      if (req.files?.[field]?.[0]) {
        const oldPath = settings[field] && settings[field].startsWith('/uploads/')
          ? path.resolve(__dirname, '..', '..', '..', settings[field])
          : null
        if (oldPath) { try { fs.unlinkSync(oldPath) } catch { /* may not exist */ } }
        settings[field] = `/uploads/${req.files[field][0].filename}`
      } else if (req.body[`${field}Url`]) {
        settings[field] = req.body[`${field}Url`]
      }
    })

    await settings.save()
    res.json({ success: true, settings })
  } catch (error) {
    console.error('[settings] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update settings' })
  }
}

module.exports = { getSettings, updateSettings, getGlobalAppearance, updateGlobalAppearance }
