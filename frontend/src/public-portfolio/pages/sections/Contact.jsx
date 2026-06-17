import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { logPortfolioVisit, logPortfolioEngagement } from '../../../shared/services/api'
import { getContactContent, createMessage } from '../../../shared/services/contactService'

function SocialIcon({ iconVector, size = 18, className = '' }) {
  if (!iconVector) return null
  return (
    <span className={className} style={{ width: size, height: size }} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: iconVector.replace(/width="[^"]*"/, `width="${size}"`).replace(/height="[^"]*"/, `height="${size}"`) }}
    />
  )
}

export default function Contact() {
  const form = useRef()
  const [result, setResult] = useState('')
  const [resultType, setResultType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getContactContent()
        setContent(content)
      } catch {
        // fall back to hardcoded
      }
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult('')

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    const formData = new FormData(form.current)
    const name = formData.get('from_name') || ''
    const email = formData.get('reply_to') || ''
    const phone = formData.get('phone') || ''
    const message = formData.get('message') || ''

    const emailTo = content?.email || 'desalegnky827@gmail.com'

    let saved = false
    try {
      await createMessage({ name, email, phone, message })
      // Show success confirmation to the visitor after storing the message
      setResult(t('contact.successMessage'))
      setResultType('success')
      saved = true
    } catch (err) {
      saved = false
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      // If we saved the message to the DB, don't open the user's email client — show success instead.
      logPortfolioEngagement({ action: 'contact_submit', page: window.location.pathname })
      logPortfolioVisit(name)
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
      e.target.reset()
    } catch (error) {
      console.error('EmailJS error:', error)
      const mailtoLink = `mailto:${emailTo}?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`)}`
      logPortfolioEngagement({ action: 'contact_submit', page: window.location.pathname })
      window.location.href = mailtoLink
      setResult(t('contact.errorEmailjs'))
      setResultType('error')
    }

    setIsSubmitting(false)
  }

  const contactInfo = [
    { icon: <Mail size={20} aria-hidden="true" />, label: t('contact.labelEmail'), value: content?.email || 'desalegnky827@gmail.com', href: `mailto:${content?.email || 'desalegnky827@gmail.com'}`, color: '#3b82f6' },
    { icon: <Phone size={20} aria-hidden="true" />, label: t('contact.labelPhone'), value: content?.phone || '+251 908720092', href: `tel:${content?.phone || '+251908720092'}`, color: '#22c55e' },
    { icon: <MapPin size={20} aria-hidden="true" />, label: t('contact.labelLocation'), value: content?.address || 'Bahirdar, Ethiopia', href: content?.mapLink || null, color: '#f59e0b' }
  ]

  const socialChannels = (content?.socialChannels || []).slice().sort((a, b) => a.displayWeight - b.displayWeight)

  const formEnabled = content?.contactFormEnabled !== false

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
    <section id="contact" className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-500 relative overflow-hidden" aria-label={t('contact.ariaLabel')}>

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full"
          >
            {t('contact.badge')}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            {t('contact.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            {t('contact.description')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] shadow-sm max-w-5xl lg:max-w-6xl mx-auto overflow-hidden relative"
        >
          <div className={`grid relative z-10 ${formEnabled ? 'lg:grid-cols-5' : 'lg:grid-cols-1'}`}>
            {/* Contact Info Sidebar */}
            <motion.div
              variants={itemVariants}
              className={`${formEnabled ? 'lg:col-span-2' : 'lg:col-span-1'} bg-transparent dark:bg-transparent p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16 text-gray-900 dark:text-white relative overflow-hidden`}
            >
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8 md:mb-10 leading-tight font-display tracking-tight text-gray-900 dark:text-white">{t('contact.connectTitle')}</h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-white/80 mb-8 sm:mb-10 md:mb-14 leading-relaxed">
                  {t('contact.connectDescription')}
                </p>

                <div className="space-y-6 sm:space-y-8 md:space-y-10 mb-8 sm:mb-10 md:mb-14">
                  {contactInfo.map((info, index) => {
                    const hoverBg = index === 0 ? '#3b82f6' : index === 1 ? '#22c55e' : '#f59e0b'
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ x: 10 }}
                        className="flex items-center gap-4 sm:gap-5 md:gap-6 group"
                      >
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-900 dark:text-white transition-all duration-300 flex-shrink-0"
                          style={{ '--hover-bg': hoverBg }}
                          onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.borderColor = 'transparent' }}
                          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = '' }}
                          aria-hidden="true"
                        >
                          {info.icon}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 dark:text-white/50 mb-1">{info.label}</span>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-colors font-display tracking-tight break-all text-gray-900 dark:text-white"
                              onMouseEnter={e => { e.currentTarget.style.color = hoverBg }}
                              onMouseLeave={e => { e.currentTarget.style.color = '' }}
                            >{info.value}</a>
                          ) : (
                            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">{info.value}</span>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {socialChannels.length > 0 && (
                  <div className="flex gap-3 sm:gap-4 md:gap-5 flex-wrap" role="list" aria-label={t('contact.socialAriaLabel')}>
                    {socialChannels.map((ch) => (
                      <motion.a
                        key={ch._id || ch.channelName}
                        role="listitem"
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.9 }}
                        href={ch.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-primary hover:text-white transition-all duration-300"
                        title={ch.channelName}
                        aria-label={ch.channelName}
                      >
                        {ch.iconVector ? (
                          <SocialIcon iconVector={ch.iconVector} size={20} className="text-current" />
                        ) : (
                          <span className="text-xs font-bold uppercase">{ch.channelName?.charAt(0)}</span>
                        )}
                      </motion.a>
                    ))}
                  </div>
                )}
              </div>

              {/* Decorative background element */}
              <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-primary/5 dark:bg-white/5 rounded-full blur-[100px] -z-0 pointer-events-none" aria-hidden="true" />
            </motion.div>

            {/* Contact Form */}
            {formEnabled && (
              <motion.div variants={itemVariants} className="lg:col-span-3 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
                <form ref={form} className="space-y-6 sm:space-y-8" onSubmit={handleSubmit} aria-label={t('contact.formAriaLabel')}>
                  <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2 sm:space-y-3">
                      <label htmlFor="from_name" className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/70 dark:text-primary/60 ml-1">{t('contact.formLabelName')}</label>
                      <div className="relative group">
                        <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary" aria-hidden="true">
                          <User size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </span>
                        <input
                          id="from_name"
                          name="from_name"
                          type="text"
                          required
                          placeholder={t('contact.formPlaceholderName')}
                          className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 dark:bg-black/30 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] xl:rounded-[2rem] outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-sm sm:text-base shadow-sm"
                          aria-describedby={result ? "form-message" : undefined}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label htmlFor="reply_to" className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/70 dark:text-primary/60 ml-1">{t('contact.formLabelEmail')}</label>
                      <div className="relative group">
                        <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary" aria-hidden="true">
                          <Mail size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </span>
                        <input
                          id="reply_to"
                          name="reply_to"
                          type="email"
                          required
                          placeholder={t('contact.formPlaceholderEmail')}
                          className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 dark:bg-black/30 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] xl:rounded-[2rem] outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-sm sm:text-base shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="phone" className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/70 dark:text-primary/60 ml-1">{t('contact.formLabelPhone')}</label>
                    <div className="relative group">
                      <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary" aria-hidden="true">
                        <Phone size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={t('contact.formPlaceholderPhone')}
                        className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 dark:bg-black/30 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] xl:rounded-[2rem] outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-sm sm:text-base shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="message" className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/70 dark:text-primary/60 ml-1">{t('contact.formLabelMessage')}</label>
                    <div className="relative group">
                      <span className="absolute left-4 sm:left-5 top-5 sm:top-6 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary" aria-hidden="true">
                        <MessageSquare size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <textarea
                        id="message"
                        name="message"
                        required
                        placeholder={t('contact.formPlaceholderMessage')}
                        rows="5"
                        className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 dark:bg-black/30 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] xl:rounded-[2rem] outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-sm sm:text-base resize-none shadow-sm"
                      />
                    </div>
                  </div>

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

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 sm:py-5 bg-primary hover:bg-[#4F46E5] text-white font-bold sm:font-black text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4 disabled:opacity-70 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={isSubmitting ? t('contact.submitAriaSubmitting') : t('contact.submitAriaNormal')}
                  >
                    <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                      {isSubmitting ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-4 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                      ) : (
                        <>
                          {t('contact.submitText')}
                          <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} aria-hidden="true">
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
