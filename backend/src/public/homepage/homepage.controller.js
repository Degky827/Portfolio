const HomeContent = require('../../shared/models/HomeContent')
const User = require('../../shared/models/User')
const FooterContent = require('../../shared/models/FooterContent')
const NavbarSettings = require('../../shared/models/NavbarSettings')
const SiteSettings = require('../../shared/models/SiteSettings')

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
      if (h.typingWords !== undefined) {
        content.hero.typingWords = Array.isArray(h.typingWords)
          ? h.typingWords.filter(Boolean).map(String)
          : content.hero.typingWords
      }
      if (h.statistics !== undefined && Array.isArray(h.statistics)) {
        content.hero.statistics = h.statistics.map((s) => ({
          label: s.label || '',
          value: s.value || '',
          icon: s.icon || 'Award',
          color: s.color || '#6366f1',
        }))
      }
      if (h.ctaButtons !== undefined && Array.isArray(h.ctaButtons)) {
        content.hero.ctaButtons = h.ctaButtons.map((b) => ({
          text: b.text || '',
          link: b.link || '',
          openNewTab: Boolean(b.openNewTab),
          icon: b.icon || 'ArrowRight',
        }))
      }
      if (h.profilePhoto) {
        content.hero.profilePhoto = {
          url: h.profilePhoto.url !== undefined ? h.profilePhoto.url : (content.hero.profilePhoto?.url ?? ''),
          alt: h.profilePhoto.alt !== undefined ? h.profilePhoto.alt : (content.hero.profilePhoto?.alt ?? ''),
        }
      }
    }

    if (body.logoImage !== undefined) content.logoImage = body.logoImage
    if (body.logoText !== undefined) content.logoText = body.logoText
    if (body.contactButtonText !== undefined) content.contactButtonText = body.contactButtonText
    if (body.contactButtonLink !== undefined) content.contactButtonLink = body.contactButtonLink

    if (body.about) {
      const a = body.about
      if (a.title !== undefined) content.about.title = a.title
      if (a.subtitle !== undefined) content.about.subtitle = a.subtitle
      if (a.location !== undefined) content.about.location = a.location
      if (a.yearsOfExperience !== undefined) content.about.yearsOfExperience = Number(a.yearsOfExperience) || 0
      if (a.statClients !== undefined) content.about.statClients = a.statClients
      if (a.statNetwork !== undefined) content.about.statNetwork = a.statNetwork
      if (a.sections !== undefined && Array.isArray(a.sections)) {
        content.about.sections = a.sections.map((s) => ({
          title: s.title || '',
          content: s.content || '',
        }))
      }
      if (a.achievements !== undefined && Array.isArray(a.achievements)) {
        content.about.achievements = a.achievements.map((ach) => ({
          title: ach.title || '',
        }))
      }
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

    if (body.theme) {
      if (body.theme.primaryColor !== undefined) content.theme.primaryColor = body.theme.primaryColor
      if (body.theme.secondaryColor !== undefined) content.theme.secondaryColor = body.theme.secondaryColor
      if (body.theme.accentColor !== undefined) content.theme.accentColor = body.theme.accentColor
    }

    if (body.seo) {
      if (body.seo.metaTitle !== undefined) content.seo.metaTitle = body.seo.metaTitle
      if (body.seo.metaDescription !== undefined) content.seo.metaDescription = body.seo.metaDescription
      if (body.seo.metaKeywords !== undefined && Array.isArray(body.seo.metaKeywords)) {
        content.seo.metaKeywords = body.seo.metaKeywords.filter(Boolean).map(String)
      }
    }

    if (body.published !== undefined) {
      content.published = body.published === true || body.published === 'true'
    }

    await content.save()

    const updatedName = body.hero?.fullName
    if (updatedName !== undefined) {
      try {
        await User.findByIdAndUpdate(req.user._id, { displayName: updatedName })
      } catch (syncErr) {
        console.error('[homepage] Failed to sync User.displayName:', syncErr)
      }
      try {
        await FooterContent.findOneAndUpdate(
          {},
          { $set: { brandName: updatedName } },
          { upsert: true },
        )
      } catch (syncErr) {
        console.error('[homepage] Failed to sync FooterContent.brandName:', syncErr)
      }
      try {
        await NavbarSettings.findOneAndUpdate(
          {},
          { $set: { brandName: updatedName } },
          { upsert: true },
        )
      } catch (syncErr) {
        console.error('[homepage] Failed to sync NavbarSettings.brandName:', syncErr)
      }
    }

    if (body.hero?.profilePhoto?.url !== undefined) {
      const photoUrl = body.hero.profilePhoto.url
      const logoSync = { logoImage: photoUrl, logo: photoUrl, footerLogo: photoUrl, avatar: photoUrl }
      try { await SiteSettings.findOneAndUpdate({}, { $set: { logoImage: photoUrl } }, { upsert: true }) } catch (e) { console.error('[homepage] sync SiteSettings.logoImage:', e.message) }
      try { await NavbarSettings.findOneAndUpdate({}, { $set: { logo: photoUrl } }, { upsert: true }) } catch (e) { console.error('[homepage] sync NavbarSettings.logo:', e.message) }
      try { await FooterContent.findOneAndUpdate({}, { $set: { footerLogo: photoUrl } }, { upsert: true }) } catch (e) { console.error('[homepage] sync FooterContent.footerLogo:', e.message) }
      try { await User.updateMany({}, { $set: { avatar: photoUrl } }) } catch (e) { console.error('[homepage] sync User.avatar:', e.message) }
    }

    if (body.logoImage !== undefined || body.logoText !== undefined) {
      const siteUpdate = {}
      if (body.logoImage !== undefined) siteUpdate.logoImage = body.logoImage
      if (body.logoText !== undefined) siteUpdate.logoText = body.logoText
      try { await SiteSettings.findOneAndUpdate({}, { $set: siteUpdate }, { upsert: true }) } catch (e) { console.error('[homepage] sync SiteSettings logo:', e.message) }
    }

    res.json({ success: true, content })
  } catch (error) {
    console.error('[homepage] update error:', error.message, error.errors || '')
    res.status(500).json({ success: false, message: 'Failed to update home content' })
  }
}

module.exports = { getHomeContent, updateHomeContent }
