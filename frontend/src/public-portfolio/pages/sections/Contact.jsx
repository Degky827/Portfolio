import { useState, useRef, useEffect, Suspense, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, Send, MapPin, Globe } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { logPortfolioVisit, logPortfolioEngagement } from '../../../shared/services/api'
import { getContactContent, createMessage } from '../../../shared/services/contactService'
import { getSettings } from '../../../shared/services/settingsService'
import { useSocketRefresh } from '../../../shared/hooks/useSocketRefresh'
import GeodesicOrbScene3D from '../../../components/contact3d/GeodesicOrbScene3D'
import GuillocheWaves from '../../components/ui/GuillocheWaves'

// LinkedIn SVG Icon (Pixel-accurate 'in' logo)
const LinkedinIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
)

// GitHub SVG Icon (Silhouette octocat logo)
const GithubIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

// Telegram SVG Icon
const TelegramIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
)

// YouTube SVG Icon (Clean play badge)
const YoutubeIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

// 3D Physical Claymorphic Info Card with Layered Z-Depth and Real Raised 3D Podium Showing 3D Sides
function ContactInfoCard3D({ icon: Icon, title, subtitle, href }) {
  const cardRef = useRef(null)
  const [rotX, setRotX] = useState(0)
  const [rotY, setRotY] = useState(0)
  const [isHover, setIsHover] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setRotX(-(y / (rect.height / 2)) * 14)
    setRotY((x / (rect.width / 2)) * 14)
  }

  const handleMouseLeave = () => {
    setRotX(0)
    setRotY(0)
    setIsHover(false)
  }

  const content = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotX,
        rotateY: rotY,
        y: isHover ? -6 : 0,
        scale: isHover ? 1.03 : 1,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 800,
        background: 'linear-gradient(160deg, #ffffff 0%, #edf1f7 100%)',
        borderRadius: '1.25rem',
        boxShadow: isHover
          ? `0 5px 0 #cfd8e5,
             3px 6px 0 #c2cee0,
             -1px 4px 0 #dbe4ef,
             0 12px 24px rgba(145, 165, 190, 0.45),
             -8px -8px 20px rgba(255, 255, 255, 0.98),
             inset 1px 1px 2px #ffffff`
          : `0 3.5px 0 #d9e2ee,
             2px 4px 0 #cdd8e6,
             -1px 3px 0 #e4ecf6,
             0 7px 16px rgba(155, 172, 195, 0.35),
             -6px -6px 14px rgba(255, 255, 255, 0.95),
             inset 1px 1px 2px #ffffff`,
        border: '1px solid rgba(255, 255, 255, 0.9)',
      }}
      className="relative py-3.5 px-2.5 sm:px-3 flex flex-col items-center justify-center text-center cursor-pointer select-none group h-full"
    >
      {/* 3D Raised Circular Button / Podium with Visible Extruded 3D Sides */}
      <div
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-transform duration-300"
        style={{
          transform: 'translateZ(26px)',
          background: 'linear-gradient(145deg, #ffffff 0%, #e9edf4 100%)',
          boxShadow: `
            0 3px 0 #cfd9e7,
            2px 3.5px 0 #c2cee0,
            -1px 2px 0 #d9e3ee,
            2px 5px 9px rgba(150, 168, 192, 0.4),
            -2px -2px 6px rgba(255, 255, 255, 0.95),
            inset 1px 1px 2px #ffffff,
            inset -1px -1px 2px rgba(160, 175, 195, 0.25)
          `,
          border: '1px solid rgba(255, 255, 255, 0.95)',
        }}
      >
        <Icon size={19} className="text-[#1e2530] transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
      </div>

      {/* Title with Elevated 3D Depth */}
      <span
        className="text-xs font-bold text-[#111827] tracking-tight block transition-transform duration-300"
        style={{ transform: 'translateZ(18px)' }}
      >
        {title}
      </span>

      {/* Subtitle with Elevated 3D Depth */}
      <span
        className="text-[10px] sm:text-[11px] text-[#4b5563] font-medium mt-0.5 leading-tight truncate max-w-full block transition-transform duration-300 px-1"
        style={{ transform: 'translateZ(12px)' }}
      >
        {subtitle}
      </span>
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} className="block h-full">
        {content}
      </a>
    )
  }

  return content
}

// 3D Physical Cylinder Social Coin Button Standing Upright on Floor with Visible Sides
function SocialCoinButton3D({ icon: Icon, name, url }) {
  const [isHover, setIsHover] = useState(false)

  return (
    <div className="relative flex flex-col items-center select-none" style={{ perspective: 700 }}>
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        animate={{
          y: isHover ? -8 : 0,
          rotateX: isHover ? 12 : 0,
          scale: isHover ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        style={{
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(150deg, #ffffff 10%, #eef3f9 90%)',
          boxShadow: isHover
            ? `0 4.5px 0 #cfd9e6,
               2px 5px 0 #c1cde0,
               -1px 3px 0 #dbe4ef,
               0 12px 20px rgba(140, 160, 185, 0.5),
               -5px -5px 12px rgba(255, 255, 255, 0.98),
               inset 0 1.5px 2px #ffffff,
               inset 0 -2px 3px rgba(160, 175, 195, 0.3)`
            : `0 3.5px 0 #d8e2ee,
               1.5px 4px 0 #cbd7e6,
               -1px 2.5px 0 #e4ecf6,
               0 7px 14px rgba(150, 170, 195, 0.4),
               -4px -4px 10px rgba(255, 255, 255, 0.95),
               inset 0 1.5px 2px #ffffff,
               inset 0 -2px 3px rgba(160, 175, 195, 0.25)`,
          border: '1px solid rgba(255, 255, 255, 0.9)',
        }}
        className="relative z-10 w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-[#1e2530] hover:text-black cursor-pointer"
        title={name}
        aria-label={name}
      >
        <span
          style={{ transform: 'translateZ(12px)' }}
          className="block drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]"
        >
          <Icon size={20} />
        </span>
      </motion.a>

      {/* Dynamic 3D Ground Contact Shadow directly under the coin */}
      <div className="relative w-full flex flex-col items-center pointer-events-none mt-1">
        {/* Sharp Contact Shadow right where the base touches the floor */}
        <motion.div
          animate={{
            scaleX: isHover ? 0.85 : 1,
            scaleY: isHover ? 0.7 : 1,
            opacity: isHover ? 0.35 : 0.65,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-9 h-1.5 rounded-[50%] blur-[1px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.75) 0%, rgba(51, 65, 85, 0.3) 60%, transparent 80%)' }}
        />
        {/* Soft Ambient Diffuse Floor Shadow */}
        <motion.div
          animate={{
            scaleX: isHover ? 1.25 : 1,
            scaleY: isHover ? 1.3 : 1,
            opacity: isHover ? 0.25 : 0.45,
            y: isHover ? 2 : 0,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-12 h-2.5 rounded-[50%] blur-[3px] -mt-1"
          style={{ background: 'radial-gradient(ellipse at center, rgba(100, 116, 139, 0.4) 0%, transparent 75%)' }}
        />
      </div>
    </div>
  )
}

function validate(values) {
  const errors = {}
  const name = (values.from_name || '').trim()
  const email = (values.reply_to || '').trim()
  const phone = (values.phone || '').trim()
  const message = (values.message || '').trim()

  if (!name) {
    errors.from_name = 'Full name is required'
  } else if (name.length < 2) {
    errors.from_name = 'Name must be at least 2 characters'
  }

  if (!email) {
    errors.reply_to = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.reply_to = 'Please enter a valid email'
  }

  if (phone && !/^[+]?[\d\s\-()]{7,20}$/.test(phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  if (!message) {
    errors.message = 'Message is required'
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }

  return errors
}

export default function Contact() {
  const form = useRef()
  const [result, setResult] = useState('')
  const [resultType, setResultType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState(null)

  const [values, setValues] = useState({ from_name: '', reply_to: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [contactFormEnabled, setContactFormEnabled] = useState(true)

  const fetchContactContent = useCallback(() => {
    getContactContent()
      .then(({ content }) => setContent(content))
      .catch(() => {})
  }, [])

  const fetchSettings = useCallback(() => {
    getSettings()
      .then(({ settings }) => {
        if (settings?.enableContactForm !== undefined) {
          setContactFormEnabled(settings.enableContactForm)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchContactContent()
    fetchSettings()
  }, [fetchContactContent, fetchSettings])

  useSocketRefresh('content:updated', fetchContactContent, { type: 'contact' })
  useSocketRefresh('content:updated', fetchSettings, { type: 'settings' })

  const validationErrors = validate(values)
  const isValid = Object.keys(validationErrors).length === 0

  const handleChange = (field) => (e) => {
    const val = e.target.value
    setValues((prev) => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldErrors = validate({ ...values, [field]: values[field] })
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
    }
  }

  const fieldError = (field) => {
    if (!touched[field]) return ''
    return errors[field] || validationErrors[field] || ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setTouched({ from_name: true, reply_to: true, phone: true, message: true })
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    setResult('')

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    const name = values.from_name.trim()
    const email = values.reply_to.trim()
    const phone = values.phone.trim()
    const message = values.message.trim()

    const emailTo = content?.email || 'desalegnky827@gmail.com'

    let saved = false
    try {
      await createMessage({ name, email, phone, message })
      setResult('Message sent successfully! I will get back to you soon.')
      setResultType('success')
      saved = true
    } catch {
      saved = false
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      logPortfolioEngagement({ action: 'contact_submit', page: window.location.pathname })
      logPortfolioVisit({ viewerName: name, page: window.location.pathname })
      if (!saved) {
        const mailtoLink = `mailto:${emailTo}?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`)}`
        window.location.href = mailtoLink
        setResult('Opening your email client...')
        setResultType('success')
      }
      setIsSubmitting(false)
      return
    }

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      logPortfolioEngagement({ action: 'contact_submit', page: window.location.pathname })
      setResult('Message sent successfully! I will get back to you soon.')
      setResultType('success')
      setValues({ from_name: '', reply_to: '', phone: '', message: '' })
      setTouched({})
      setErrors({})
      e.target.reset()
    } catch (error) {
      console.error('EmailJS error:', error)
      logPortfolioEngagement({ action: 'contact_submit', page: window.location.pathname })
      if (saved) {
        setResult('Message sent successfully! I will get back to you soon.')
        setResultType('success')
        setValues({ from_name: '', reply_to: '', phone: '', message: '' })
        setTouched({})
        setErrors({})
        e.target.reset()
      } else {
        const mailtoLink = `mailto:${emailTo}?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`)}`
        window.location.href = mailtoLink
        setResult('Opening your email client...')
        setResultType('success')
      }
    }

    setIsSubmitting(false)
  }

  // Location, Email, and Phone data
  const locationText = content?.location || 'Addis Ababa, Ethiopia'
  const emailText = content?.email || 'example@domain.com'
  const phoneText = content?.phone || '+251 912 345 678'

  // Social Links
  const socials = [
    { name: 'LinkedIn', icon: LinkedinIcon, url: content?.socialLinks?.linkedin || 'https://linkedin.com' },
    { name: 'GitHub', icon: GithubIcon, url: content?.socialLinks?.github || 'https://github.com' },
    { name: 'Telegram', icon: TelegramIcon, url: content?.socialLinks?.telegram || 'https://t.me/desalegnky' },
    { name: 'YouTube', icon: YoutubeIcon, url: content?.socialLinks?.youtube || 'https://youtube.com' },
  ]

  return (
    <section
      id="contact"
      className="relative min-h-screen py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden select-none"
      aria-label="Contact section"
    >
      {/* ── Monochromatic Purple Guilloche Ribbon Wave Background (matching other pages) ── */}
      <GuillocheWaves className="absolute inset-0 z-0 opacity-45 dark:opacity-35 pointer-events-none" />

      {/* ── Ambient Background Glow Orbs (matching About, Skills, Experience, and Projects) ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-700/15 dark:bg-slate-800/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-slate-800/10 dark:bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#2C3539]/10 dark:bg-black/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 w-full">
        {/* ── Header with 3D Extruded Title: "Let's collaborate!" (Matching other pages) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          {/* 3D Extruded Title: Let's collaborate! */}
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-wider uppercase font-sans select-none transition-transform duration-300 hover:scale-[1.02] text-[#1E252B] dark:text-[#E2E8F0]"
            style={{
              textShadow: `
                0 1px 0 #64748b,
                0 2px 0 #475569,
                0 3px 0 #334155,
                0 4px 0 #1e293b,
                0 5px 0 #1e252b,
                0 6px 1px rgba(0, 0, 0, 0.3),
                0 8px 18px rgba(30, 37, 43, 0.4)
              `,
            }}
          >
            Let&apos;s collaborate!
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 font-normal">
            {content?.subtitle || "Have a 3D project or enterprise initiative in mind? Let's bring it to life together."}
          </p>

          {/* Decorative Diamond Accent Line: <> ◇ <> matching other pages */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
            <div className="w-2.5 h-2.5 rotate-45 border-2 border-[#36454F] dark:border-slate-300 shadow-[0_0_12px_rgba(54,69,79,0.6)] dark:shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
            <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
          </div>
        </motion.div>

        {/* ── Symmetrical 2-Column Stage (Equal Length and Width) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* ══════════════════════════════════════════════════════════════
              LEFT SIDE: Pure Claymorphic / Neumorphic Contact Form Card
              ══════════════════════════════════════════════════════════════ */}
          <div className="w-full flex justify-center h-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full rounded-[2.25rem] p-6 sm:p-8 flex flex-col justify-between bg-[#f4f6f9] dark:bg-[#1e232d] text-slate-900 dark:text-white"
              style={{
                boxShadow: `
                  14px 14px 32px rgba(166, 180, 200, 0.45),
                  -14px -14px 32px rgba(255, 255, 255, 0.95),
                  inset 1px 1px 2px rgba(255, 255, 255, 0.8),
                  inset -1px -1px 2px rgba(166, 180, 200, 0.2)
                `,
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}
            >
              <div>
                {/* Top Accent Subtitle with Horizontal Line */}
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-8 h-[2px] bg-slate-500 rounded-full" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                    Get In Touch
                  </span>
                </div>

                {/* Main Headline */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1.5">
                  Contact Me
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 font-medium">
                  {content?.subtitle || "Have a 3D project in mind? Let's bring it to life together."}
                </p>
              </div>

              {/* Form Element */}
              <form ref={form} onSubmit={handleSubmit} className="space-y-3.5 flex-1 flex flex-col justify-between" noValidate>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div
                    className="flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 bg-[#ebf0f5] dark:bg-[#161a23]"
                    style={{
                      boxShadow: `
                        inset 3px 3px 6px rgba(166, 180, 200, 0.45),
                        inset -3px -3px 6px rgba(255, 255, 255, 0.9)
                      `,
                    }}
                  >
                    <User size={16} className="text-slate-500 dark:text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      name="from_name"
                      value={values.from_name}
                      onChange={handleChange('from_name')}
                      onBlur={handleBlur('from_name')}
                      placeholder="e.g. John Doe"
                      className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-none"
                    />
                  </div>
                  {fieldError('from_name') && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 ml-2">{fieldError('from_name')}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div
                    className="flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 bg-[#ebf0f5] dark:bg-[#161a23]"
                    style={{
                      boxShadow: `
                        inset 3px 3px 6px rgba(166, 180, 200, 0.45),
                        inset -3px -3px 6px rgba(255, 255, 255, 0.9)
                      `,
                    }}
                  >
                    <Mail size={16} className="text-slate-500 dark:text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type="email"
                      name="reply_to"
                      value={values.reply_to}
                      onChange={handleChange('reply_to')}
                      onBlur={handleBlur('reply_to')}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-none"
                    />
                  </div>
                  {fieldError('reply_to') && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 ml-2">{fieldError('reply_to')}</p>
                  )}
                </div>

                {/* Phone Number (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                    Phone Number <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <div
                    className="flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 bg-[#ebf0f5] dark:bg-[#161a23]"
                    style={{
                      boxShadow: `
                        inset 3px 3px 6px rgba(166, 180, 200, 0.45),
                        inset -3px -3px 6px rgba(255, 255, 255, 0.9)
                      `,
                    }}
                  >
                    <Phone size={16} className="text-slate-500 dark:text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type="tel"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      placeholder="e.g. +1 (555) 123-4567"
                      className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-none"
                    />
                  </div>
                  {fieldError('phone') && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 ml-2">{fieldError('phone')}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <div
                    className="px-3.5 py-2.5 rounded-xl transition-all duration-200 bg-[#ebf0f5] dark:bg-[#161a23]"
                    style={{
                      boxShadow: `
                        inset 3px 3px 6px rgba(166, 180, 200, 0.45),
                        inset -3px -3px 6px rgba(255, 255, 255, 0.9)
                      `,
                    }}
                  >
                    <textarea
                      name="message"
                      rows={3}
                      value={values.message}
                      onChange={handleChange('message')}
                      onBlur={handleBlur('message')}
                      placeholder="Write your message here..."
                      className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-none resize-none"
                    />
                  </div>
                  {fieldError('message') && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 ml-2">{fieldError('message')}</p>
                  )}
                </div>

                {/* Submission Feedback Message */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`p-2.5 rounded-xl text-xs font-bold text-center ${
                        resultType === 'success'
                          ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100/90 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {result}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Send Message Button (Dark Claymorphic Pill) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1 py-3 px-6 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md"
                  style={{
                    background: 'linear-gradient(145deg, #2b313a, #1a1e24)',
                    boxShadow: `
                      5px 5px 14px rgba(30, 41, 59, 0.35),
                      -2px -2px 6px rgba(255, 255, 255, 0.4),
                      inset 0 1px 1px rgba(255, 255, 255, 0.2)
                    `,
                  }}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </motion.div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT SIDE: 3D Geodesic Orb & Contact Info / Social Pills
              ══════════════════════════════════════════════════════════════ */}
          <div className="w-full flex flex-col justify-between h-full pl-0 lg:pl-4">
            {/* 3D Geodesic Metallic Orb Scene (Equal vertical balance) */}
            <div className="w-full h-[220px] sm:h-[240px] lg:h-[250px] relative flex items-center justify-center overflow-visible mb-1">
              <Suspense
                fallback={
                  <div className="w-36 h-36 rounded-full bg-slate-200/60 animate-pulse flex items-center justify-center" />
                }
              >
                <GeodesicOrbScene3D className="w-full h-full" />
              </Suspense>
            </div>

            {/* Contact Information Block */}
            <div className="w-full text-left pt-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight mb-1">
                  Contact Information
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] dark:text-slate-300 font-medium leading-relaxed mb-4">
                  Feel free to reach out. I&apos;m always open to collaborations, project inquiries, or just to say hello!
                </p>
              </div>

              {/* 3 Minimized Soft Clay Neumorphic 3D Interactive Cards with Visible 3D Sides */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {/* Location Card */}
                <ContactInfoCard3D
                  icon={MapPin}
                  title="Location"
                  subtitle={locationText}
                />

                {/* Email Card */}
                <ContactInfoCard3D
                  icon={Mail}
                  title="Email"
                  subtitle={emailText}
                  href={`mailto:${emailText}`}
                />

                {/* Phone Card */}
                <ContactInfoCard3D
                  icon={Phone}
                  title="Phone"
                  subtitle={phoneText}
                  href={`tel:${phoneText.replace(/\s+/g, '')}`}
                />
              </div>

              {/* Follow Me Divider */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-[1.5px] bg-[#9ca3af]/40 dark:bg-slate-600/50" />
                <span className="text-xs font-bold text-[#374151] dark:text-slate-300 tracking-wide">
                  Follow Me
                </span>
                <div className="flex-1 h-[1.5px] bg-[#9ca3af]/40 dark:bg-slate-600/50" />
              </div>

              {/* Social 3D Cylinder / Coin Buttons on Floor with true 3D Depth & Sides */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 pt-0.5 pb-2">
                {socials.map((s, i) => (
                  <SocialCoinButton3D
                    key={i}
                    icon={s.icon}
                    name={s.name}
                    url={s.url}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
