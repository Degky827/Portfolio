import { useState, useRef, useEffect, lazy, Suspense, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, User, MessageSquare } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { logPortfolioVisit, logPortfolioEngagement } from '../../../shared/services/api'
import { getContactContent, createMessage } from '../../../shared/services/contactService'
import { getSettings } from '../../../shared/services/settingsService'
import { MouseParallaxProvider, useMouseParallaxSubscribe } from '../../../components/contact3d/MouseParallaxProvider'

const ContactScene = lazy(() => import('../../../components/contact3d/ContactScene'))
const FuturisticPanel = lazy(() => import('../../../components/contact3d/FuturisticPanel'))
const InteractiveIcon3D = lazy(() => import('../../../components/contact3d/InteractiveIcon3D'))
const FuturisticInput = lazy(() => import('../../../components/contact3d/FuturisticInput'))
const FuturisticTextarea = lazy(() => import('../../../components/contact3d/FuturisticTextarea'))
const LaunchButton = lazy(() => import('../../../components/contact3d/LaunchButton'))
const FloatingHologram = lazy(() => import('../../../components/contact3d/FloatingHologram'))

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

function HeroParallaxElements() {
  const [transforms, setTransforms] = useState({ badge: { rx: 0, ry: 0 }, title: { rx: 0, ry: 0 }, subtitle: { ry: 0 } })

  useMouseParallaxSubscribe(useCallback((x, y) => {
    setTransforms({
      badge: { rx: y * -3, ry: x * 3 },
      title: { rx: y * -2, ry: x * 2 },
      subtitle: { ry: x * 1 },
    })
  }, []))

  return { transforms }
}

function ContactContent({ content, contactFormEnabled, values, errors, touched, fieldError, handleChange, handleBlur, handleSubmit, isSubmitting, isValid, result, resultType, form }) {
  const { t } = useTranslation()
  const [heroTransforms, setHeroTransforms] = useState({ badge: { rx: 0, ry: 0 }, title: { rx: 0, ry: 0 }, subtitle: { ry: 0 } })

  useMouseParallaxSubscribe(useCallback((x, y) => {
    setHeroTransforms({
      badge: { rx: y * -3, ry: x * 3 },
      title: { rx: y * -2, ry: x * 2 },
      subtitle: { ry: x * 1 },
    })
  }, []))

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

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6">
        {/* 3D Hero Section */}
        <div className="relative mb-16 sm:mb-20 md:mb-28">
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
                    transform: `perspective(800px) rotateY(${heroTransforms.badge.ry}deg) rotateX(${heroTransforms.badge.rx}deg) translateZ(${Math.abs(heroTransforms.badge.rx * heroTransforms.badge.ry) * 0.3}px)`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
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
                    <div className="relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border border-primary/30 backdrop-blur-xl bg-white/[0.06] shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(34,211,238,0.08) 50%, rgba(6,182,212,0.1) 100%)',
                        }}
                      />
                      {/* Neon ring */}
                      <motion.div
                        className="absolute inset-[-1px] rounded-full"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          background: 'conic-gradient(from 0deg, rgba(6,182,212,0.45), rgba(34,211,238,0.2), rgba(6,182,212,0.45))',
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
                    transform: `perspective(1000px) rotateY(${heroTransforms.title.ry}deg) rotateX(${heroTransforms.title.rx}deg)`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                >
                  {/* Depth shadow layers */}
                  <h2
                    className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight select-none pointer-events-none"
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(6,182,212,0.08)',
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
                      WebkitTextStroke: '1px rgba(34,211,238,0.12)',
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
                      backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 40%, #06b6d4 70%, #67e8f9 100%)',
                      backgroundSize: '200% 200%',
                      textShadow: '0 0 60px rgba(6,182,212,0.3), 0 0 120px rgba(6,182,212,0.15)',
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
                      background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)',
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
                    transform: `perspective(800px) rotateY(${heroTransforms.subtitle.ry}deg)`,
                    willChange: 'transform',
                  }}
                >
                  <motion.span
                    className="text-[var(--text-secondary)]"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {t('contact.description')}
                  </motion.span>
                </motion.p>

                {/* Floating light rays - Premium enhanced */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      animate={{
                        y: [-20, 20, -20],
                        opacity: [0.03, 0.08, 0.03],
                        rotate: [15 + i * 8, 20 + i * 8, 15 + i * 8],
                      }}
                      transition={{
                        duration: 6 + i * 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 1.2,
                      }}
                      style={{
                        left: `${15 + i * 18}%`,
                        top: '5%',
                        width: i % 2 === 0 ? '2px' : '1px',
                        height: '90%',
                        background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? 'rgba(6,182,212,0.18)' : 'rgba(34,211,238,0.12)'}, transparent)`,
                        filter: `blur(${i % 2 === 0 ? 4 : 3}px)`,
                      }}
                    />
                  ))}
                </div>

                {/* Holographic scan lines overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.015]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.15) 2px, rgba(6,182,212,0.15) 4px)',
                  }}
                />

                {/* Volumetric fog effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 30% 60%, rgba(6,182,212,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(34,211,238,0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.025) 0%, transparent 40%)',
                  }}
                />

                {/* Lens flare */}
                <motion.div
                  className="absolute pointer-events-none"
                  animate={{
                    opacity: [0.15, 0.35, 0.15],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    top: '15%',
                    right: '20%',
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(34,211,238,0.1) 30%, transparent 70%)',
                    filter: 'blur(20px)',
                    borderRadius: '50%',
                  }}
                />
                <motion.div
                  className="absolute pointer-events-none"
                  animate={{
                    opacity: [0.1, 0.25, 0.1],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  style={{
                    top: '25%',
                    left: '15%',
                    width: '80px',
                    height: '80px',
                    background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)',
                    filter: 'blur(15px)',
                    borderRadius: '50%',
                  }}
                />
              </div>
            </ContactScene>
          </Suspense>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="bg-[var(--surface)] border border-[var(--border-default)] rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] shadow-sm max-w-5xl lg:max-w-6xl mx-auto overflow-hidden relative"
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
                          className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 leading-tight font-display tracking-tight text-[var(--text-primary)]"
                          animate={{
                            textShadow: [
                              '0 0 20px rgba(6,182,212,0.3)',
                              '0 0 40px rgba(6,182,212,0.5)',
                              '0 0 20px rgba(6,182,212,0.3)',
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
                            'linear-gradient(90deg, rgba(6,182,212,0.6), rgba(34,211,238,0.3))',
                            'linear-gradient(90deg, rgba(34,211,238,0.6), rgba(6,182,212,0.3))',
                            'linear-gradient(90deg, rgba(6,182,212,0.6), rgba(34,211,238,0.3))',
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />

                      <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-10 sm:mb-12 md:mb-14 leading-relaxed">
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

                      {/* Social channels - Floating Holograms */}
                      {socialChannels.length > 0 && (
                        <div>
                          <span className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[var(--text-tertiary)] mb-5 sm:mb-6">
                            Social Channels
                          </span>
                          <div className="flex gap-4 sm:gap-5 flex-wrap" role="list" aria-label={t('contact.socialAriaLabel')}>
                            {socialChannels.map((ch) => (
                              <FloatingHologram
                                key={ch._id || ch.channelName}
                                channelName={ch.channelName}
                                href={ch.linkUrl}
                                iconComponent={
                                  ch.iconVector ? (
                                    <SocialIcon iconVector={ch.iconVector} size={22} className="text-current" />
                                  ) : null
                                }
                                iconVector={ch.iconVector}
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

            {/* Contact Form - AI Communication Terminal */}
            {contactFormEnabled && (
              <motion.div variants={itemVariants} className="lg:col-span-3 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
                <Suspense fallback={null}>
                  <FuturisticPanel>
                    <div className="p-8 sm:p-10 md:p-12 lg:p-10 xl:p-12">
                      {/* Terminal header */}
                      <div className="flex items-center gap-3 mb-8 sm:mb-10">
                        <div className="flex gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)]">
                          AI Communication Terminal v2.0
                        </span>
                        <motion.div
                          className="ml-auto w-2 h-2 rounded-full bg-green-500"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}
                        />
                      </div>

                      <form ref={form} className="space-y-6 sm:space-y-8" onSubmit={handleSubmit} noValidate aria-label={t('contact.formAriaLabel')}>
                        {/* Full Name */}
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

                        {/* Email */}
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

                        {/* Phone (optional) */}
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

                        {/* Message */}
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

                        {/* Result Message */}
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
                                  ? 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))'
                                  : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))',
                                border: `1px solid ${resultType === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                color: resultType === 'success' ? '#4ade80' : '#f87171',
                                boxShadow: resultType === 'success'
                                  ? '0 0 20px rgba(34,197,94,0.1)'
                                  : '0 0 20px rgba(239,68,68,0.1)',
                              }}
                              role="alert"
                              aria-live="polite"
                            >
                              {result}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Launch Control Button */}
                        <LaunchButton
                          disabled={isSubmitting || !isValid}
                          isSubmitting={isSubmitting}
                          isValid={isValid}
                          label={t('contact.submitText')}
                          ariaLabel={isSubmitting ? t('contact.submitAriaSubmitting') : t('contact.submitAriaNormal')}
                        />
                      </form>
                    </div>
                  </FuturisticPanel>
                </Suspense>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Premium volumetric fog background - dark mode only */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden dark:block hidden" aria-hidden="true">
        <div
          className="absolute w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.03) 0%, transparent 40%), radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.025) 0%, transparent 40%)',
          }}
        />
      </div>
    </>
  )
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

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 bg-[var(--bg-primary)] transition-colors duration-500 relative overflow-hidden" aria-label={t('contact.ariaLabel')}>
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
    </section>
  )
}
