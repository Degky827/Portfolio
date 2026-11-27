import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Heart, ChevronRight, ArrowUp } from 'lucide-react'
import { FaGithub, FaLinkedin, FaTelegram, FaYoutube } from 'react-icons/fa6'
import { getFooterContent } from '../../shared/services/footerService'
import { getNavbarSettings } from '../../shared/services/navigationService'
import { useSiteSettings } from '../../shared/context/SiteSettingsContext'
import { useSocketRefresh } from '../../shared/hooks/useSocketRefresh'
import Logo from '../../shared/components/Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { settings } = useSiteSettings()
  const [content, setContent] = useState(null)
  const [ns, setNs] = useState(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  const fetchFooterContent = useCallback(() => {
    getFooterContent()
      .then(({ content }) => setContent(content))
      .catch(() => {})
  }, [])

  const fetchNavbarSettings = useCallback(() => {
    getNavbarSettings()
      .then((res) => setNs(res.settings || null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchFooterContent()
    fetchNavbarSettings()
  }, [fetchFooterContent, fetchNavbarSettings])

  useSocketRefresh('content:updated', fetchFooterContent, { type: 'footer' })
  useSocketRefresh('content:updated', fetchNavbarSettings, { type: 'navbar' })

  const mergedSettings = useMemo(() => ({
    ...settings,
    brandName: ns?.brandName || settings?.brandName || 'Desalegn Kasaye',
  }), [settings, ns])

  const brandName = mergedSettings?.brandName || content?.brandName || 'Desalegn Kasaye'
  const emailAddress = settings?.email || content?.emailAddress || 'desalegnky827@gmail.com'
  const phoneNumber = settings?.phone || content?.phoneNumber || '+251 908 720 092'
  const locationHeadline = content?.locationHeadline || 'Addis Ababa, Ethiopia'

  const quickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/desalegnkasayemuluyekasaye-tech', title: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com', title: 'LinkedIn' },
    { icon: FaTelegram, href: 'https://t.me/Abirsh13', title: 'Telegram' },
    { icon: FaYoutube, href: 'https://youtube.com', title: 'YouTube' },
  ]

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.location.hash = href
    }
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes('@')) return
    setNewsletterSubmitted(true)
    setTimeout(() => {
      setNewsletterEmail('')
      setNewsletterSubmitted(false)
    }, 4000)
  }

  return (
    <footer className="relative w-full py-12 px-3 sm:px-6 bg-[#f1f5f9] dark:bg-[#0b0f17] flex flex-col items-center justify-center transition-colors duration-300">
      {/* ── Outer Monitor Unit Container ── */}
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Top-Mounted Monitor Webcam (matches reference photo) */}
        <div className="relative z-20 flex flex-col items-center -mb-2">
          {/* Webcam body */}
          <div className="w-16 sm:w-20 h-6 sm:h-7 rounded-t-lg bg-[#181a20] border-t border-x border-slate-700/80 shadow-2xl flex items-center justify-between px-3">
            {/* Ambient sensor */}
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800 ring-1 ring-slate-700" />
            {/* Center camera glass lens */}
            <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-600 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]/90 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-300" />
              </div>
            </div>
            {/* Status LED */}
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>
          {/* Webcam monitor mount clip */}
          <div className="w-10 h-2 bg-[#252833] border-b border-slate-700/90 rounded-b" />
        </div>

        {/* ── Monitor Bezel Frame ── */}
        <div className="relative w-full rounded-[2rem] border-[3px] border-[#1e232d] bg-white dark:bg-[#0f141f] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.1)] overflow-hidden">
          {/* ══════════════════════════════════════════════════════
              UPPER SECTION (White background matching reference)
             ══════════════════════════════════════════════════════ */}
          <div className="pt-10 sm:pt-14 pb-8 sm:pb-10 px-4 sm:px-8 text-center bg-white dark:bg-[#0f141f]">
            {/* Header with decorative flanking lines */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-2xl mx-auto mb-2">
              <div className="h-[1px] flex-1 bg-slate-300 dark:bg-slate-700" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight shrink-0 font-sans">
                Let's Stay Connected
              </h2>
              <div className="h-[1px] flex-1 bg-slate-300 dark:bg-slate-700" />
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mb-6">
              Follow me for updates and more projects.
            </p>

            {/* Social Icons Row (Black circular pills matching reference) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {socialLinks.map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors"
                    aria-label={item.title}
                    title={item.title}
                  >
                    <Icon size={19} />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              LOWER SECTION (Dark Charcoal Card matching reference)
             ══════════════════════════════════════════════════════ */}
          <div className="mx-3 sm:mx-6 md:mx-8 mb-4 sm:mb-6 rounded-[1.75rem] sm:rounded-[2rem] bg-[#111827] text-white p-6 sm:p-9 md:p-11 shadow-2xl border border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-left">
              {/* ── Column 1: Profile & Initials Badge ── */}
              <div className="flex flex-col items-start">
                {/* Circular "DK" Initials Badge */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/90 flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl tracking-wider mb-4 shadow-sm select-none">
                  DK
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-0.5">
                  {brandName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">
                  Fullstack & Flutter Developer
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Build. Innovate. Inspire.
                </p>
              </div>

              {/* ── Column 2: Quick Links ── */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {quickLinks.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group font-medium cursor-pointer"
                      >
                        <span className="text-slate-500 group-hover:text-white transition-colors">&gt;</span>
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Column 3: Contact Info ── */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  Contact
                </h4>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${emailAddress}`}
                      className="text-slate-400 hover:text-white transition-colors truncate"
                    >
                      {emailAddress}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400 shrink-0" />
                    <a
                      href={`tel:${phoneNumber.replace(/[^+\d]/g, '')}`}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {phoneNumber}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="text-slate-400">{locationHeadline}</span>
                  </li>
                </ul>
              </div>

              {/* ── Column 4: Newsletter ── */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  Newsletter
                </h4>
                <p className="text-xs text-slate-400 mb-3.5">
                  Get the latest updates.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="relative flex items-center w-full max-w-xs">
                  <div className="relative flex items-center w-full rounded-full bg-[#1f2937] border border-slate-700/80 px-4 py-1.5 shadow-inner">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your Email"
                      disabled={newsletterSubmitted}
                      className="bg-transparent text-xs text-white placeholder-slate-400 outline-none flex-1 pr-9"
                    />
                    <button
                      type="submit"
                      disabled={newsletterSubmitted}
                      className="absolute right-1.5 w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
                      title="Subscribe"
                      aria-label="Subscribe to newsletter"
                    >
                      <Send size={12} className="ml-0.5" />
                    </button>
                  </div>
                </form>
                {newsletterSubmitted && (
                  <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                    ✓ Thank you for subscribing!
                  </p>
                )}
              </div>
            </div>

            {/* ── Bottom Divider & Copyright Row ── */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <p>© {currentYear} {brandName}. All rights reserved.</p>
              <p className="flex items-center gap-1">
                <span>Made with</span>
                <Heart size={12} className="text-red-500 fill-red-500 inline" />
                <span>by {brandName.split(' ')[0]}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
