import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Mail, ChevronRight, MapPin, Phone, Download, Globe, Sun, Moon } from 'lucide-react'
import { useSiteSettings } from '../../shared/context/SiteSettingsContext'
import Logo from '../../shared/components/Logo'
import { getNavigation } from '../../shared/services/navigationService'

const FALLBACK_NAV_IDS = ['home', 'about', 'skills', 'projects', 'contact']

export default function Navbar({ darkMode, onToggleDark }) {
  const { t, i18n } = useTranslation()
  const { settings } = useSiteSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navItems, setNavItems] = useState([])
  const [navError, setNavError] = useState(false)

  useEffect(() => {
    loadNavItems()
  }, [])

  async function loadNavItems() {
    try {
      const res = await getNavigation()
      const items = (res.items || [])
        .filter((item) => item.visible && item.active)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      setNavItems(items)
    } catch {
      setNavError(true)
    }
  }

  const displayNavItems = navItems.length > 0 ? navItems : (navError ? FALLBACK_NAV_IDS.map((id) => ({ _id: id, title: t(`nav.${id}`), sectionId: id, url: `#${id}`, order: 0, visible: true, active: true, isExternal: false, openNewTab: false })) : [])

  const logoImage = settings?.logoImage || ''
  const logoText = settings?.logoText || ''
  const brandName = settings?.brandName || ''
  const nameAmharic = settings?.nameAmharic || ''
  const resumeUrl = settings?.resume?.url || ''
  const resumeButtonText = settings?.resume?.buttonText || ''
  const email = settings?.email || ''
  const phone = settings?.phone || ''
  const socialLinks = settings?.socialLinks || {}

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, item) => {
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
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-[1000] transition-all duration-500 ${
        scrolled 
          ? 'glass-panel py-3 sm:py-4' 
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Logo settings={settings} linkTo="#home" onNavClick={(e) => handleNavClick(e, { sectionId: 'home', url: '#home', isExternal: false, openNewTab: false })} />
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer z-[1001] bg-gray-100 dark:bg-slate-800 rounded-lg sm:rounded-xl hover:bg-primary hover:text-white transition-colors" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label={t('nav.toggleMenu')}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Links + Right Controls */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          <ul className="flex items-center gap-6 lg:gap-10">
            {displayNavItems.map((item, idx) => (
              <motion.li 
                key={item._id || item.sectionId}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx + 0.5 }}
              >
                <a 
                  href={item.url || `#${item.sectionId}`}
                  target={item.openNewTab ? '_blank' : undefined}
                  rel={item.openNewTab ? 'noopener noreferrer' : undefined}
                  className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative group"
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {item.title}
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-0 h-0.5 sm:h-1 bg-primary rounded-full group-hover:w-full transition-all duration-300"
                  />
                </a>
              </motion.li>
            ))}
          </ul>
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Language Toggle */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en')}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-colors text-gray-600 dark:text-gray-300"
              aria-label={i18n.language === 'en' ? t('nav.switchLanguage') : t('nav.switchLanguage_am')}
            >
              <Globe size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="text-[9px] sm:text-[10px] font-bold ml-0.5">{i18n.language === 'en' ? t('nav.en') : t('nav.am')}</span>
            </motion.button>
            {/* Dark Mode Toggle */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDark}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-colors text-gray-600 dark:text-gray-300"
              aria-label={darkMode ? t('nav.switchThemeLight') : t('nav.switchThemeDark')}
            >
              {darkMode ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </motion.button>
            {/* CV Download */}
            <motion.a
              href={resumeUrl || '/resume.pdf'}
              download
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-primary hover:bg-[#4F46E5] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full hover:shadow-lg transition-all shadow-md cursor-pointer"
            >
              <Download size={14} className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-bounce" />
              <span>{resumeButtonText || t('nav.downloadCv')}</span>
            </motion.a>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 150 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white/95 dark:bg-black/95 backdrop-blur-2xl z-[1001] shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10 sm:mb-14 md:mb-16">
                <motion.div 
                  initial={{ scale: 0.5, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                >
                  <Logo settings={settings} showText={false} linkTo={null} />
                </motion.div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)} 
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl text-xl sm:text-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <X size={24} />
                </motion.button>
              </div>
              
              <ul className="flex flex-col gap-6 sm:gap-8 md:gap-10">
                {displayNavItems.map((item, idx) => (
                  <motion.li 
                    key={item._id || item.sectionId}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx, type: 'spring' }}
                  >
                    <a 
                      href={item.url || `#${item.sectionId}`}
                      target={item.openNewTab ? '_blank' : undefined}
                      rel={item.openNewTab ? 'noopener noreferrer' : undefined}
                      className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white hover:text-primary transition-all flex items-center justify-between group font-display tracking-tighter"
                      onClick={(e) => handleNavClick(e, item)}
                    >
                      <span className="group-hover:translate-x-4 transition-transform duration-500">
                        {item.title}
                      </span>
                      <ChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all text-primary duration-500 w-8 h-8 sm:w-10 sm:h-10" />
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto space-y-6 sm:space-y-8">

                  {/* Contact Info Card */}
                  <div className="p-5 sm:p-6 md:p-8 bg-gray-50 dark:bg-neutral-900 rounded-2xl sm:rounded-[1.5rem] border border-gray-200 dark:border-neutral-800">
                    <div className="space-y-4 sm:space-y-5">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-primary" />
                        <span className="text-sm sm:text-base font-bold text-gray-600 dark:text-gray-400">{t('nav.location')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-primary" />
                        <span className="text-sm sm:text-base font-bold text-gray-600 dark:text-gray-400">{phone || '+251 908 720 092'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-primary" />
                        <span className="text-sm sm:text-base font-bold text-gray-600 dark:text-gray-400 break-all">{email || 'desalegnky827@gmail.com'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4 sm:gap-5 md:gap-6">
                    {[
                      { href: socialLinks?.linkedin || 'https://linkedin.com/in/dk-cs-3rd', icon: <Linkedin size={20} /> },
                      { href: socialLinks?.github || 'https://github.com/desalegn-tech', icon: <Github size={20} /> },
                      { href: socialLinks?.telegram || 'https://t.me/Ds35kg', icon: <Telegram size={20} /> }
                    ].map((social, idx) => (
                      <motion.a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-neutral-900 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                      >
                        {social.icon}
                      </motion.a>
                    ))}
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
