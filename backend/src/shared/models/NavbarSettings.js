const mongoose = require('mongoose')

const navbarSettingsSchema = new mongoose.Schema({
  // Logo
  logo: { type: String, default: '' },
  logoSvg: { type: String, default: '' },
  logoAlt: { type: String, default: 'Logo' },
  brandName: { type: String, default: 'DESALEGN' },
  logoWidth: { type: Number, default: 40 },
  logoHeight: { type: Number, default: 40 },
  logoBorderRadius: { type: Number, default: 8 },
  logoBgColor: { type: String, default: 'transparent' },
  logoPosition: { type: String, enum: ['left', 'center', 'right'], default: 'left' },

  // General
  navbarHeight: { type: Number, default: 72 },
  navbarWidth: { type: String, default: '100%' },
  sticky: { type: Boolean, default: true },
  transparent: { type: Boolean, default: false },
  fixed: { type: Boolean, default: true },
  fullWidth: { type: Boolean, default: false },
  containerWidth: { type: String, default: '1200px' },

  // Colors
  bgColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#6b7280' },
  hoverColor: { type: String, default: '#6366f1' },
  activeLinkColor: { type: String, default: '#6366f1' },
  borderColor: { type: String, default: '#e5e7eb' },
  shadowColor: { type: String, default: 'rgba(0,0,0,0.1)' },

  // Effects
  glassmorphism: { type: Boolean, default: false },
  blurEffect: { type: Boolean, default: true },
  shadow: { type: Boolean, default: true },
  backdropFilter: { type: Boolean, default: true },

  // Spacing
  logoMargin: { type: Number, default: 0 },
  menuGap: { type: Number, default: 24 },
  navbarPadding: { type: Number, default: 16 },
  buttonPadding: { type: Number, default: 12 },

  // Resume Button
  resumeEnabled: { type: Boolean, default: true },
  resumeText: { type: String, default: 'Download CV' },
  resumeFileUrl: { type: String, default: '' },
  resumeIcon: { type: String, default: 'Download' },
  resumeIconPosition: { type: String, enum: ['left', 'right'], default: 'left' },
  resumeBgColor: { type: String, default: '#6366f1' },
  resumeTextColor: { type: String, default: '#ffffff' },
  resumeHoverColor: { type: String, default: '#4f46e5' },
  resumeBorderRadius: { type: Number, default: 9999 },
  resumeButtonSize: { type: String, enum: ['sm', 'md', 'lg'], default: 'md' },

  // Language
  languageEnabled: { type: Boolean, default: true },
  defaultLanguage: { type: String, default: 'en' },
  availableLanguages: [{ code: String, name: String, flag: String }],

  // Theme
  themeEnabled: { type: Boolean, default: true },
  themeMode: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
  lightTheme: {
    bgColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#1f2937' },
    hoverColor: { type: String, default: '#6366f1' },
  },
  darkTheme: {
    bgColor: { type: String, default: '#0f172a' },
    textColor: { type: String, default: '#e2e8f0' },
    hoverColor: { type: String, default: '#818cf8' },
  },

  // Responsive — Desktop
  desktopShowFullMenu: { type: Boolean, default: true },
  desktopShowResume: { type: Boolean, default: true },
  desktopShowTheme: { type: Boolean, default: true },
  desktopShowLanguage: { type: Boolean, default: true },
  desktopLayout: { type: String, enum: ['logo-left-menu-center', 'logo-left-menu-right', 'centered', 'split'], default: 'logo-left-menu-right' },
  desktopNavbarHeight: { type: Number, default: 72 },
  desktopLogoSize: { type: Number, default: 40 },
  desktopMenuGap: { type: Number, default: 24 },
  desktopFontSize: { type: String, default: '12px' },
  desktopButtonSize: { type: String, default: 'md' },
  desktopIconSize: { type: Number, default: 16 },

  // Responsive — Tablet
  tabletShowFullMenu: { type: Boolean, default: true },
  tabletShowHamburger: { type: Boolean, default: true },
  tabletNavigationType: { type: String, enum: ['horizontal', 'dropdown', 'hamburger'], default: 'hamburger' },
  tabletNavbarHeight: { type: Number, default: 64 },
  tabletLogoSize: { type: Number, default: 36 },
  tabletMenuGap: { type: Number, default: 16 },
  tabletFontSize: { type: String, default: '11px' },
  tabletButtonSize: { type: String, default: 'sm' },
  tabletIconSize: { type: Number, default: 14 },

  // Responsive — Mobile
  mobileNavbarHeight: { type: Number, default: 56 },
  mobileLogoSize: { type: Number, default: 32 },
  mobileMenuGap: { type: Number, default: 12 },
  mobileFontSize: { type: String, default: '10px' },
  mobileButtonSize: { type: String, default: 'sm' },
  mobileIconSize: { type: Number, default: 14 },

  // Mobile Navigation
  mobileMenuEnabled: { type: Boolean, default: true },
  mobileDrawerEnabled: { type: Boolean, default: true },
  mobileFullScreenMenu: { type: Boolean, default: false },
  mobileSlideMenu: { type: Boolean, default: false },
  mobileLayout: { type: String, enum: ['logo-only', 'logo-hamburger', 'logo-resume-hamburger'], default: 'logo-hamburger' },

  // Hamburger Menu
  hamburgerPosition: { type: String, enum: ['left', 'right'], default: 'right' },
  hamburgerStyle: { type: String, enum: ['three-lines', 'rounded-lines', 'minimal-lines', 'modern-animated', 'material', 'ios', 'custom-svg'], default: 'three-lines' },
  hamburgerWidth: { type: Number, default: 24 },
  hamburgerHeight: { type: Number, default: 18 },
  hamburgerThickness: { type: Number, default: 2 },
  hamburgerColor: { type: String, default: '#374151' },
  hamburgerHoverColor: { type: String, default: '#6366f1' },
  hamburgerActiveColor: { type: String, default: '#6366f1' },
  hamburgerAnimation: { type: String, enum: ['rotate-to-x', 'morph-to-x', 'fade', 'slide', 'elastic'], default: 'rotate-to-x' },

  // Drawer
  drawerType: { type: String, enum: ['slide-left', 'slide-right', 'slide-top', 'fullscreen'], default: 'slide-right' },
  drawerWidth: { type: String, default: '80%' },
  drawerBgColor: { type: String, default: '#ffffff' },
  drawerBlur: { type: Boolean, default: true },
  drawerShadow: { type: Boolean, default: true },

  // Drawer Content
  drawerShowLogo: { type: Boolean, default: true },
  drawerShowLinks: { type: Boolean, default: true },
  drawerShowSocial: { type: Boolean, default: true },
  drawerShowResume: { type: Boolean, default: true },
  drawerShowTheme: { type: Boolean, default: true },
  drawerShowLanguage: { type: Boolean, default: true },

  // Animations
  navbarAnimation: { type: String, enum: ['fade-in', 'slide-down', 'slide-up', 'blur-reveal'], default: 'slide-down' },
  hoverEffect: { type: String, enum: ['underline', 'border', 'glow', 'scale'], default: 'underline' },
  menuOpenAnimation: { type: String, enum: ['slide', 'fade', 'scale', 'reveal'], default: 'slide' },
  scrollEffect: { type: String, enum: ['shrink', 'blur', 'color-change', 'none'], default: 'shrink' },
}, { timestamps: true })

module.exports = mongoose.model('NavbarSettings', navbarSettingsSchema)
