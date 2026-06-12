const HomeContent = require('../../shared/models/HomeContent')

const socialKeys = [
  'github', 'linkedin', 'telegram', 'twitter',
  'facebook', 'instagram', 'youtube', 'email',
]

async function getHomeContent(_req, res) {
  try {
    let content = await HomeContent.findOne()
    if (!content) {
      content = await HomeContent.create({})
    }
    res.json({ success: true, content })
  } catch (error) {
    console.error('[homepage] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch home content' })
  }
}

async function updateHomeContent(req, res) {
  try {
    let content = await HomeContent.findOne()
    if (!content) {
      content = new HomeContent()
    }

    const body = req.body

    if (body.hero) {
      const h = body.hero
      if (h.greeting !== undefined) content.hero.greeting = h.greeting
      if (h.fullName !== undefined) content.hero.fullName = h.fullName
      if (h.nameAmharic !== undefined) content.hero.nameAmharic = h.nameAmharic
      if (h.professionalBadge !== undefined) content.hero.professionalBadge = h.professionalBadge
      if (h.shortIntroduction !== undefined) content.hero.shortIntroduction = h.shortIntroduction
      if (h.typingWords !== undefined) content.hero.typingWords = h.typingWords
      if (h.statistics !== undefined) content.hero.statistics = h.statistics
      if (h.ctaButtons !== undefined) content.hero.ctaButtons = h.ctaButtons
      if (h.profilePhoto) {
        content.hero.profilePhoto = {
          url: h.profilePhoto.url !== undefined ? h.profilePhoto.url : (content.hero.profilePhoto?.url ?? ''),
          alt: h.profilePhoto.alt !== undefined ? h.profilePhoto.alt : (content.hero.profilePhoto?.alt ?? ''),
        }
      }
    }

    if (body.logoImage !== undefined) content.logoImage = body.logoImage
    if (body.logoText !== undefined) content.logoText = body.logoText
    if (body.resumeButtonText !== undefined) content.resumeButtonText = body.resumeButtonText
    if (body.contactButtonText !== undefined) content.contactButtonText = body.contactButtonText
    if (body.contactButtonLink !== undefined) content.contactButtonLink = body.contactButtonLink

    if (body.about) {
      const a = body.about
      if (a.title !== undefined) content.about.title = a.title
      if (a.subtitle !== undefined) content.about.subtitle = a.subtitle
      if (a.location !== undefined) content.about.location = a.location
      if (a.yearsOfExperience !== undefined) content.about.yearsOfExperience = Number(a.yearsOfExperience)
      if (a.statClients !== undefined) content.about.statClients = a.statClients
      if (a.statNetwork !== undefined) content.about.statNetwork = a.statNetwork
      if (a.sections !== undefined) content.about.sections = a.sections
      if (a.achievements !== undefined) content.about.achievements = a.achievements
    }

    if (body.cta) {
      const c = body.cta
      if (c.title !== undefined) content.cta.title = c.title
      if (c.subtitle !== undefined) content.cta.subtitle = c.subtitle
      if (c.buttonText !== undefined) content.cta.buttonText = c.buttonText
      if (c.buttonLink !== undefined) content.cta.buttonLink = c.buttonLink
      if (c.backgroundImage !== undefined) content.cta.backgroundImage = c.backgroundImage
    }

    if (body.socialLinks) {
      socialKeys.forEach((key) => {
        if (body.socialLinks[key] !== undefined) {
          content.socialLinks[key] = body.socialLinks[key]
        }
      })
    }

    if (body.resume) {
      if (body.resume.url !== undefined) content.resume.url = body.resume.url
      if (body.resume.fileName !== undefined) content.resume.fileName = body.resume.fileName
    }

    if (body.theme) {
      if (body.theme.primaryColor !== undefined) content.theme.primaryColor = body.theme.primaryColor
      if (body.theme.secondaryColor !== undefined) content.theme.secondaryColor = body.theme.secondaryColor
      if (body.theme.accentColor !== undefined) content.theme.accentColor = body.theme.accentColor
    }

    if (body.seo) {
      if (body.seo.metaTitle !== undefined) content.seo.metaTitle = body.seo.metaTitle
      if (body.seo.metaDescription !== undefined) content.seo.metaDescription = body.seo.metaDescription
      if (body.seo.metaKeywords !== undefined) content.seo.metaKeywords = body.seo.metaKeywords
      if (body.seo.ogImage !== undefined) content.seo.ogImage = body.seo.ogImage
    }

    if (body.published !== undefined) {
      content.published = body.published === true || body.published === 'true'
    }

    await content.save()

    res.json({ success: true, content })
  } catch (error) {
    console.error('[homepage] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update home content' })
  }
}

module.exports = { getHomeContent, updateHomeContent }
