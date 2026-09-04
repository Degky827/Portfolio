const HomeContent = require('../../shared/models/HomeContent')
const User = require('../../shared/models/User')
const FooterContent = require('../../shared/models/FooterContent')
const NavbarSettings = require('../../shared/models/NavbarSettings')
const SiteSettings = require('../../shared/models/SiteSettings')
const { auditLog } = require('../../shared/utilities/auditLogger')
const { syncHomeSocial } = require('../../shared/utilities/socialSync')

const socialKeys = [
  'github', 'linkedin', 'telegram', 'twitter',
  'facebook', 'instagram', 'youtube', 'email', 'cv',
]

async function getHomeContent(_req, res) {
  try {
    let content = await HomeContent.findOne()
    if (!content) {
      content = await HomeContent.create({})
    }
    const publicData = content.publishedContent || content.toObject()
    res.json({ success: true, content: publicData })
  } catch (error) {
    console.error('[homepage] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch home content' })
  }
}

async function getHomeContentDraft(_req, res) {
  try {
    let content = await HomeContent.findOne()
    if (!content) {
      content = await HomeContent.create({})
    }
    res.json({ success: true, content })
  } catch (error) {
    console.error('[homepage] get draft error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch draft content' })
  }
}

async function publishHomeContent(req, res) {
  try {
    let content = await HomeContent.findOne()
    if (!content) {
      return res.status(404).json({ success: false, message: 'No content found' })
    }
    const draft = content.toObject()
    delete draft._id
    delete draft.__v
    delete draft.createdAt
    delete draft.updatedAt
    content.publishedContent = draft
    content.published = true
    content.lastPublishedAt = new Date()
    await content.save()
    res.json({ success: true, content, message: 'Content published successfully' })
    await auditLog({ userId: req.user?._id, action: 'PUBLISH', resource: 'HomeContent', resourceId: content._id, details: { publishedAt: content.lastPublishedAt }, req })
  } catch (error) {
    console.error('[homepage] publish error:', error)
    res.status(500).json({ success: false, message: 'Failed to publish content' })
  }
}

function sanitizeSceneObject(obj) {
  return {
    name: obj.name || '',
    visible: obj.visible !== false,
    position: {
      x: Number(obj.position?.x) || 0,
      y: Number(obj.position?.y) || 0,
      z: Number(obj.position?.z) || 0,
    },
    rotation: {
      x: Number(obj.rotation?.x) || 0,
      y: Number(obj.rotation?.y) || 0,
      z: Number(obj.rotation?.z) || 0,
    },
    scale: Number(obj.scale) || 1,
    animate: obj.animate !== false,
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
      if (h.eyebrow !== undefined) content.hero.eyebrow = h.eyebrow
      if (h.greeting !== undefined) content.hero.greeting = h.greeting
      if (h.greetingAm !== undefined) content.hero.greetingAm = h.greetingAm
      if (h.fullName !== undefined) content.hero.fullName = h.fullName
      if (h.fullNameAm !== undefined) content.hero.fullNameAm = h.fullNameAm
      if (h.nameAmharic !== undefined) content.hero.nameAmharic = h.nameAmharic
      if (h.professionalBadge !== undefined) content.hero.professionalBadge = h.professionalBadge
      if (h.professionalBadgeAm !== undefined) content.hero.professionalBadgeAm = h.professionalBadgeAm
      if (h.description !== undefined) content.hero.description = h.description
      if (h.shortIntroduction !== undefined) content.hero.shortIntroduction = h.shortIntroduction
      if (h.shortIntroductionAm !== undefined) content.hero.shortIntroductionAm = h.shortIntroductionAm
      if (h.typingWords !== undefined) {
        content.hero.typingWords = Array.isArray(h.typingWords)
          ? h.typingWords.filter(Boolean).map(String)
          : content.hero.typingWords
      }
      if (h.typingWordsAm !== undefined) {
        content.hero.typingWordsAm = Array.isArray(h.typingWordsAm)
          ? h.typingWordsAm.filter(Boolean).map(String)
          : content.hero.typingWordsAm
      }
      if (h.primaryCtaText !== undefined) content.hero.primaryCtaText = h.primaryCtaText
      if (h.primaryCtaUrl !== undefined) content.hero.primaryCtaUrl = h.primaryCtaUrl
      if (h.secondaryCtaText !== undefined) content.hero.secondaryCtaText = h.secondaryCtaText
      if (h.secondaryCtaUrl !== undefined) content.hero.secondaryCtaUrl = h.secondaryCtaUrl
      if (h.showEyebrow !== undefined) content.hero.showEyebrow = Boolean(h.showEyebrow)
      if (h.showGreeting !== undefined) content.hero.showGreeting = Boolean(h.showGreeting)
      if (h.showName !== undefined) content.hero.showName = Boolean(h.showName)
      if (h.showTitle !== undefined) content.hero.showTitle = Boolean(h.showTitle)
      if (h.showDescription !== undefined) content.hero.showDescription = Boolean(h.showDescription)
      if (h.showPrimaryCta !== undefined) content.hero.showPrimaryCta = Boolean(h.showPrimaryCta)
      if (h.showSecondaryCta !== undefined) content.hero.showSecondaryCta = Boolean(h.showSecondaryCta)
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

    if (body.technologies !== undefined && Array.isArray(body.technologies)) {
      content.technologies = body.technologies.map((t, i) => ({
        name: t.name || '',
        icon: t.icon || '',
        color: t.color || '',
        url: t.url || '',
        order: typeof t.order === 'number' ? t.order : i,
        active: t.active !== false,
      }))
    }
    if (body.technologiesEnabled !== undefined) content.technologiesEnabled = Boolean(body.technologiesEnabled)

    if (body.statistics !== undefined && Array.isArray(body.statistics)) {
      content.statistics = body.statistics.map((s, i) => ({
        value: s.value || '',
        label: s.label || '',
        icon: s.icon || 'Award',
        color: s.color || '#6366f1',
        order: typeof s.order === 'number' ? s.order : i,
        active: s.active !== false,
        context: s.context || '',
      }))
    }
    if (body.statisticsEnabled !== undefined) content.statisticsEnabled = Boolean(body.statisticsEnabled)
    if (body.socialLinksEnabled !== undefined) content.socialLinksEnabled = Boolean(body.socialLinksEnabled)

    if (body.availability) {
      const a = body.availability
      if (a.enabled !== undefined) content.availability.enabled = Boolean(a.enabled)
      if (a.status !== undefined) content.availability.status = a.status
      if (a.title !== undefined) content.availability.title = a.title
      if (a.description !== undefined) content.availability.description = a.description
      if (a.ctaText !== undefined) content.availability.ctaText = a.ctaText
      if (a.ctaUrl !== undefined) content.availability.ctaUrl = a.ctaUrl
    }

    if (body.socialLinks) {
      socialKeys.forEach((key) => {
        if (body.socialLinks[key] !== undefined) {
          content.socialLinks[key] = body.socialLinks[key]
        }
      })
    }

    if (body.socialLinksOrder !== undefined && Array.isArray(body.socialLinksOrder)) {
      content.socialLinksOrder = body.socialLinksOrder.map((s, i) => ({
        platform: s.platform || '',
        url: s.url || '',
        icon: s.icon || '',
        tooltip: s.tooltip || '',
        order: typeof s.order === 'number' ? s.order : i,
        visible: s.visible !== false,
        active: s.active !== false,
      }))
    }

    if (body.logoImage !== undefined) content.logoImage = body.logoImage
    if (body.logoText !== undefined) content.logoText = body.logoText
    if (body.contactButtonText !== undefined) content.contactButtonText = body.contactButtonText
    if (body.contactButtonTextAm !== undefined) content.contactButtonTextAm = body.contactButtonTextAm
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

    if (body.theme) {
      if (body.theme.primaryColor !== undefined) content.theme.primaryColor = body.theme.primaryColor
      if (body.theme.secondaryColor !== undefined) content.theme.secondaryColor = body.theme.secondaryColor
      if (body.theme.accentColor !== undefined) content.theme.accentColor = body.theme.accentColor
    }

    if (body.appearance) {
      const ap = body.appearance
      if (ap.textColor !== undefined) content.appearance.textColor = ap.textColor
      if (ap.backgroundColor !== undefined) content.appearance.backgroundColor = ap.backgroundColor
      if (ap.surfaceColor !== undefined) content.appearance.surfaceColor = ap.surfaceColor
      if (ap.mutedTextColor !== undefined) content.appearance.mutedTextColor = ap.mutedTextColor
      if (ap.backgroundType !== undefined) content.appearance.backgroundType = ap.backgroundType
      if (ap.backgroundImage !== undefined) content.appearance.backgroundImage = ap.backgroundImage
      if (ap.backgroundOverlay !== undefined) content.appearance.backgroundOverlay = ap.backgroundOverlay
      if (ap.backgroundOpacity !== undefined) content.appearance.backgroundOpacity = Number(ap.backgroundOpacity) || 0.5
      if (ap.backgroundPosition !== undefined) content.appearance.backgroundPosition = ap.backgroundPosition
      if (ap.animations !== undefined) content.appearance.animations = Boolean(ap.animations)
      if (ap.glassmorphism !== undefined) content.appearance.glassmorphism = Boolean(ap.glassmorphism)
      if (ap.particles !== undefined) content.appearance.particles = Boolean(ap.particles)
      if (ap.cursorEffect !== undefined) content.appearance.cursorEffect = Boolean(ap.cursorEffect)
      if (ap.glowEffects !== undefined) content.appearance.glowEffects = Boolean(ap.glowEffects)
      if (ap.scrollIndicator !== undefined) content.appearance.scrollIndicator = Boolean(ap.scrollIndicator)
      if (ap.socialFloating !== undefined) content.appearance.socialFloating = Boolean(ap.socialFloating)
    }

    if (body.scene3D) {
      const s3 = body.scene3D
      if (s3.enabled !== undefined) content.scene3D.enabled = Boolean(s3.enabled)
      if (s3.interaction !== undefined) content.scene3D.interaction = Boolean(s3.interaction)
      if (s3.autoRotate !== undefined) content.scene3D.autoRotate = Boolean(s3.autoRotate)
      if (s3.objectRotation !== undefined) content.scene3D.objectRotation = Boolean(s3.objectRotation)
      if (s3.particles !== undefined) content.scene3D.particles = Boolean(s3.particles)
      if (s3.shadows !== undefined) content.scene3D.shadows = Boolean(s3.shadows)
      if (s3.postProcessing !== undefined) content.scene3D.postProcessing = Boolean(s3.postProcessing)
      if (s3.cursorInteraction !== undefined) content.scene3D.cursorInteraction = Boolean(s3.cursorInteraction)

      if (s3.performance) {
        const p = s3.performance
        if (p.desktop !== undefined) content.scene3D.performance.desktop = Boolean(p.desktop)
        if (p.tablet !== undefined) content.scene3D.performance.tablet = Boolean(p.tablet)
        if (p.mobile !== undefined) content.scene3D.performance.mobile = Boolean(p.mobile)
        if (p.lightweightMobile !== undefined) content.scene3D.performance.lightweightMobile = Boolean(p.lightweightMobile)
        if (p.maxDpr !== undefined) content.scene3D.performance.maxDpr = Number(p.maxDpr) || 2
        if (p.shadowQuality !== undefined) content.scene3D.performance.shadowQuality = p.shadowQuality
        if (p.particleCount !== undefined) content.scene3D.performance.particleCount = Number(p.particleCount) || 50
      }

      if (s3.camera) {
        const cam = s3.camera
        if (cam.positionX !== undefined) content.scene3D.camera.positionX = Number(cam.positionX)
        if (cam.positionY !== undefined) content.scene3D.camera.positionY = Number(cam.positionY)
        if (cam.positionZ !== undefined) content.scene3D.camera.positionZ = Number(cam.positionZ)
        if (cam.rotationX !== undefined) content.scene3D.camera.rotationX = Number(cam.rotationX)
        if (cam.rotationY !== undefined) content.scene3D.camera.rotationY = Number(cam.rotationY)
        if (cam.rotationZ !== undefined) content.scene3D.camera.rotationZ = Number(cam.rotationZ)
        if (cam.fov !== undefined) content.scene3D.camera.fov = Number(cam.fov) || 36
        if (cam.zoom !== undefined) content.scene3D.camera.zoom = Number(cam.zoom) || 1
      }

      if (s3.objects !== undefined && Array.isArray(s3.objects)) {
        content.scene3D.objects = s3.objects.map(sanitizeSceneObject)
      }
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

    res.json({ success: true, content })
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'HomeContent', resourceId: content._id, details: { updatedFields: Object.keys(body) }, req })

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

    if (body.socialLinks) {
      try { await syncHomeSocial(content.socialLinks) } catch (e) { console.error('[homepage] syncHomeSocial:', e.message) }
    }
  } catch (error) {
    console.error('[homepage] update error:', error.message, error.errors || '')
    res.status(500).json({ success: false, message: 'Failed to update home content' })
  }
}

module.exports = { getHomeContent, getHomeContentDraft, publishHomeContent, updateHomeContent }
