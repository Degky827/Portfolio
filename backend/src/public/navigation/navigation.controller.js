const Navigation = require('../../shared/models/Navigation')
const NavbarSettings = require('../../shared/models/NavbarSettings')
const SiteSettings = require('../../shared/models/SiteSettings')
const FooterContent = require('../../shared/models/FooterContent')
const HomeContent = require('../../shared/models/HomeContent')
const User = require('../../shared/models/User')
const { auditLog } = require('../../shared/utilities/auditLogger')

// ─── Navigation (Menu Items) ────────────────────────────────────────

async function getNavigation(_req, res) {
  try {
    const items = await Navigation.find().sort({ order: 1 })
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.json({ success: true, items })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch navigation' })
  }
}

async function createNavigation(req, res) {
  try {
    const count = await Navigation.countDocuments()
    const item = await Navigation.create({ ...req.body, order: count })
    await auditLog({ userId: req.user?._id, action: 'CREATE', resource: 'Navigation', resourceId: item._id, details: { label: item.title }, req })

    await syncNavigationToFooter()

    res.json({ success: true, item })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create navigation item' })
  }
}

async function updateNavigation(req, res) {
  try {
    const item = await Navigation.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!item) return res.status(404).json({ success: false, message: 'Navigation item not found' })
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'Navigation', resourceId: item._id, details: { label: item.title }, req })

    await syncNavigationToFooter()

    res.json({ success: true, item })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update navigation item' })
  }
}

async function deleteNavigation(req, res) {
  try {
    const item = await Navigation.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ success: false, message: 'Navigation item not found' })
    await auditLog({ userId: req.user?._id, action: 'DELETE', resource: 'Navigation', resourceId: item._id, details: { label: item.title }, req })

    await syncNavigationToFooter()

    res.json({ success: true, message: 'Navigation item deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete navigation item' })
  }
}

async function reorderNavigation(req, res) {
  try {
    const { items } = req.body
    for (const { _id, order } of items) {
      await Navigation.findByIdAndUpdate(_id, { order })
    }

    await syncNavigationToFooter()

    res.json({ success: true, message: 'Navigation reordered' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reorder navigation' })
  }
}

async function syncNavigationToFooter() {
  try {
    const navItems = await Navigation.find({ visible: true, active: true }).sort({ order: 1 })
    const footerNav = navItems.map((item, index) => ({
      label: item.title || '',
      url: item.url || '#',
      order: item.order ?? index,
    }))
    await FooterContent.findOneAndUpdate({}, { $set: { navigation: footerNav } }, { upsert: true })
  } catch (err) {
    console.error('[navigation] sync to footer failed:', err.message)
  }
}

// ─── Navbar Settings ────────────────────────────────────────────────

async function getNavbarSettings(_req, res) {
  try {
    let settings = await NavbarSettings.findOne()
    if (!settings) settings = await NavbarSettings.create({})
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.json({ success: true, settings })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch navbar settings' })
  }
}

async function updateNavbarSettings(req, res) {
  try {
    let settings = await NavbarSettings.findOne()
    if (!settings) settings = new NavbarSettings()
    Object.assign(settings, req.body)
    await settings.save()

    const syncBrandName = req.body.brandName
    if (syncBrandName !== undefined) {
      try { await SiteSettings.findOneAndUpdate({}, { $set: { brandName: syncBrandName } }, { upsert: true }) } catch (e) { console.error('[navbar] sync SiteSettings.brandName:', e.message) }
      try { await FooterContent.findOneAndUpdate({}, { $set: { brandName: syncBrandName } }, { upsert: true }) } catch (e) { console.error('[navbar] sync FooterContent.brandName:', e.message) }
      try { await HomeContent.findOneAndUpdate({}, { $set: { 'hero.fullName': syncBrandName } }, { upsert: true }) } catch (e) { console.error('[navbar] sync HomeContent.hero.fullName:', e.message) }
      try { await User.updateMany({}, { $set: { displayName: syncBrandName } }) } catch (e) { console.error('[navbar] sync User.displayName:', e.message) }
    }

    const syncBrandNameAm = req.body.brandNameAm
    if (syncBrandNameAm !== undefined) {
      try { await SiteSettings.findOneAndUpdate({}, { $set: { brandNameAm: syncBrandNameAm } }, { upsert: true }) } catch (e) { console.error('[navbar] sync SiteSettings.brandNameAm:', e.message) }
      try { await FooterContent.findOneAndUpdate({}, { $set: { brandNameAm: syncBrandNameAm } }, { upsert: true }) } catch (e) { console.error('[navbar] sync FooterContent.brandNameAm:', e.message) }
      try { await HomeContent.findOneAndUpdate({}, { $set: { 'hero.fullNameAm': syncBrandNameAm } }, { upsert: true }) } catch (e) { console.error('[navbar] sync HomeContent.hero.fullNameAm:', e.message) }
    }

    const logoFields = ['logo', 'logoSvg', 'logoAlt', 'logoWidth', 'logoHeight', 'logoBorderRadius', 'logoBgColor', 'logoPosition']
    const siteSettingsUpdate = {}
    const footerUpdate = {}
    let hasLogoUpdate = false

    for (const field of logoFields) {
      if (req.body[field] !== undefined) {
        hasLogoUpdate = true
        if (field === 'logo') {
          siteSettingsUpdate.logoImage = req.body[field]
          footerUpdate.footerLogo = req.body[field]
        } else if (field === 'logoAlt') {
          siteSettingsUpdate.logoText = req.body[field]
        } else {
          siteSettingsUpdate[field] = req.body[field]
        }
      }
    }

    if (hasLogoUpdate) {
      try { await SiteSettings.findOneAndUpdate({}, { $set: siteSettingsUpdate }, { upsert: true }) } catch (e) { console.error('[navbar] sync SiteSettings logo fields:', e.message) }
      try { await FooterContent.findOneAndUpdate({}, { $set: footerUpdate }, { upsert: true }) } catch (e) { console.error('[navbar] sync FooterContent logo:', e.message) }

      const photoUrl = req.body.logo
      if (photoUrl !== undefined) {
        try { await HomeContent.findOneAndUpdate({}, { $set: { 'hero.profilePhoto.url': photoUrl } }, { upsert: true }) } catch (e) { console.error('[navbar] sync HomeContent.profilePhoto:', e.message) }
        try { await User.updateMany({}, { $set: { avatar: photoUrl } }) } catch (e) { console.error('[navbar] sync User.avatar:', e.message) }
      }
    }

    res.json({ success: true, settings })
    await auditLog({ userId: req.user?._id, action: 'UPDATE', resource: 'NavbarSettings', resourceId: settings._id, details: { updatedFields: Object.keys(req.body) }, req })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update navbar settings' })
  }
}

module.exports = {
  getNavigation, createNavigation, updateNavigation, deleteNavigation, reorderNavigation,
  getNavbarSettings, updateNavbarSettings,
}
