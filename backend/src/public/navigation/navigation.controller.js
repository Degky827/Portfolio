const Navigation = require('../../shared/models/Navigation')
const NavbarSettings = require('../../shared/models/NavbarSettings')

// ─── Navigation (Menu Items) ────────────────────────────────────────

async function getNavigation(_req, res) {
  try {
    const items = await Navigation.find().sort({ order: 1 })
    res.json({ success: true, items })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch navigation' })
  }
}

async function createNavigation(req, res) {
  try {
    const count = await Navigation.countDocuments()
    const item = await Navigation.create({ ...req.body, order: count })
    res.json({ success: true, item })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create navigation item' })
  }
}

async function updateNavigation(req, res) {
  try {
    const item = await Navigation.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!item) return res.status(404).json({ success: false, message: 'Navigation item not found' })
    res.json({ success: true, item })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update navigation item' })
  }
}

async function deleteNavigation(req, res) {
  try {
    const item = await Navigation.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ success: false, message: 'Navigation item not found' })
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
    res.json({ success: true, message: 'Navigation reordered' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reorder navigation' })
  }
}

// ─── Navbar Settings ────────────────────────────────────────────────

async function getNavbarSettings(_req, res) {
  try {
    let settings = await NavbarSettings.findOne()
    if (!settings) settings = await NavbarSettings.create({})
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
    res.json({ success: true, settings })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update navbar settings' })
  }
}

module.exports = {
  getNavigation, createNavigation, updateNavigation, deleteNavigation, reorderNavigation,
  getNavbarSettings, updateNavbarSettings,
}
