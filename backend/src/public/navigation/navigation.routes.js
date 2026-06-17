const router = require('express').Router()
const ctrl = require('./navigation.controller')
const { authenticateToken } = require('../../shared/middleware/auth')

// Navigation items (public)
router.get('/navigation', ctrl.getNavigation)

// Navbar settings (public)
router.get('/navbar-settings', ctrl.getNavbarSettings)

// Protected routes (admin)
router.post('/navigation', authenticateToken, ctrl.createNavigation)
router.put('/navigation/:id', authenticateToken, ctrl.updateNavigation)
router.delete('/navigation/:id', authenticateToken, ctrl.deleteNavigation)
router.put('/navigation-reorder', authenticateToken, ctrl.reorderNavigation)

router.put('/navbar-settings', authenticateToken, ctrl.updateNavbarSettings)

module.exports = router
