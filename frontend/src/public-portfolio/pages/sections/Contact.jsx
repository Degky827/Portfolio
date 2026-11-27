import { useState, useRef, useEffect, lazy, Suspense, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, User, MessageSquare } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { logPortfolioVisit, logPortfolioEngagement } from '../../../shared/services/api'
import { getContactContent, createMessage } from '../../../shared/services/contactService'
import { getSettings } from '../../../shared/services/settingsService'
import { useSocketRefresh } from '../../../shared/hooks/useSocketRefresh'
import { MouseParallaxProvider, useMouseParallaxSubscribe } from '../../../components/contact3d/MouseParallaxProvider'
import { createContainerVariants, defaultViewport } from '../../shared/animations'
import GuillocheWaves from '../../components/ui/GuillocheWaves'

const ContactScene = lazy(() => import('../../../components/contact3d/ContactScene'))
const GlobeScene = lazy(() => import('../../../components/contact3d/GlobeScene'))
const FuturisticInput = lazy(() => import('../../../components/contact3d/FuturisticInput'))
const FuturisticTextarea = lazy(() => import('../../../components/contact3d/FuturisticTextarea'))
const LaunchButton = lazy(() => import('../../../components/contact3d/LaunchButton'))

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

const formSlideVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 80, damping: 18, delay: 0.15 },
  },
}

const globeSlideVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 80, damping: 18, delay: 0.3 },
  },
}

const ContactContent = memo(function ContactContent({ content, contactFormEnabled, values, errors, touched, fieldError, handleChange, handleBlur, handleSubmit, isSubmitting, isValid, result, resultType, form }) {
  const [heroTransforms, setHeroTransforms] = useState({ badge: { rx: 0, ry: 0 }, title: { rx: 0, ry: 0 }, subtitle: { ry: 0 } })

  useMouseParallaxSubscribe(useCallback((x, y) => {
    setHeroTransforms({
      badge: { rx: y * -3, ry: x * 3 },
      title: { rx: y * -2, ry: x * 2 },
      subtitle: { ry: x * 1 },
    })
  }, []))

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6">
        {/* 3D Hero Section */}
        <div className="relative mb-12 sm:mb-16 md:mb-20">
          <Suspense fallback={null}>
            <ContactScene>
              <div className="relative min-h-[300px] sm:min-h-[340px] flex flex-col items-center justify-center py-10 sm:py-14">
                {/* 3D Extruded Title: LET'S COLLABORATE */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative text-center mb-4 sm:mb-5"
                >
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-wider uppercase font-sans text-slate-900 dark:text-white text-3d-extruded select-none transition-transform duration-300 hover:scale-[1.02]">
                    LET'S COLLABORATE
                  </h2>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 font-normal">
                    {content?.subtitle || "Ready to bring your vision to life? Reach out and let's start a conversation about your next big project."}
                  </p>

                  {/* Decorative Diamond Accent Line: <> ◇ <> (Charcoal / Slate) */}
                  <div className="flex items-center justify-center gap-3 mt-5">
                    <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
                    <div className="w-2.5 h-2.5 rotate-45 border-2 border-[#36454F] dark:border-slate-300 shadow-[0_0_12px_rgba(54,69,79,0.6)] dark:shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
                    <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
                  </div>
                </motion.div>
              </div>
            </ContactScene>
          </Suspense>
        </div>

        {/* Main Content: Form + Globe */}
        <motion.div
          variants={createContainerVariants(false, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Contact Form - Left Side */}
            {contactFormEnabled && (
              <motion.div
                variants={formSlideVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <div
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(40px) saturate(1.5)',
                    WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
                    border: '1px solid var(--card-border)',
                    boxShadow: 'var(--card-shadow-hover)',
                  }}
                >
                  {/* Holographic border */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none z-10"
                    style={{
                      padding: '1px',
                      background: 'conic-gradient(from 0deg, rgba(99,102,241,0.15), transparent 30%, rgba(99,102,241,0.06) 50%, transparent 70%, rgba(99,102,241,0.15))',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                    }}
                  />

                  {/* Ambient glow */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 pointer-events-none z-0"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)',
                      filter: 'blur(40px)',
                    }}
                  />

                  {/* Scanlines */}
                  <div
                    className="absolute inset-0 pointer-events-none z-20 opacity-[0.02]"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                    }}
                  />

                  <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-10 xl:p-12">
                    {/* Terminal header */}
                    <div className="flex items-center gap-3 mb-7 sm:mb-9">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)]">
                        Communication Terminal v2.0
                      </span>
                      <motion.div
                        className="ml-auto w-2 h-2 rounded-full bg-green-500"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ boxShadow: '0 0 8px rgba(99,102,241,0.5)' }}
                      />
                    </div>

                    <Suspense fallback={null}>
                      <form ref={form} className="space-y-5 sm:space-y-6" onSubmit={handleSubmit} noValidate aria-label="Contact form">
                        <FuturisticInput
                          id="from_name"
                          name="from_name"
                          type="text"
                          value={values.from_name}
                          onChange={handleChange('from_name')}
                          onBlur={handleBlur('from_name')}
                          placeholder="e.g. John Doe"
                          icon={User}
                          error={fieldError('from_name')}
                          label="Full Name"
                          required
                        />

                        <FuturisticInput
                          id="reply_to"
                          name="reply_to"
                          type="email"
                          value={values.reply_to}
                          onChange={handleChange('reply_to')}
                          onBlur={handleBlur('reply_to')}
                          placeholder="e.g. john@example.com"
                          icon={Mail}
                          error={fieldError('reply_to')}
                          label="Email Address"
                          required
                        />

                        <FuturisticInput
                          id="phone"
                          name="phone"
                          type="tel"
                          value={values.phone}
                          onChange={handleChange('phone')}
                          onBlur={handleBlur('phone')}
                          placeholder="e.g. +1 (555) 123-4567"
                          icon={Phone}
                          error={fieldError('phone')}
                          label={
                            <>Phone Number <span className="text-[var(--text-tertiary)] text-[10px]">(optional)</span></>
                          }
                        />

                        <FuturisticTextarea
                          id="message"
                          name="message"
                          value={values.message}
                          onChange={handleChange('message')}
                          onBlur={handleBlur('message')}
                          placeholder="Write your message here..."
                          icon={MessageSquare}
                          error={fieldError('message')}
                          label="Message"
                          required
                          rows={5}
                        />

                        <AnimatePresence>
                          {result && (
                            <motion.div
                              id="form-message"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold text-center"
                              style={{
                                background: resultType === 'success'
                                  ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))'
                                  : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))',
                                border: `1px solid ${resultType === 'success' ? 'rgba(99,102,241,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                color: resultType === 'success' ? '#818cf8' : '#f87171',
                                boxShadow: resultType === 'success'
                                  ? '0 0 20px rgba(99,102,241,0.1)'
                                  : '0 0 20px rgba(239,68,68,0.1)',
                              }}
                              role="alert"
                              aria-live="polite"
                            >
                              {result}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <LaunchButton
                          disabled={isSubmitting || !isValid}
                          isSubmitting={isSubmitting}
                          isValid={isValid}
                          label="Send Message"
                          ariaLabel={isSubmitting ? 'Sending message...' : 'Send message'}
                        />
                      </form>
                    </Suspense>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3D Globe - Right Side */}
            <motion.div
              variants={globeSlideVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full aspect-square max-h-[480px] lg:max-h-[520px]">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 rounded-full border-2 border-transparent"
                      style={{
                        borderTopColor: 'var(--accent-contact)',
                        borderRightColor: 'rgba(6,182,212,0.3)',
                        filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.3))',
                      }}
                    />
                  </div>
                }>
                  <GlobeScene />
                </Suspense>

                {/* Glow behind globe */}
                <div
                  className="absolute inset-0 pointer-events-none -z-10"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Premium volumetric fog background - dark mode only */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden dark:block hidden" aria-hidden="true">
        <div
          className="absolute w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at 20% 80%, rgba(99,102,241,0.02) 0%, transparent 40%), radial-gradient(ellipse at 80% 20%, rgba(129,140,248,0.015) 0%, transparent 40%)',
          }}
        />
      </div>
    </>
  )
})

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

  return (
    <section
      id="contact"
      className="relative min-h-screen py-14 sm:py-20 md:py-24 overflow-hidden bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300"
      aria-label="Contact section"
    >
      {/* ── Monochromatic Purple Guilloche Ribbon Wave Background ── */}
      <GuillocheWaves className="absolute inset-0 z-0 opacity-45 dark:opacity-35 pointer-events-none" />

      {/* ── Ambient Background Glow Orbs (Charcoal & Slate Tones) ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-700/15 dark:bg-slate-800/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-slate-800/10 dark:bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#2C3539]/10 dark:bg-black/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <MouseParallaxProvider>
          <ContactContent
            content={content}
            contactFormEnabled={contactFormEnabled}
            values={values}
            errors={errors}
            touched={touched}
            fieldError={fieldError}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isValid={isValid}
            result={result}
            resultType={resultType}
            form={form}
          />
        </MouseParallaxProvider>
      </div>
    </section>
  )
}
