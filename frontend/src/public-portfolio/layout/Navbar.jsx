import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Mail, ChevronRight, MapPin, Phone, Download, Globe, Sun, Moon } from 'lucide-react'
import { useSiteSettings } from '../../shared/context/SiteSettingsContext'
import Logo from '../../shared/components/Logo'
import { getNavigation, getNavbarSettings } from '../../shared/services/navigationService'

const FALLBACK_NAV_IDS = ['home', 'about', 'skills', 'projects', 'contact']

function buildFallbackItems(t) {
  return FALLBACK_NAV_IDS.map((id) => ({
    _id: id,
    title: t(`nav.${id}`),
    sectionId: id,
    url: `#${id}`,
    order: 0,
    visible: true,
    active: true,
    isExternal: false,
    openNewTab: false,
  }))
}

export default function Navbar({ darkMode, onToggleDark }) {
  const { t, i18n } = useTranslation()
  const { settings: siteSettings } = useSiteSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navItems, setNavItems] = useState(null)
  const [navLoaded, setNavLoaded] = useState(false)
  const [navbarSettings, setNavbarSettings] = useState(null)
  const [activeSection, setActiveSection] = useState('')
  const [breakpoint, setBreakpoint] = useState('desktop')

  const ns = navbarSettings

  // ── Fetch Data ────────────────────────────────────────────────

  useEffect(() => {
    loadNavItems()
    loadNavbarSettings()
  }, [])

  async function loadNavItems() {
    try {
      const res = await getNavigation()
      const items = (res.items || [])
        .filter((item) => item.visible)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      setNavItems(items)
    } catch (err) {
      console.error('[Navbar] Failed to fetch navigation items:', err)
      setNavItems([])
    } finally {
      setNavLoaded(true)
    }
  }

  async function loadNavbarSettings() {
    try {
      const res = await getNavbarSettings()
      setNavbarSettings(res.settings || null)
    } catch {}
  }

  // ── Theme Mode Sync ────────────────────────────────────────────

  const themeSynced = useRef(false)

  useEffect(() => {
    if (!ns?.themeMode || ns.themeMode === 'auto' || themeSynced.current) return
    const shouldBeDark = ns.themeMode === 'dark'
    if (shouldBeDark !== darkMode) {
      onToggleDark()
    }
    themeSynced.current = true
  }, [ns?.themeMode, darkMode, onToggleDark])

  const displayNavItems = useMemo(() => {
    if (!navLoaded) return buildFallbackItems(t)
    if (navItems && navItems.length > 0) return navItems
    return buildFallbackItems(t)
  }, [navItems, navLoaded, t])

  // ── Active Section Detection ──────────────────────────────────

  useEffect(() => {
    const sectionIds = displayNavItems
      .map((item) => item.sectionId)
      .filter(Boolean)
    if (sectionIds.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [displayNavItems])

  // ── Scroll Handler ────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Breakpoint Detection ──────────────────────────────────────

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 768) setBreakpoint('mobile')
      else if (w < 1024) setBreakpoint('tablet')
      else setBreakpoint('desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // ── Settings Values (with fallbacks matching current hardcoded) ──

  const settings = useMemo(() => {
    const s = ns || {}
    const result = {
      navbarHeight: s.navbarHeight ?? 72,
      navbarWidth: s.navbarWidth ?? '100%',
      containerWidth: s.containerWidth ?? '1200px',
      sticky: s.sticky !== false,
      transparent: !!s.transparent,
      fixed: s.fixed !== false,
      fullWidth: !!s.fullWidth,
      bgColor: s.bgColor || '#ffffff',
      textColor: s.textColor || '#374151',
      hoverColor: s.hoverColor || '#6366f1',
      activeLinkColor: s.activeLinkColor || '#6366f1',
      borderColor: s.borderColor || '#e5e7eb',
      shadowColor: s.shadowColor || 'rgba(0,0,0,0.1)',
      glassmorphism: s.glassmorphism !== false,
      blurEffect: s.blurEffect !== false,
      shadow: s.shadow !== false,
      backdropFilter: s.backdropFilter !== false,
      logoMargin: s.logoMargin ?? 0,
      menuGap: s.menuGap ?? 24,
      navbarPadding: s.navbarPadding ?? 16,
      buttonPadding: s.buttonPadding ?? 12,
      resumeEnabled: s.resumeEnabled !== false,
      resumeText: s.resumeText || t('nav.downloadCv'),
      resumeFileUrl: s.resumeFileUrl || siteSettings?.resume?.url || '',
      resumeBgColor: s.resumeBgColor || '#6366f1',
      resumeTextColor: s.resumeTextColor || '#ffffff',
      resumeHoverColor: s.resumeHoverColor || '#4f46e5',
      resumeBorderRadius: s.resumeBorderRadius ?? 9999,
      resumeButtonSize: s.resumeButtonSize || 'md',
      languageEnabled: s.languageEnabled !== false,
      themeEnabled: s.themeEnabled !== false,
      themeMode: s.themeMode || 'auto',
      lightBg: s.lightTheme?.bgColor || '#ffffff',
      lightText: s.lightTheme?.textColor || '#1f2937',
      lightHover: s.lightTheme?.hoverColor || '#6366f1',
      darkBg: s.darkTheme?.bgColor || '#0f172a',
      darkText: s.darkTheme?.textColor || '#e2e8f0',
      darkHover: s.darkTheme?.hoverColor || '#818cf8',
      hamburgerColor: s.hamburgerColor || '#374151',
      hamburgerPosition: s.hamburgerPosition || 'right',
      hamburgerWidth: s.hamburgerWidth ?? 24,
      hamburgerHeight: s.hamburgerHeight ?? 18,
      drawerBgColor: s.drawerBgColor || '#ffffff',
      drawerWidth: s.drawerWidth || '80%',
      drawerShowLogo: s.drawerShowLogo !== false,
      drawerShowLinks: s.drawerShowLinks !== false,
      drawerShowSocial: s.drawerShowSocial !== false,
      drawerShowResume: s.drawerShowResume !== false,
      drawerShowTheme: s.drawerShowTheme !== false,
      drawerShowLanguage: s.drawerShowLanguage !== false,
      drawerShadow: s.drawerShadow !== false,
      drawerBlur: s.drawerBlur !== false,
      navAnimation: s.navbarAnimation || 'slide-down',
      hoverEffect: s.hoverEffect || 'underline',
      menuOpenAnimation: s.menuOpenAnimation || 'slide',
      scrollEffect: s.scrollEffect || 'shrink',
    }
    if (breakpoint === 'desktop') {
      result.navbarHeight = s.desktopNavbarHeight ?? result.navbarHeight
      result.menuGap = s.desktopMenuGap ?? result.menuGap
    } else if (breakpoint === 'tablet') {
      result.navbarHeight = s.tabletNavbarHeight ?? result.navbarHeight
      result.menuGap = s.tabletMenuGap ?? result.menuGap
    } else {
      result.navbarHeight = s.mobileNavbarHeight ?? result.navbarHeight
      result.menuGap = s.mobileMenuGap ?? result.menuGap
    }
    return result
  }, [ns, t, siteSettings, breakpoint])

  // ── Merged Logo Settings ──────────────────────────────────────

  const mergedSettings = useMemo(() => ({
    ...siteSettings,
    logoImage: ns?.logo || siteSettings?.logoImage || '',
    logoSvg: ns?.logoSvg || siteSettings?.logoSvg || '',
    brandName: ns?.brandName || siteSettings?.brandName || '',
    logoText: ns?.logoAlt || siteSettings?.logoText || '',
    logoWidth: ns?.logoWidth ?? siteSettings?.logoWidth ?? 40,
    logoHeight: ns?.logoHeight ?? siteSettings?.logoHeight ?? 40,
    logoBorderRadius: ns?.logoBorderRadius ?? siteSettings?.logoBorderRadius ?? 8,
    logoBgColor: ns?.logoBgColor || siteSettings?.logoBgColor || 'transparent',
    logoPosition: ns?.logoPosition || siteSettings?.logoPosition || 'left',
    logoEnabled: ns?.logoEnabled !== false,
  }), [siteSettings, ns])

  // ── Navbar Container Style ────────────────────────────────────

  const positionClass = settings.fixed ? 'fixed' : settings.sticky ? 'sticky' : 'relative'

  const navStyle = useMemo(() => {
    const style = { minHeight: settings.navbarHeight + 'px', width: settings.navbarWidth }
    if (settings.navbarWidth !== '100%') {
      style.left = '0'
      style.right = '0'
      style.margin = '0 auto'
    }
    if (scrolled) {
      if (settings.glassmorphism) {
        // glass-nav CSS handles the translucent background + blur
      } else if (settings.scrollEffect === 'none') {
        style.backgroundColor = 'transparent'
      } else {
        style.backgroundColor = darkMode
          ? (ns?.darkTheme?.bgColor || settings.bgColor)
          : settings.bgColor
      }
      if (settings.scrollEffect === 'blur') {
        style.backdropFilter = 'blur(12px)'
        style.WebkitBackdropFilter = 'blur(12px)'
      }
    } else if (!settings.transparent) {
      style.backgroundColor = darkMode
        ? (ns?.darkTheme?.bgColor || settings.bgColor)
        : settings.bgColor
    }
    style.color = darkMode
      ? (ns?.darkTheme?.textColor || settings.textColor)
      : settings.textColor
    if (settings.shadow) {
      style.boxShadow = `0 4px 20px ${settings.shadowColor}`
    }
    if (settings.borderColor) {
      style.borderBottom = `1px solid ${settings.borderColor}`
    }
    return style
  }, [settings, ns, scrolled, darkMode])

  const linkTextColor = useMemo(() => {
    return darkMode
      ? (ns?.darkTheme?.textColor || settings.textColor)
      : settings.textColor
  }, [settings, ns, darkMode])

  const linkHoverColor = useMemo(() => {
    return settings.hoverColor
  }, [settings])

  const drawerBg = useMemo(() => {
    return darkMode
      ? (ns?.darkTheme?.bgColor || settings.drawerBgColor)
      : settings.drawerBgColor
  }, [settings, ns, darkMode])

  // ── Scroll Effect Classes ─────────────────────────────────────

  const scrolledClasses = useMemo(() => {
    const base = settings.navbarPadding ? `py-2 sm:py-3` : 'py-3 sm:py-4'
    if (settings.scrollEffect === 'shrink') return `${base}`
    if (settings.scrollEffect === 'blur') return `${base}`
    if (settings.scrollEffect === 'color-change') return `${base}`
    return 'py-5 sm:py-6'
  }, [settings])

  // ── Navbar Entrance Animation ─────────────────────────────────

  const navVariants = useMemo(() => {
    switch (settings.navAnimation) {
      case 'fade-in':
        return { initial: { opacity: 0 }, animate: { opacity: 1 } }
      case 'slide-up':
        return { initial: { y: 100 }, animate: { y: 0 } }
      case 'blur-reveal':
        return { initial: { opacity: 0, filter: 'blur(8px)' }, animate: { opacity: 1, filter: 'blur(0px)' } }
      case 'slide-down':
      default:
        return { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } }
    }
  }, [settings.navAnimation])

  // ── Hamburger Menu Style ─────────────────────────────────────

  const hamburgerBtnStyle = useMemo(() => ({
    color: settings.hamburgerColor,
  }), [settings.hamburgerColor])

  // ── Resume Button Style ──────────────────────────────────────

  const resumeStyle = useMemo(() => {
    const sizePadding = {
      sm: { px: '12px', py: '6px', fontSize: '11px' },
      md: { px: '16px', py: '8px', fontSize: '12px' },
      lg: { px: '24px', py: '12px', fontSize: '14px' },
    }
    const pad = sizePadding[settings.resumeButtonSize] || sizePadding.md
    return {
      backgroundColor: settings.resumeBgColor,
      color: settings.resumeTextColor,
      borderRadius: settings.resumeBorderRadius + 'px',
      paddingLeft: pad.px,
      paddingRight: pad.px,
      paddingTop: pad.py,
      paddingBottom: pad.py,
      fontSize: pad.fontSize,
    }
  }, [settings])

  // ── Drawer Animation Variants ─────────────────────────────────

  const drawerVariants = useMemo(() => {
    const drawerType = ns?.drawerType || 'slide-right'
    switch (drawerType) {
      case 'slide-left':
        return { initial: { x: '-100%', opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: '-100%', opacity: 0 } }
      case 'slide-top':
        return { initial: { y: '-100%', opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: '-100%', opacity: 0 } }
      case 'fullscreen':
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
      case 'slide-right':
      default:
        return { initial: { x: '100%', opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: '100%', opacity: 0 } }
    }
  }, [ns?.drawerType])

  const drawerTransition = useMemo(() => {
    if (ns?.drawerType === 'fullscreen') return { duration: 0.3 }
    return { type: 'spring', damping: 30, stiffness: 150 }
  }, [ns?.drawerType])

  const drawerWidthClass = useMemo(() => {
    if (ns?.drawerType === 'fullscreen') return 'w-full'
    if (settings.drawerWidth === '100%') return 'w-full'
    if (settings.drawerWidth === '90%') return 'w-[90%]'
    return 'w-full sm:w-96'
  }, [settings.drawerWidth, ns?.drawerType])

  // ── Right Controls Gap ────────────────────────────────────────

  const rightControlsGap = Math.round(settings.menuGap / 3)

  // ── Click Handler ─────────────────────────────────────────────

  const handleNavClick = useCallback((e, item) => {
    if (!item.active) return
    if (item.isExternal || item.openNewTab) return
    e.preventDefault()
    const targetId = item.sectionId || item.url?.replace('#', '')
    if (targetId) {
      const target = document.getElementById(targetId)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    setIsOpen(false)
  }, [])

  // ── Hover Effect Underline Style ──────────────────────────────

  const hoverUnderlineStyle = useMemo(() => ({
    backgroundColor: linkHoverColor || 'var(--color-primary, #6366f1)',
  }), [linkHoverColor])

  // ── Theme-Aware Control Colors ─────────────────────────────────

  const controlBg = useMemo(() => {
    return darkMode
      ? (ns?.darkTheme?.textColor ? `${ns.darkTheme.textColor}1A` : '#1e293b')
      : (ns?.lightTheme?.textColor ? `${ns.lightTheme.textColor}1A` : '#f3f4f6')
  }, [ns?.darkTheme?.textColor, ns?.lightTheme?.textColor, darkMode])

  const controlTextColor = useMemo(() => {
    return darkMode
      ? (ns?.darkTheme?.textColor || '#cbd5e1')
      : (ns?.lightTheme?.textColor || '#4b5563')
  }, [ns?.darkTheme?.textColor, ns?.lightTheme?.textColor, darkMode])

  const drawerSurfaceBg = useMemo(() => {
    return darkMode
      ? (ns?.darkTheme?.bgColor ? `${ns.darkTheme.bgColor}CC` : '#171717')
      : (ns?.lightTheme?.bgColor ? `${ns.lightTheme.bgColor}CC` : '#f9fafb')
  }, [ns?.darkTheme?.bgColor, ns?.lightTheme?.bgColor, darkMode])

  const drawerBorderColor = useMemo(() => {
    return darkMode
      ? (ns?.darkTheme?.textColor ? `${ns.darkTheme.textColor}1A` : '#262626')
      : (ns?.lightTheme?.textColor ? `${ns.lightTheme.textColor}1A` : '#e5e7eb')
  }, [ns?.darkTheme?.textColor, ns?.lightTheme?.textColor, darkMode])

  // ── Render ────────────────────────────────────────────────────

  return (
    <motion.nav
      initial={navVariants.initial}
      animate={navVariants.animate}
      transition={{ duration: 0.5 }}
      style={navStyle}
      className={`${positionClass} top-0 z-[1000] transition-[background-color,box-shadow,padding] duration-500 ${
        scrolled
          ? `${scrolledClasses} ${settings.glassmorphism ? 'glass-nav' : ''}`
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div
        className={`${settings.fullWidth ? 'w-full' : 'container'} mx-auto px-4 sm:px-6 flex justify-between items-center`}
        style={settings.fullWidth ? {} : { maxWidth: settings.containerWidth }}
      >
        <div style={settings.logoMargin ? { marginLeft: settings.logoMargin + 'px', marginRight: settings.logoMargin + 'px' } : {}}>
          <Logo settings={mergedSettings} linkTo="#home" onNavClick={(e) => handleNavClick(e, { sectionId: 'home', url: '#home', isExternal: false, openNewTab: false })} />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer z-[1001] rounded-lg sm:rounded-xl hover:bg-primary hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('nav.toggleMenu')}
          style={{ ...hamburgerBtnStyle, backgroundColor: controlBg }}
        >
          {isOpen ? <X size={settings.hamburgerHeight} /> : <Menu size={settings.hamburgerHeight} />}
        </button>

        {/* Desktop Links + Right Controls */}
        <div
          className="hidden md:flex items-center"
          style={{ gap: settings.menuGap + 'px' }}
        >
          <ul
            className="flex items-center"
            style={{ gap: settings.menuGap + 'px' }}
          >
            {displayNavItems.map((item, idx) => (
              <motion.li
                key={item._id || item.sectionId}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx + 0.5 }}
              >
                <a
                  href={item.active ? (item.url || `#${item.sectionId}`) : undefined}
                  target={item.active && item.openNewTab ? '_blank' : undefined}
                  rel={item.active && item.openNewTab ? 'noopener noreferrer' : undefined}
                  className={`text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors relative group ${
                    item.active
                      ? activeSection === item.sectionId
                        ? 'text-primary dark:text-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                      : 'text-gray-300 dark:text-gray-600 cursor-default'
                  }`}
                  style={{
                    color: item.active
                      ? activeSection === item.sectionId
                        ? settings.activeLinkColor
                        : linkTextColor
                      : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (item.active && linkHoverColor && activeSection !== item.sectionId) {
                      e.currentTarget.style.color = linkHoverColor
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.active) {
                      e.currentTarget.style.color = activeSection === item.sectionId
                        ? settings.activeLinkColor
                        : linkTextColor || ''
                    }
                  }}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {item.title}
                  {settings.hoverEffect === 'underline' && (
                    <motion.span
                      className="absolute -bottom-2 left-0 w-0 h-0.5 sm:h-1 group-hover:w-full"
                      style={hoverUnderlineStyle}
                    />
                  )}
                </a>
              </motion.li>
            ))}
          </ul>
          <div
            className="flex items-center"
            style={{ gap: rightControlsGap + 'px' }}
          >
            {settings.languageEnabled && (
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en')}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-primary hover:text-white transition-colors"
                style={{ backgroundColor: controlBg, color: controlTextColor }}
                aria-label={i18n.language === 'en' ? t('nav.switchLanguage') : t('nav.switchLanguage_am')}
              >
                <Globe size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-[9px] sm:text-[10px] font-bold ml-0.5">{i18n.language === 'en' ? t('nav.en') : t('nav.am')}</span>
              </motion.button>
            )}
            {settings.themeEnabled && (
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleDark}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-primary hover:text-white transition-colors"
                style={{ backgroundColor: controlBg, color: controlTextColor }}
                aria-label={darkMode ? t('nav.switchThemeLight') : t('nav.switchThemeDark')}
              >
                {darkMode ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </motion.button>
            )}
            {settings.resumeEnabled && (
              <motion.a
                href={settings.resumeFileUrl || '/resume.pdf'}
                download
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 font-bold uppercase tracking-wider rounded-full hover:shadow-lg transition-all shadow-md cursor-pointer"
                style={resumeStyle}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = settings.resumeHoverColor }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = settings.resumeBgColor }}
              >
                <Download size={14} className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-bounce" />
                <span>{settings.resumeText}</span>
              </motion.a>
            )}
          </div>
        </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[1000] md:hidden"
              style={settings.backdropFilter ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } : {}}
            />
            <motion.div
              initial={drawerVariants.initial}
              animate={drawerVariants.animate}
              exit={drawerVariants.exit}
              transition={drawerTransition}
              className={`fixed top-0 ${settings.hamburgerPosition === 'left' ? 'left-0' : 'right-0'} h-full ${drawerWidthClass} backdrop-blur-2xl z-[1001] p-6 sm:p-8 md:p-10 flex flex-col`}
              style={{
                backgroundColor: drawerBg,
                boxShadow: settings.drawerShadow ? `-4px 0 20px ${settings.shadowColor}` : 'none',
              }}
            >
              <div className="flex justify-between items-center mb-10 sm:mb-14 md:mb-16">
                {settings.drawerShowLogo && (
                  <motion.div
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                  >
                    <Logo settings={mergedSettings} showText={false} linkTo={null} />
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl text-xl sm:text-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                  style={{ backgroundColor: controlBg, color: controlTextColor }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {settings.drawerShowLinks && (
              <ul className="flex flex-col" style={{ gap: settings.menuGap + 'px' }}>
                {displayNavItems.map((item, idx) => (
                  <motion.li
                    key={item._id || item.sectionId}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx, type: 'spring' }}
                  >
                    <a
                      href={item.active ? (item.url || `#${item.sectionId}`) : undefined}
                      target={item.active && item.openNewTab ? '_blank' : undefined}
                      rel={item.active && item.openNewTab ? 'noopener noreferrer' : undefined}
                      className={`text-3xl sm:text-4xl md:text-5xl font-black transition-all flex items-center justify-between group font-display tracking-tighter ${
                        item.active
                          ? activeSection === item.sectionId
                            ? 'text-primary dark:text-primary'
                            : 'text-gray-900 dark:text-white hover:text-primary'
                          : 'text-gray-400 dark:text-gray-600 cursor-default'
                      }`}
                      style={{
                        color: item.active
                          ? activeSection === item.sectionId
                            ? settings.activeLinkColor
                            : linkTextColor
                          : undefined,
                      }}
                      onMouseEnter={(e) => {
                        if (item.active && linkHoverColor && activeSection !== item.sectionId) {
                          e.currentTarget.style.color = linkHoverColor
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (item.active) {
                          e.currentTarget.style.color = activeSection === item.sectionId
                            ? settings.activeLinkColor
                            : linkTextColor || ''
                        }
                      }}
                      onClick={(e) => handleNavClick(e, item)}
                    >
                      <span className="group-hover:translate-x-4 transition-transform duration-500">
                        {item.title}
                      </span>
                      {item.active && activeSection !== item.sectionId && (
                        <ChevronRight
                          className="opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all duration-500 w-8 h-8 sm:w-10 sm:h-10"
                          style={{ color: linkHoverColor }}
                        />
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
              )}

              <div className="mt-auto space-y-6 sm:space-y-8">
                {(settings.drawerShowTheme || settings.drawerShowLanguage || settings.drawerShowResume) && (
                  <div className="flex justify-center gap-3 sm:gap-4">
                    {settings.drawerShowLanguage && settings.languageEnabled && (
                      <button
                        onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en')}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                        style={{ backgroundColor: controlBg, color: controlTextColor }}
                        aria-label={t('nav.switchLanguage')}
                      >
                        <Globe size={18} />
                      </button>
                    )}
                    {settings.drawerShowTheme && settings.themeEnabled && (
                      <button
                        onClick={onToggleDark}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                        style={{ backgroundColor: controlBg, color: controlTextColor }}
                        aria-label={darkMode ? t('nav.switchThemeLight') : t('nav.switchThemeDark')}
                      >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                      </button>
                    )}
                    {settings.drawerShowResume && settings.resumeEnabled && (
                      <a
                        href={settings.resumeFileUrl || '/resume.pdf'}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                        style={{ backgroundColor: controlBg, color: controlTextColor }}
                      >
                        <Download size={18} />
                      </a>
                    )}
                  </div>
                )}
                {settings.drawerShowSocial && (
                  <>
                  <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[1.5rem] border"
                    style={{ backgroundColor: drawerSurfaceBg, borderColor: drawerBorderColor }}>
                    <div className="space-y-4 sm:space-y-5">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-primary" />
                        <span className="text-sm sm:text-base font-bold" style={{ color: controlTextColor }}>{t('nav.location')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-primary" />
                        <span className="text-sm sm:text-base font-bold break-all" style={{ color: controlTextColor }}>{siteSettings?.phone || '+251 908 720 092'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-primary" />
                        <span className="text-sm sm:text-base font-bold break-all" style={{ color: controlTextColor }}>{siteSettings?.email || 'desalegnky827@gmail.com'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 sm:gap-5 md:gap-6">
                    {[
                      { href: siteSettings?.socialLinks?.linkedin || 'https://linkedin.com/in/dk-cs-3rd', icon: <Linkedin size={20} /> },
                      { href: siteSettings?.socialLinks?.github || 'https://github.com/desalegn-tech', icon: <Github size={20} /> },
                      { href: siteSettings?.socialLinks?.telegram || 'https://t.me/Ds35kg', icon: <Telegram size={20} /> }
                    ].map((social, idx) => (
                      <motion.a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                        style={{ backgroundColor: controlBg, color: controlTextColor }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </motion.nav>
  )
}

const Linkedin = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
)

const Github = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

const Telegram = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
  </svg>
)
