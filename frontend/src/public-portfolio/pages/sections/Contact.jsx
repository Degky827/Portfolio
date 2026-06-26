import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { logPortfolioVisit, logPortfolioEngagement } from '../../../shared/services/api'
import { getContactContent, createMessage } from '../../../shared/services/contactService'
import { getSettings } from '../../../shared/services/settingsService'

const ContactScene = lazy(() => import('../../../components/contact3d/ContactScene'))
const FuturisticPanel = lazy(() => import('../../../components/contact3d/FuturisticPanel'))
const InteractiveIcon3D = lazy(() => import('../../../components/contact3d/InteractiveIcon3D'))

function SocialIcon({ iconVector, size = 18, className = '' }) {
  if (!iconVector) return null
  return (
    <span className={className} style={{ width: size, height: size }} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: iconVector.replace(/width="[^"]*"/, `width="${size}"`).replace(/height="[^"]*"/, `height="${size}"`) }}
    />
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
  const { t } = useTranslation()

  const [values, setValues] = useState({ from_name: '', reply_to: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [contactFormEnabled, setContactFormEnabled] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getContactContent()
        setContent(content)
      } catch {
        // fall back to hardcoded
      }
    })()
    ;(async () => {
      try {
        const { settings } = await getSettings()
        if (settings?.enableContactForm !== undefined) {
          setContactFormEnabled(settings.enableContactForm)
        }
      } catch {
        // default to enabled
      }
    })()
  }, [])

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

  const inputClass = (field) =>
    `w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 dark:bg-black/30 border-2 ${
      fieldError(field) ? 'border-red-400 dark:border-red-500' : 'border-transparent focus:border-primary'
    } focus:bg-white dark:focus:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] xl:rounded-[2rem] outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-sm sm:text-base shadow-sm`

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
      setResult(t('contact.successMessage'))
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
        setResult(t('contact.mailtoFallback'))
        setResultType('success')
      }
      setIsSubmitting(false)
      return
    }

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      logPortfolioEngagement({ action: 'contact_submit', page: window.location.pathname })
      setResult(t('contact.successMessage'))
      setResultType('success')
      setValues({ from_name: '', reply_to: '', phone: '', message: '' })
      setTouched({})
      setErrors({})
      e.target.reset()
    } catch (error) {
      console.error('EmailJS error:', error)
      logPortfolioEngagement({ action: 'contact_submit', page: window.location.pathname })
      if (saved) {
        setResult(t('contact.successMessage'))
        setResultType('success')
        setValues({ from_name: '', reply_to: '', phone: '', message: '' })
        setTouched({})
        setErrors({})
        e.target.reset()
      } else {
        const mailtoLink = `mailto:${emailTo}?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`)}`
        window.location.href = mailtoLink
        setResult(t('contact.mailtoFallback'))
        setResultType('success')
      }
    }

    setIsSubmitting(false)
  }

  const contactInfo = [
    { icon: <Mail size={20} aria-hidden="true" />, label: t('contact.labelEmail'), value: content?.email || 'desalegnky827@gmail.com', href: `mailto:${content?.email || 'desalegnky827@gmail.com'}`, color: '#3b82f6' },
    { icon: <Phone size={20} aria-hidden="true" />, label: t('contact.labelPhone'), value: content?.phone || '+251 908720092', href: `tel:${content?.phone || '+251908720092'}`, color: '#22c55e' },
    { icon: <MapPin size={20} aria-hidden="true" />, label: t('contact.labelLocation'), value: content?.address || 'Bahirdar, Ethiopia', href: content?.mapLink || null, color: '#f59e0b' }
  ]

  const socialChannels = (content?.socialChannels || []).slice().sort((a, b) => a.displayWeight - b.displayWeight)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  }

  const heroRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      setMousePos({ x, y })
    }
    const el = heroRef.current
    if (el) el.addEventListener('mousemove', handleMouseMove)
    return () => { if (el) el.removeEventListener('mousemove', handleMouseMove) }
  }, [])

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-500 relative overflow-hidden" aria-label={t('contact.ariaLabel')}>

      <div className="container mx-auto px-4 sm:px-6">
        {/* 3D Hero Section */}
        <div ref={heroRef} className="relative mb-16 sm:mb-20 md:mb-28">
          <Suspense fallback={null}>
            <ContactScene>
              <div className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[540px] flex flex-col items-center justify-center py-12 sm:py-16">
                {/* Floating glass badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative mb-6 sm:mb-8"
                  style={{
                    transform: `perspective(800px) rotateY(${mousePos.x * 3}deg) rotateX(${-mousePos.y * 3}deg)`,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    {/* Glow behind badge */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />

                    {/* Badge body */}
                    <div className="relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border border-primary/30 backdrop-blur-xl bg-white/[0.06] shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.08) 50%, rgba(139,92,246,0.1) 100%)',
                        }}
                      />
                      {/* Neon ring */}
                      <motion.div
                        className="absolute inset-[-1px] rounded-full"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          background: 'conic-gradient(from 0deg, rgba(99,102,241,0.4), rgba(6,182,212,0.3), rgba(139,92,246,0.4), rgba(99,102,241,0.4))',
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'exclude',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          padding: '1px',
                        }}
                      />
                      <span className="relative z-10 text-xs sm:text-sm font-bold tracking-[0.25em] text-primary/90 uppercase">
                        {t('contact.badge')}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Layered 3D Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative text-center mb-4 sm:mb-6"
                  style={{
                    transform: `perspective(1000px) rotateY(${mousePos.x * 2}deg) rotateX(${-mousePos.y * 2}deg)`,
                  }}
                >
                  {/* Depth shadow layers */}
                  <h2
                    className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight select-none pointer-events-none"
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(99,102,241,0.08)',
                      transform: 'translateZ(-20px) scale(1.02)',
                      filter: 'blur(2px)',
                    }}
                    aria-hidden="true"
                  >
                    {t('contact.title')}
                  </h2>
                  <h2
                    className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight select-none pointer-events-none"
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(6,182,212,0.12)',
                      transform: 'translateZ(-10px) scale(1.01)',
                      filter: 'blur(1px)',
                    }}
                    aria-hidden="true"
                  >
                    {t('contact.title')}
                  </h2>

                  {/* Main title */}
                  <motion.h2
                    className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-transparent bg-clip-text"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 30%, #a78bfa 60%, #22d3ee 100%)',
                      backgroundSize: '200% 200%',
                      textShadow: '0 0 60px rgba(99,102,241,0.3), 0 0 120px rgba(6,182,212,0.15)',
                    }}
                  >
                    {t('contact.title')}
                  </motion.h2>

                  {/* Animated glow behind text */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
                      filter: 'blur(30px)',
                    }}
                  />
                </motion.div>

                {/* Holographic subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4 text-center"
                  style={{
                    transform: `perspective(800px) rotateY(${mousePos.x * 1}deg)`,
                  }}
                >
                  <motion.span
                    className="text-gray-500/90 dark:text-white/60"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {t('contact.description')}
                  </motion.span>
                </motion.p>

                {/* Floating light rays */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      animate={{
                        y: [-20, 20, -20],
                        opacity: [0.03, 0.06, 0.03],
                        rotate: [15 + i * 10, 20 + i * 10, 15 + i * 10],
                      }}
                      transition={{
                        duration: 6 + i * 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 1.5,
                      }}
                      style={{
                        left: `${20 + i * 25}%`,
                        top: '10%',
                        width: '2px',
                        height: '80%',
                        background: `linear-gradient(to bottom, transparent, ${i === 0 ? 'rgba(99,102,241,0.15)' : i === 1 ? 'rgba(6,182,212,0.12)' : 'rgba(139,92,246,0.1)'}, transparent)`,
                        filter: 'blur(4px)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </ContactScene>
          </Suspense>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] shadow-sm max-w-5xl lg:max-w-6xl mx-auto overflow-hidden relative"
        >
          <div className={`grid relative z-10 ${contactFormEnabled ? 'lg:grid-cols-5' : 'lg:grid-cols-1'}`}>
            {/* Contact Info Sidebar - Futuristic Control Station */}
            <motion.div
              variants={itemVariants}
              className={`${contactFormEnabled ? 'lg:col-span-2' : 'lg:col-span-1'} p-4 sm:p-5 md:p-6 relative`}
            >
              <Suspense fallback={null}>
                <FuturisticPanel className="h-full">
                  <div className="p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16">
                    <div className="relative z-10">
                      {/* Title with glow */}
                      <motion.h3
                        className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 leading-tight font-display tracking-tight text-white"
                        animate={{
                          textShadow: [
                            '0 0 20px rgba(99,102,241,0.3)',
                            '0 0 40px rgba(99,102,241,0.5)',
                            '0 0 20px rgba(99,102,241,0.3)',
                          ],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        {t('contact.connectTitle')}
                      </motion.h3>

                      {/* Decorative line */}
                      <motion.div
                        className="w-16 h-0.5 mb-6 sm:mb-8"
                        animate={{
                          width: ['4rem', '6rem', '4rem'],
                          background: [
                            'linear-gradient(90deg, rgba(99,102,241,0.6), rgba(6,182,212,0.3))',
                            'linear-gradient(90deg, rgba(6,182,212,0.6), rgba(139,92,246,0.3))',
                            'linear-gradient(90deg, rgba(99,102,241,0.6), rgba(6,182,212,0.3))',
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />

                      <p className="text-base sm:text-lg md:text-xl text-white/60 mb-10 sm:mb-12 md:mb-14 leading-relaxed">
                        {t('contact.connectDescription')}
                      </p>

                      {/* Contact info - Interactive 3D icons */}
                      <div className="space-y-6 sm:space-y-8 md:space-y-10 mb-10 sm:mb-12 md:mb-14">
                        {contactInfo.map((info, index) => (
                          <InteractiveIcon3D
                            key={index}
                            icon={info.icon}
                            label={info.label}
                            value={info.value}
                            href={info.href}
                            color={info.color}
                          />
                        ))}
                      </div>

                      {/* Social channels - Interactive 3D icons */}
                      {socialChannels.length > 0 && (
                        <div>
                          <span className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/30 mb-4 sm:mb-5">
                            Social Channels
                          </span>
                          <div className="space-y-4 sm:space-y-5" role="list" aria-label={t('contact.socialAriaLabel')}>
                            {socialChannels.map((ch) => (
                              <InteractiveIcon3D
                                key={ch._id || ch.channelName}
                                icon={null}
                                label={ch.channelName}
                                value={ch.channelName}
                                href={ch.linkUrl}
                                color="#a78bfa"
                                channelName={ch.channelName}
                                socialIconComponent={
                                  ch.iconVector ? (
                                    <SocialIcon iconVector={ch.iconVector} size={20} className="text-current" />
                                  ) : (
                                    <span className="text-xs font-bold uppercase">{ch.channelName?.charAt(0)}</span>
                                  )
                                }
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </FuturisticPanel>
              </Suspense>
            </motion.div>

            {/* Contact Form */}
            {contactFormEnabled && (
              <motion.div variants={itemVariants} className="lg:col-span-3 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
                <form ref={form} className="space-y-6 sm:space-y-8" onSubmit={handleSubmit} noValidate aria-label={t('contact.formAriaLabel')}>
                  {/* Full Name */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="from_name" className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/70 dark:text-primary/60 ml-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary" aria-hidden="true">
                        <User size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <input
                        id="from_name"
                        name="from_name"
                        type="text"
                        value={values.from_name}
                        onChange={handleChange('from_name')}
                        onBlur={handleBlur('from_name')}
                        placeholder="e.g. John Doe"
                        className={inputClass('from_name')}
                      />
                    </div>
                    {fieldError('from_name') && <p className="text-xs text-red-500 dark:text-red-400 ml-1">{fieldError('from_name')}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="reply_to" className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/70 dark:text-primary/60 ml-1">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary" aria-hidden="true">
                        <Mail size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <input
                        id="reply_to"
                        name="reply_to"
                        type="email"
                        value={values.reply_to}
                        onChange={handleChange('reply_to')}
                        onBlur={handleBlur('reply_to')}
                        placeholder="e.g. john@example.com"
                        className={inputClass('reply_to')}
                      />
                    </div>
                    {fieldError('reply_to') && <p className="text-xs text-red-500 dark:text-red-400 ml-1">{fieldError('reply_to')}</p>}
                  </div>

                  {/* Phone (optional) */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="phone" className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/70 dark:text-primary/60 ml-1">
                      Phone Number <span className="text-gray-400 dark:text-gray-500 text-[10px]">(optional)</span>
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary" aria-hidden="true">
                        <Phone size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        placeholder="e.g. +1 (555) 123-4567"
                        className={inputClass('phone')}
                      />
                    </div>
                    {fieldError('phone') && <p className="text-xs text-red-500 dark:text-red-400 ml-1">{fieldError('phone')}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="message" className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/70 dark:text-primary/60 ml-1">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 sm:left-5 top-5 sm:top-6 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary" aria-hidden="true">
                        <MessageSquare size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <textarea
                        id="message"
                        name="message"
                        value={values.message}
                        onChange={handleChange('message')}
                        onBlur={handleBlur('message')}
                        rows="5"
                        placeholder="Write your message here..."
                        className={`${inputClass('message')} resize-none`}
                      />
                    </div>
                    {fieldError('message') && <p className="text-xs text-red-500 dark:text-red-400 ml-1">{fieldError('message')}</p>}
                  </div>

                  {/* Result Message */}
                  <AnimatePresence>
                    {result && (
                      <motion.div
                        id="form-message"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold text-center ${resultType === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}
                        role="alert"
                        aria-live="polite"
                      >
                        {result}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    whileHover={isValid ? { scale: 1.02, translateY: -2 } : {}}
                    whileTap={isValid ? { scale: 0.98 } : {}}
                    className={`w-full py-4 sm:py-5 font-bold sm:font-black text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      isValid && !isSubmitting
                        ? 'bg-primary hover:bg-[#4F46E5] text-white cursor-pointer'
                        : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                    aria-label={isSubmitting ? t('contact.submitAriaSubmitting') : t('contact.submitAriaNormal')}
                  >
                    <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                      {isSubmitting ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-4 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                      ) : (
                        <>
                          {t('contact.submitText')}
                          <motion.span animate={isValid ? { x: [0, 5, 0] } : {}} transition={{ duration: 1.5, repeat: Infinity }} aria-hidden="true">
                            <Send size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                          </motion.span>
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
