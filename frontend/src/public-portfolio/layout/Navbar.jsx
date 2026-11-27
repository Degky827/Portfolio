import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, Sun, Moon, FileText } from 'lucide-react'
import { useSiteSettings } from '../../shared/context/SiteSettingsContext'
import Logo from '../../shared/components/Logo'
import { getNavigation, getNavbarSettings } from '../../shared/services/navigationService'
import { useSocketRefresh } from '../../shared/hooks/useSocketRefresh'
import { resolveNavPath, isNavPathActive } from '../shared/navUtils'

const FALLBACK_NAV_IDS = ['home', 'about', 'skills', 'experience', 'projects', 'contact']

function buildFallbackItems() {
  return [
    { _id: 'home', title: 'Home', sectionId: 'home', url: '/', order: 0, visible: true, active: true },
    { _id: 'about', title: 'About', sectionId: 'about', url: '/about', order: 1, visible: true, active: true },
    { _id: 'experience', title: 'Experience', sectionId: 'experience', url: '/experience', order: 2, visible: true, active: true },
    { _id: 'skills', title: 'Skills', sectionId: 'skills', url: '/skills', order: 3, visible: true, active: true },
    { _id: 'projects', title: 'Work', sectionId: 'projects', url: '/projects', order: 4, visible: true, active: true },
    { _id: 'contact', title: 'Contact', sectionId: 'contact', url: '/contact', order: 5, visible: true, active: true },
  ]
}

export default function Navbar({ darkMode, onToggleDark }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { settings: siteSettings } = useSiteSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navItems, setNavItems] = useState(null)
  const [navLoaded, setNavLoaded] = useState(false)
  const [navbarSettings, setNavbarSettings] = useState(null)
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
    const fallback = buildFallbackItems()
    if (!navLoaded || !navItems || navItems.length === 0) return fallback

    const hasHome = navItems.some((i) => {
      const k = (i.sectionId || i.title || i.url || '').toLowerCase()
      return k === 'home' || k === '/' || k === '#home'
    })
    const hasSkills = navItems.some((i) => {
      const k = (i.sectionId || i.title || i.url || '').toLowerCase()
      return k.includes('skill')
    })
    const hasExp = navItems.some((i) => {
      const k = (i.sectionId || i.title || i.url || '').toLowerCase()
      return k.includes('experience')
    })
    const hasTestimonials = navItems.some((i) => {
      const k = (i.sectionId || i.title || i.url || '').toLowerCase()
      return k.includes('testimonial') || k.includes('recommend')
    })

    let merged = navItems.filter((i) => {
      const k = (i.sectionId || i.title || i.url || '').toLowerCase()
      return (
        !k.includes('testimonial') &&
        !k.includes('recommend')
      )
    })
    if (!hasHome) {
      merged.unshift({ _id: 'home', title: 'Home', sectionId: 'home', url: '/', order: 0, visible: true, active: true })
    }
    if (!hasExp) {
      merged.push({ _id: 'experience', title: 'Experience', sectionId: 'experience', url: '/experience', order: 2, visible: true, active: true })
    }
    if (!hasSkills) {
      merged.push({ _id: 'skills', title: 'Skills', sectionId: 'skills', url: '/skills', order: 3, visible: true, active: true })
    }
    return merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [navItems, navLoaded])

  // ── Active Section Detection (Scroll Spy + Route Detection) ──
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const isRoot = location.pathname === '/' || location.pathname === '/home' || location.pathname === ''
    if (!isRoot) {
      const rawPath = location.pathname.replace(/^\//, '').trim()
      setActiveSection(rawPath || 'home')
      return
    }

    const sectionIds = ['home', 'about', 'experience', 'skills', 'projects', 'contact']
    let ticking = false

    const handleScrollSpy = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const scrollY = window.scrollY
        const navHeight = 90

        if (scrollY < 120) {
          setActiveSection('home')
          return
        }

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
          setActiveSection('contact')
          return
        }

        let current = 'home'
        for (const id of sectionIds) {
          const el = document.getElementById(id) || (id === 'home' ? document.getElementById('hero') : null)
          if (el) {
            const top = el.getBoundingClientRect().top + scrollY - navHeight
            if (scrollY >= top - 60) {
              current = id
            }
          }
        }
        setActiveSection(current)
      })
    }

    window.addEventListener('scroll', handleScrollSpy, { passive: true })
    handleScrollSpy()
    return () => window.removeEventListener('scroll', handleScrollSpy)
  }, [location.pathname])

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
      bgColor: s.bgColor || '#ffffff',
      textColor: s.textColor || '#1f2937',
      hoverColor: s.hoverColor || '#6C2BFF',
      activeLinkColor: s.activeLinkColor || '#6C2BFF',
      borderColor: s.borderColor || 'rgba(0,0,0,0.06)',
      shadowColor: s.shadowColor || 'rgba(108,43,255,0.08)',
      glassmorphism: s.glassmorphism !== false,
      blurEffect: s.blurEffect !== false,
      shadow: s.shadow !== false,
      backdropFilter: s.backdropFilter !== false,
      logoMargin: s.logoMargin ?? 0,
      menuGap: s.menuGap ?? 28,
      navbarPadding: s.navbarPadding ?? 12,
      buttonPadding: s.buttonPadding ?? 10,
      themeEnabled: s.themeEnabled !== false,
      themeMode: s.themeMode || 'auto',
      lightBg: s.lightTheme?.bgColor || '#ffffff',
      lightText: s.lightTheme?.textColor || '#1f2937',
      lightHover: s.lightTheme?.hoverColor || '#6C2BFF',
      darkBg: s.darkTheme?.bgColor || '#1a1a2e',
      darkText: s.darkTheme?.textColor || '#ffffff',
      darkHover: s.darkTheme?.hoverColor || '#8B5CF6',
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
    return settings.hoverColor || '#6C2BFF'
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
  const drawerWidthClass = 'w-full max-w-sm sm:max-w-md'
  const rightControlsGap = Math.round(settings.menuGap / 3)

  const isItemActive = useCallback((item) => {
    const isRoot = location.pathname === '/' || location.pathname === '/home' || location.pathname === ''
    if (!isRoot) {
      const targetPath = resolveNavPath(item)
      return isNavPathActive(targetPath, location.pathname)
    }
    const rawId = (item.sectionId || item.title || '').toLowerCase()
    const mappedId = rawId.includes('home') || rawId === 'hero' ? 'home'
      : rawId.includes('about') ? 'about'
      : rawId.includes('exp') ? 'experience'
      : rawId.includes('skill') ? 'skills'
      : rawId.includes('project') || rawId.includes('work') ? 'projects'
      : rawId.includes('contact') ? 'contact'
      : rawId
    return activeSection === mappedId
  }, [location.pathname, activeSection])

  const handleNavClick = useCallback((e, item) => {
    if (item?.isExternal || item?.openNewTab) return
    e.preventDefault()
    setIsOpen(false)
    if (item?.active === false) return

    const rawId = (item.sectionId || item.title || '').toLowerCase()
    const targetId = rawId.includes('home') || rawId === 'hero' ? 'home'
      : rawId.includes('about') ? 'about'
      : rawId.includes('exp') ? 'experience'
      : rawId.includes('skill') ? 'skills'
      : rawId.includes('project') || rawId.includes('work') ? 'projects'
      : rawId.includes('contact') ? 'contact'
      : rawId

    const isRoot = location.pathname === '/' || location.pathname === '/home' || location.pathname === ''

    if (isRoot) {
      if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setActiveSection('home')
        return
      }

      const el = document.getElementById(targetId) || (targetId === 'home' ? document.getElementById('hero') : null)
      if (el) {
        const navHeight = 72
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
        setActiveSection(targetId)
        return
      }
    }

    // If on a sub-page (e.g. /cv), navigate to root and smooth scroll
    if (targetId === 'home') {
      navigate('/')
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setActiveSection('home')
      }, 50)
      return
    }

    navigate(`/#${targetId}`)
    setTimeout(() => {
      const el = document.getElementById(targetId) || (targetId === 'home' ? document.getElementById('hero') : null)
      if (el) {
        const navHeight = 72
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
        setActiveSection(targetId)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 120)
  }, [location.pathname, navigate])

  const hoverUnderlineStyle = useMemo(() => ({
    backgroundColor: linkHoverColor || '#6C2BFF',
  }), [linkHoverColor])

  const controlBg = useMemo(() => {
    return darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
  }, [darkMode])

  const controlTextColor = useMemo(() => {
    return darkMode ? '#ffffff' : '#374151'
  }, [darkMode])

  const desktopNavItems = useMemo(() => {
    return displayNavItems.filter((i) => i.visible !== false)
  }, [displayNavItems])

  return (
    <motion.nav
      initial={navVariants.initial}
      animate={navVariants.animate}
      transition={{ duration: 0.5 }}
      style={navStyle}
      className={`${positionClass} top-0 z-[1000] transition-[background-color,box-shadow,padding] duration-300 py-3 sm:py-3.5`}
    >
      <div
        className={`${settings.fullWidth ? 'w-full' : 'container'} mx-auto px-4 sm:px-8 flex justify-between items-center`}
        style={settings.fullWidth ? {} : { maxWidth: settings.containerWidth }}
      >
        {/* Top Left Corner: Logo */}
        <div className="shrink-0 flex items-center" style={settings.logoMargin ? { marginLeft: settings.logoMargin + 'px', marginRight: settings.logoMargin + 'px' } : {}}>
          <Logo settings={mergedSettings} linkTo="/" onNavClick={(e) => {
            e.preventDefault()
            if (location.pathname === '/' || location.pathname === '/home') {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              navigate('/')
            }
            setIsOpen(false)
          }} />
        </div>

        {/* Center: Desktop Navigation links */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-6 lg:mx-8">
          <ul
            className="flex items-center"
            style={{ gap: Math.min(settings.menuGap || 28, 28) + 'px' }}
          >
            {desktopNavItems.map((item, idx) => {
              const targetPath = resolveNavPath(item)
              const isActive = isItemActive(item)
              const displayTitle = item.title === 'Projects' ? 'Work' : item.title

              return (
                <motion.li
                  key={item._id || item.sectionId || targetPath}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * idx + 0.15 }}
                >
                  <a
                    href={item.isExternal ? item.url : `#${targetPath}`}
                    target={item.openNewTab ? '_blank' : undefined}
                    rel={item.openNewTab ? 'noopener noreferrer' : undefined}
                    className={`text-sm lg:text-[15px] font-medium transition-colors relative group whitespace-nowrap cursor-pointer pb-1 ${
                      isActive ? 'text-[#6C2BFF] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:text-[#6C2BFF]'
                    }`}
                    style={{
                      color: isActive ? '#6C2BFF' : undefined,
                    }}
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    {displayTitle}
                    {isActive ? (
                      <motion.span
                        layoutId="activeNavLine"
                        className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] rounded-full bg-[#6C2BFF]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    ) : (
                      <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] rounded-full bg-[#6C2BFF]/60 group-hover:w-full transition-all duration-200" />
                    )}
                  </a>
                </motion.li>
              )
            })}
          </ul>
        </div>

        {/* Top Right Corner: Desktop Actions (CV + Theme toggle) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {ns?.resumeEnabled !== false && (
            <a
              href="#/cv"
              onClick={(e) => {
                e.preventDefault()
                navigate('/cv')
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                location.pathname === '/cv'
                  ? 'bg-[#6C2BFF] text-white shadow-sm shadow-[#6C2BFF]/30'
                  : 'text-slate-700 dark:text-slate-200 hover:text-[#6C2BFF] dark:hover:text-[#6C2BFF] bg-slate-100 dark:bg-white/10 hover:bg-[#6C2BFF]/10'
              }`}
              title="View CV / Resume"
            >
              <FileText size={14} className={location.pathname === '/cv' ? 'text-white' : 'text-[#6C2BFF]'} />
              <span>{ns?.resumeText || 'CV'}</span>
            </a>
          )}

          {settings.themeEnabled && (
            <button
              onClick={onToggleDark}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-slate-200/80 dark:border-white/10 hover:border-[#6C2BFF]/50 relative overflow-hidden"
              style={{ backgroundColor: controlBg, color: controlTextColor }}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? 'desktop-dark' : 'desktop-light'}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex items-center justify-center"
                >
                  {darkMode ? (
                    <Sun size={16} className="text-amber-400" />
                  ) : (
                    <Moon size={16} className="text-indigo-400" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          )}
        </div>

        {/* Mobile Controls: CV + Theme toggle + Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {ns?.resumeEnabled !== false && (
            <button
              onClick={() => {
                navigate('/cv')
                setIsOpen(false)
              }}
              className={`h-9 px-2.5 flex items-center gap-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                location.pathname === '/cv'
                  ? 'bg-[#6C2BFF] text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:text-[#6C2BFF]'
              }`}
              style={{ backgroundColor: location.pathname === '/cv' ? '#6C2BFF' : controlBg }}
              aria-label="View CV"
            >
              <FileText size={14} />
              <span>{ns?.resumeText || 'CV'}</span>
            </button>
          )}

          {settings.themeEnabled && (
            <button
              onClick={onToggleDark}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer relative overflow-hidden"
              style={{ backgroundColor: controlBg, color: controlTextColor }}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? 'mob-dark' : 'mob-light'}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex items-center justify-center"
                >
                  {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
                </motion.div>
              </AnimatePresence>
            </button>
          )}
          <button
            className="w-10 h-10 flex items-center justify-center cursor-pointer z-[1002] rounded-lg hover:bg-[#6C2BFF] hover:text-white transition-colors relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            style={{ ...hamburgerBtnStyle, backgroundColor: controlBg }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#6C2BFF] hover:text-white transition-all cursor-pointer"
                    style={{ backgroundColor: controlBg, color: controlTextColor }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <ul className="flex flex-col gap-5">
                  {displayNavItems.map((item, idx) => {
                    const targetPath = resolveNavPath(item)
                    const isActive = isItemActive(item)
                    const displayTitle = item.title === 'Projects' ? 'Work' : item.title

                    return (
                      <motion.li
                        key={item._id || item.sectionId || targetPath}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx, type: 'spring' }}
                      >
                        <a
                          href={item.isExternal ? item.url : `#${targetPath}`}
                          target={item.openNewTab ? '_blank' : undefined}
                          rel={item.openNewTab ? 'noopener noreferrer' : undefined}
                          className="text-xl font-bold transition-all flex items-center justify-between group font-sans tracking-tight cursor-pointer"
                          style={{
                            color: isActive ? '#6C2BFF' : linkTextColor,
                          }}
                          onClick={(e) => handleNavClick(e, item)}
                        >
                          <span className="group-hover:translate-x-2 transition-transform duration-300">
                            {displayTitle}
                          </span>
                          <ChevronRight
                            className={`transition-all duration-300 w-5 h-5 ${isActive ? 'opacity-100 text-[#6C2BFF]' : 'opacity-0 group-hover:opacity-100'}`}
                            style={{ color: isActive ? '#6C2BFF' : linkHoverColor }}
                          />
                        </a>
                      </motion.li>
                    )
                  })}
                </ul>

                {ns?.resumeEnabled !== false && (
                <a
                  href="#/cv"
                  className="text-xl font-bold transition-all flex items-center justify-between group font-sans tracking-tight mt-2 cursor-pointer"
                  style={{ color: location.pathname === '/cv' ? '#6C2BFF' : linkTextColor }}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/cv')
                    setIsOpen(false)
                  }}
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    <FileText size={20} />
                    {ns?.resumeText || 'CV'}
                  </span>
                  <ChevronRight
                    className={`transition-all duration-300 w-5 h-5 ${location.pathname === '/cv' ? 'opacity-100 text-[#6C2BFF]' : 'opacity-0 group-hover:opacity-100'}`}
                    style={{ color: location.pathname === '/cv' ? '#6C2BFF' : linkHoverColor }}
                  />
                </a>
                )}

                <div className="mt-auto pt-6 border-t border-slate-200/60 dark:border-white/10">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {darkMode ? 'Dark Theme' : 'Light Theme'}
                    </span>
                    <button
                      onClick={onToggleDark}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#6C2BFF] hover:text-white transition-all cursor-pointer border border-slate-200/80 dark:border-white/10 relative overflow-hidden"
                      style={{ backgroundColor: controlBg, color: controlTextColor }}
                      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={darkMode ? 'drawer-dark' : 'drawer-light'}
                          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                          animate={{ rotate: 0, scale: 1, opacity: 1 }}
                          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="flex items-center justify-center"
                        >
                          {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-400" />}
                        </motion.div>
                      </AnimatePresence>
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
