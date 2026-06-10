const fs = require('fs')
const path = require('path')
const HomeContent = require('../models/HomeContent')

function parseJSON(val, fallback) {
  if (val === undefined || val === null) return fallback
  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch {
      return fallback
    }
  }
  return val
}

const socialKeys = [
  'github', 'linkedin', 'telegram', 'twitter',
  'facebook', 'instagram', 'youtube', 'email',
]

function getFileUrl(file) {
  if (!file) return null
  // Cloudinary uploads store the full URL in file.path
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
    return file.path
  }
  // Local fallback
  return `/uploads/${file.filename}`
}

function deleteUpload(filePath) {
  if (!filePath) return
  if (filePath.startsWith('/uploads/')) {
    const fullPath = path.resolve(__dirname, '..', filePath)
    try { fs.unlinkSync(fullPath) } catch { /* file may not exist */ }
  }
  // Cloudinary cleanup could be added here if public IDs were stored
}

function handleFileField(files, body, fieldName, urlFieldName) {
  if (files[fieldName]) {
    return getFileUrl(files[fieldName][0])
  }
  if (body[urlFieldName] !== undefined) {
    return body[urlFieldName]
  }
  return undefined // no change
}

async function getHomeContent(_req, res) {
  try {
    let content = await HomeContent.findOne()
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

    const files = req.files || {}

    // ─── HERO ────────────────────────────────────────────────────────────────
    if (req.body.heroGreeting !== undefined) content.hero.greeting = req.body.heroGreeting
    if (req.body.heroFullName !== undefined) content.hero.fullName = req.body.heroFullName
    if (req.body.heroNameAmharic !== undefined) content.hero.nameAmharic = req.body.heroNameAmharic
    if (req.body.heroBadge !== undefined) content.hero.professionalBadge = req.body.heroBadge
    if (req.body.heroIntroduction !== undefined) content.hero.shortIntroduction = req.body.heroIntroduction
    if (req.body.heroPhotoAlt !== undefined) content.hero.profilePhoto.alt = req.body.heroPhotoAlt

    if (req.body.heroTypingWords !== undefined) {
      content.hero.typingWords = parseJSON(req.body.heroTypingWords, content.hero.typingWords)
    }
    if (req.body.heroStatistics !== undefined) {
      content.hero.statistics = parseJSON(req.body.heroStatistics, content.hero.statistics)
    }
    if (req.body.heroCtaButtons !== undefined) {
      content.hero.ctaButtons = parseJSON(req.body.heroCtaButtons, content.hero.ctaButtons)
    }

    const heroPhoto = handleFileField(files, req.body, 'heroProfilePhoto', 'heroPhotoUrl')
    if (heroPhoto !== undefined) {
      deleteUpload(content.hero.profilePhoto.url)
      content.hero.profilePhoto.url = heroPhoto
    }

    // ─── LOGO ─────────────────────────────────────────────────────────────────
    const logo = handleFileField(files, req.body, 'logoImage', 'logoUrl')
    if (logo !== undefined) {
      deleteUpload(content.logoImage)
      content.logoImage = logo
    }

    // ─── ABOUT ───────────────────────────────────────────────────────────────
    if (req.body.aboutTitle !== undefined) content.about.title = req.body.aboutTitle
    if (req.body.aboutSubtitle !== undefined) content.about.subtitle = req.body.aboutSubtitle
    if (req.body.aboutLocation !== undefined) content.about.location = req.body.aboutLocation
    if (req.body.aboutStatClients !== undefined) content.about.statClients = req.body.aboutStatClients
    if (req.body.aboutStatNetwork !== undefined) content.about.statNetwork = req.body.aboutStatNetwork

    if (req.body.aboutYearsExp !== undefined) {
      content.about.yearsOfExperience = Number(req.body.aboutYearsExp)
    }
    if (req.body.aboutSections !== undefined) {
      content.about.sections = parseJSON(req.body.aboutSections, content.about.sections)
    }
    if (req.body.aboutAchievements !== undefined) {
      content.about.achievements = parseJSON(req.body.aboutAchievements, content.about.achievements)
    }

    // ─── CTA ─────────────────────────────────────────────────────────────────
    if (req.body.ctaTitle !== undefined) content.cta.title = req.body.ctaTitle
    if (req.body.ctaSubtitle !== undefined) content.cta.subtitle = req.body.ctaSubtitle
    if (req.body.ctaButtonText !== undefined) content.cta.buttonText = req.body.ctaButtonText
    if (req.body.ctaButtonLink !== undefined) content.cta.buttonLink = req.body.ctaButtonLink

    const ctaBg = handleFileField(files, req.body, 'ctaBackgroundImage', 'ctaBackgroundUrl')
    if (ctaBg !== undefined) {
      deleteUpload(content.cta.backgroundImage)
      content.cta.backgroundImage = ctaBg
    }

    // ─── SOCIAL LINKS ────────────────────────────────────────────────────────
    if (req.body.socialLinks) {
      const links = parseJSON(req.body.socialLinks, {})
      socialKeys.forEach((key) => {
        if (links[key] !== undefined) {
          content.socialLinks[key] = links[key]
        }
      })
    }

    // ─── RESUME ──────────────────────────────────────────────────────────────
    if (req.body.resumeUrl !== undefined) content.resume.url = req.body.resumeUrl
    if (req.body.resumeFileName !== undefined) content.resume.fileName = req.body.resumeFileName

    // ─── THEME ───────────────────────────────────────────────────────────────
    if (req.body.themePrimaryColor !== undefined) content.theme.primaryColor = req.body.themePrimaryColor
    if (req.body.themeSecondaryColor !== undefined) content.theme.secondaryColor = req.body.themeSecondaryColor
    if (req.body.themeAccentColor !== undefined) content.theme.accentColor = req.body.themeAccentColor

    // ─── SEO ─────────────────────────────────────────────────────────────────
    if (req.body.seoTitle !== undefined) content.seo.metaTitle = req.body.seoTitle
    if (req.body.seoDescription !== undefined) content.seo.metaDescription = req.body.seoDescription
    if (req.body.seoKeywords !== undefined) {
      content.seo.metaKeywords = parseJSON(req.body.seoKeywords, content.seo.metaKeywords)
    }

    const seoOg = handleFileField(files, req.body, 'seoOgImage', 'seoOgUrl')
    if (seoOg !== undefined) {
      deleteUpload(content.seo.ogImage)
      content.seo.ogImage = seoOg
    }

    // ─── PUBLISHED ───────────────────────────────────────────────────────────
    if (req.body.published !== undefined) {
      content.published = req.body.published === 'true' || req.body.published === true
    }

    await content.save()

    res.json({ success: true, content })
  } catch (error) {
    console.error('[homeContent] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update home content' })
  }
}

module.exports = { getHomeContent, updateHomeContent }
