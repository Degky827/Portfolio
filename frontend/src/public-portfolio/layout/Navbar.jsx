import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, Sun, Moon, FileText } from 'lucide-react'
import { useSiteSettings } from '../../shared/context/SiteSettingsContext'
import Logo from '../../shared/components/Logo'
import { getNavigation, getNavbarSettings } from '../../shared/services/navigationService'
import { useSocketRefresh } from '../../shared/hooks/useSocketRefresh'

const FALLBACK_NAV_IDS = ['home', 'about', 'skills', 'projects', 'experience', 'contact']

function buildFallbackItems() {
  return FALLBACK_NAV_IDS.map((id) => ({
    _id: id,
    title: id.charAt(0).toUpperCase() + id.slice(1),
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

  const loadNavItems = useCallback(async () => {
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
  }, [])

  const loadNavbarSettings = useCallback(async () => {
    try {
      const res = await getNavbarSettings()
      setNavbarSettings(res.settings || null)
    } catch {}
  }, [])

  useEffect(() => {
    loadNavItems()
    loadNavbarSettings()
  }, [loadNavItems, loadNavbarSettings])

  useSocketRefresh('content:updated', loadNavItems, { type: 'navigation' })
  useSocketRefresh('content:updated', loadNavbarSettings, { type: 'navbar' })
  useSocketRefresh('content:updated', loadNavbarSettings, { type: 'site-settings' })

  // Theme is controlled by useDarkMode hook (backend is default, user toggle persists)

  const displayNavItems = useMemo(() => {
    if (!navLoaded) return buildFallbackItems()
    if (navItems && navItems.length > 0) return navItems
    return buildFallbackItems()
  }, [navItems, navLoaded])

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
      setScrolled(window.scrollY > 30)
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

  // ── Settings Values ──────────────────────────────────────────

  const settings = useMemo(() => {
    const s = ns || {}
    const result = {
      navbarHeight: s.navbarHeight ?? 80,
      navbarWidth: s.navbarWidth ?? '100%',
      containerWidth: s.containerWidth ?? '1200px',
      sticky: s.sticky !== false,
      transparent: !!s.transparent,
      fixed: s.fixed !== false,
      fullWidth: !!s.fullWidth,
      bgColor: s.bgColor || '#1a1a2e',
      textColor: s.textColor || '#ffffff',
      hoverColor: s.hoverColor || '#6366f1',
      activeLinkColor: s.activeLinkColor || '#6366f1',
      borderColor: s.borderColor || 'rgba(255,255,255,0.08)',
      shadowColor: s.shadowColor || 'rgba(0,0,0,0.2)',
      glassmorphism: s.glassmorphism !== false,
      blurEffect: s.blurEffect !== false,
      shadow: s.shadow !== false,
      backdropFilter: s.backdropFilter !== false,
      logoMargin: s.logoMargin ?? 0,
      menuGap: s.menuGap ?? 24,
      navbarPadding: s.navbarPadding ?? 12,
      buttonPadding: s.buttonPadding ?? 10,
      themeEnabled: s.themeEnabled !== false,
      themeMode: s.themeMode || 'auto',
      lightBg: s.lightTheme?.bgColor || '#ffffff',
      lightText: s.lightTheme?.textColor || '#1f2937',
      lightHover: s.lightTheme?.hoverColor || '#4f46e5',
      darkBg: s.darkTheme?.bgColor || '#1a1a2e',
      darkText: s.darkTheme?.textColor || '#ffffff',
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
      drawerShowTheme: s.drawerShowTheme !== false,
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
  }, [ns, siteSettings, breakpoint])

  // ── Merged Logo Settings ──────────────────────────────────────

  const mergedSettings = useMemo(() => ({
    ...siteSettings,
    logoImage: ns?.logo || siteSettings?.logoImage || '',
    logoSvg: ns?.logoSvg || siteSettings?.logoSvg || '',
    brandName: ns?.brandName || siteSettings?.brandName || '',
    logoText: ns?.logoAlt || siteSettings?.logoText || '',
    logoWidth: ns?.logoWidth ?? siteSettings?.logoWidth ?? 36,
    logoHeight: ns?.logoHeight ?? siteSettings?.logoHeight ?? 36,
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
    if (isOpen) {
      style.backgroundColor = darkMode ? 'rgba(8,11,20,1)' : 'rgba(255,255,255,1)'
    } else {
      style.backgroundColor = darkMode ? 'rgba(8,11,20,0.85)' : 'rgba(255,255,255,0.92)'
    }
    style.backdropFilter = 'blur(16px)'
    style.WebkitBackdropFilter = 'blur(16px)'
    style.color = darkMode ? '#ffffff' : '#1f2937'
    if (settings.shadow) {
      style.boxShadow = `0 4px 20px ${settings.shadowColor}`
    }
    style.borderBottom = `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`
    return style
  }, [settings, ns, scrolled, darkMode, isOpen])

  const linkTextColor = useMemo(() => {
    return darkMode ? '#ffffff' : '#1f2937'
  }, [darkMode])

  const linkHoverColor = useMemo(() => {
    return settings.hoverColor || '#6366f1'
  }, [settings])

  const drawerBg = useMemo(() => {
    return darkMode
      ? (ns?.darkTheme?.bgColor || '#1a1a2e')
      : settings.drawerBgColor
  }, [settings, ns, darkMode])

  const navVariants = useMemo(() => {
    return { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } }
  }, [])

  const hamburgerBtnStyle = useMemo(() => ({
    color: settings.hamburgerColor,
  }), [settings.hamburgerColor])

  const drawerVariants = useMemo(() => ({
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  }), [])

  const drawerTransition = { type: 'spring', damping: 30, stiffness: 150 }
  const drawerWidthClass = 'w-full'
  const rightControlsGap = Math.round(settings.menuGap / 3)

  const handleNavClick = useCallback((e, item) => {
    if (!item.active) return
    if (item.isExternal || item.openNewTab) return
    e.preventDefault()
    const targetId = item.sectionId || item.url?.replace('#', '')
    if (!targetId) return

    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.location.hash = '/' + (targetId === 'home' ? '' : '#' + targetId)
      setTimeout(() => {
        const el = document.getElementById(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
    setIsOpen(false)
  }, [])

  const hoverUnderlineStyle = useMemo(() => ({
    backgroundColor: linkHoverColor || '#6366f1',
  }), [linkHoverColor])

  const controlBg = useMemo(() => {
    return darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
  }, [darkMode])

  const controlTextColor = useMemo(() => {
    return darkMode ? '#ffffff' : '#374151'
  }, [darkMode])

  return (
    <motion.nav
      initial={navVariants.initial}
      animate={navVariants.animate}
      transition={{ duration: 0.5 }}
      style={navStyle}
      className={`${positionClass} top-0 z-[1000] transition-[background-color,box-shadow,padding] duration-300 py-3 sm:py-3.5`}
    >
      <div
        className={`${settings.fullWidth ? 'w-full' : 'container'} mx-auto px-4 sm:px-6 flex justify-between items-center`}
        style={settings.fullWidth ? {} : { maxWidth: settings.containerWidth }}
      >
        {/* Logo — left */}
        <div className="shrink-0" style={settings.logoMargin ? { marginLeft: settings.logoMargin + 'px', marginRight: settings.logoMargin + 'px' } : {}}>
          <Logo settings={mergedSettings} linkTo="/" onNavClick={(e) => {
            e.preventDefault()
            if (window.location.hash !== '#/' && window.location.hash !== '#') {
              window.location.hash = '/'
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
            setIsOpen(false)
          }} />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center cursor-pointer z-[1002] rounded-lg hover:bg-indigo-600 hover:text-white transition-colors relative"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{ ...hamburgerBtnStyle, backgroundColor: controlBg }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop: center nav links */}
        <ul
          className="hidden md:flex items-center justify-center flex-1"
          style={{ gap: settings.menuGap + 'px' }}
        >
          {displayNavItems.map((item, idx) => (
            <motion.li
              key={item._id || item.sectionId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx + 0.2 }}
            >
              <a
                href="#"
                target={item.active && item.openNewTab ? '_blank' : undefined}
                rel={item.active && item.openNewTab ? 'noopener noreferrer' : undefined}
                className="text-xs font-bold uppercase tracking-widest transition-colors relative group whitespace-nowrap"
                style={{
                  color: item.active
                    ? (activeSection === item.sectionId
                      ? settings.activeLinkColor
                      : linkTextColor)
                    : linkTextColor,
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
                {activeSection === item.sectionId ? (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(129,140,248,0.8)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                ) : (
                  settings.hoverEffect === 'underline' && (
                    <motion.span
                      className="absolute -bottom-1.5 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                      style={hoverUnderlineStyle}
                    />
                  )
                )}
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Desktop: right controls — CV link + theme toggle */}
        <div className="hidden md:flex items-center shrink-0" style={{ gap: rightControlsGap + 'px' }}>
          {ns?.resumeEnabled !== false && (
            <a
              href={ns?.resumeFileUrl || '/#/cv'}
              className="text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 whitespace-nowrap"
              style={{ color: linkTextColor }}
              onMouseEnter={(e) => { e.currentTarget.style.color = linkHoverColor }}
              onMouseLeave={(e) => { e.currentTarget.style.color = linkTextColor }}
            >
              <FileText size={13} />
              {ns?.resumeText || 'CV'}
            </a>
          )}
          {settings.themeEnabled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onToggleDark}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              style={{ backgroundColor: controlBg, color: controlTextColor }}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
          )}
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
                className="fixed inset-0 bg-black backdrop-blur-sm z-[1002] md:hidden"
              />
              <motion.div
                initial={drawerVariants.initial}
                animate={drawerVariants.animate}
                exit={drawerVariants.exit}
                transition={drawerTransition}
                className={`fixed top-0 right-0 h-full ${drawerWidthClass} backdrop-blur-2xl z-[1003] p-6 sm:p-8 flex flex-col`}
                style={{
                  backgroundColor: drawerBg,
                  boxShadow: `-4px 0 20px rgba(0,0,0,0.3)`,
                }}
              >
                <div className="flex justify-between items-center mb-10">
                  <Logo settings={mergedSettings} showText={false} linkTo={null} />
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                    style={{ backgroundColor: controlBg, color: controlTextColor }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <ul className="flex flex-col gap-5">
                  {displayNavItems.map((item, idx) => (
                    <motion.li
                      key={item._id || item.sectionId}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, type: 'spring' }}
                    >
                      <a
                        href="#"
                        target={item.active && item.openNewTab ? '_blank' : undefined}
                        rel={item.active && item.openNewTab ? 'noopener noreferrer' : undefined}
                        className="text-2xl font-black transition-all flex items-center justify-between group font-display tracking-tight"
                        style={{
                          color: item.active
                            ? activeSection === item.sectionId
                              ? settings.activeLinkColor
                              : linkTextColor
                            : linkTextColor,
                        }}
                        onClick={(e) => handleNavClick(e, item)}
                      >
                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                          {item.title}
                        </span>
                        <ChevronRight
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-5 h-5"
                          style={{ color: linkHoverColor }}
                        />
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {ns?.resumeEnabled !== false && (
                <a
                  href={ns?.resumeFileUrl || '/#/cv'}
                  className="text-2xl font-black transition-all flex items-center justify-between group font-display tracking-tight mt-2"
                  style={{ color: linkTextColor }}
                  onClick={(e) => { e.preventDefault(); window.location.hash = '/cv'; setIsOpen(false) }}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    <FileText size={22} />
                    {ns?.resumeText || 'CV'}
                  </span>
                  <ChevronRight
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-5 h-5"
                    style={{ color: linkHoverColor }}
                  />
                </a>
                )}

                <div className="mt-auto pt-8">
                  <div className="flex justify-center">
                    <button
                      onClick={onToggleDark}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                      style={{ backgroundColor: controlBg, color: controlTextColor }}
                      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                    >
                      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
