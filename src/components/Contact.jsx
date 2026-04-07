import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, User, MessageSquare, Send as Telegram } from 'lucide-react'
import emailjs from '@emailjs/browser'

const GithubIcon = ({ size = 24, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

const LinkedinIcon = ({ size = 24, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
)

export default function Contact() {
  const form = useRef()
  const [result, setResult] = useState('')
  const [resultStyle, setResultStyle] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult('')

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_your_id' 
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_your_id'
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key'

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      setResult('Message sent successfully! I will get back to you soon.')
      setResultStyle({ color: '#10b981' })
      e.target.reset()
    } catch (error) {
      setResult('Failed to send. Please try again or email me directly.')
      setResultStyle({ color: '#ef4444' })
    }

    setIsSubmitting(false)
  }

  const contactInfo = [
    { icon: <Mail size={20} />, label: 'Email', value: 'desalegnky827@gmail.com', href: 'mailto:desalegnky827@gmail.com' },
    { icon: <Phone size={20} />, label: 'Phone', value: '+251 908720092', href: 'tel:+251908720092' },
    { icon: <MapPin size={20} />, label: 'Location', value: 'Bahirdar, Ethiopia', href: null }
  ]

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
    <section id="contact" className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-slate-900/50 transition-colors duration-500 relative overflow-hidden">
      {/* Background Decor */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 right-0 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-primary/20 rounded-full blur-[100px] sm:blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.12, 0.1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-accent/20 rounded-full blur-[100px] sm:blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"
      />

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
            Contact
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            Let's Collaborate
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            Ready to bring your vision to life? Reach out and let's start a conversation about your next big project.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="glass-panel noise-bg rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] lg:rounded-[3.5rem] shadow-2xl max-w-5xl lg:max-w-6xl mx-auto overflow-hidden relative"
        >
          <div className="grid lg:grid-cols-5 relative z-10">
            {/* Contact Info Sidebar */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 bg-primary p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8 md:mb-10 leading-tight font-display tracking-tight">Connect With Me</h3>
                <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-10 md:mb-14 leading-relaxed">
                  I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>
                
                <div className="space-y-6 sm:space-y-8 md:space-y-10 mb-8 sm:mb-10 md:mb-14">
                  {contactInfo.map((info, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-4 sm:gap-5 md:gap-6 group"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass-card flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all duration-300 flex-shrink-0">
                        {info.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/50 mb-1">{info.label}</span>
                        {info.href ? (
                          <a href={info.href} className="text-sm sm:text-base md:text-lg lg:text-xl font-bold hover:text-accent transition-colors font-display tracking-tight break-all">{info.value}</a>
                        ) : (
                          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold font-display tracking-tight">{info.value}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3 sm:gap-4 md:gap-5">
                  {[
                    { title: 'LinkedIn', icon: <LinkedinIcon size={18} />, href: "https://linkedin.com/in/dk-cs-3rd" },
                    { title: 'GitHub', icon: <GithubIcon size={18} />, href: "https://github.com/desalegnkasayemuluyekasaye-tech" },
                    { title: 'Telegram', icon: <Telegram size={18} />, href: "https://t.me/Ds35kg" }
                  ].map((social, idx) => (
                    <motion.a 
                      key={idx} 
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl glass-card flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300" 
                      title={social.title}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Decorative background element */}
              <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-white/5 rounded-full blur-[100px] -z-0 pointer-events-none" />
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants} className="lg:col-span-3 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
              <form ref={form} className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Your Name</label>
                    <div className="relative group">
                      <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary">
                        <User size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <input 
                        name="user_name"
                        type="text" 
                        required
                        placeholder="e.g. Alex Johnson"
                        className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] xl:rounded-[2rem] outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-sm sm:text-base shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Email Address</label>
                    <div className="relative group">
                      <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary">
                        <Mail size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <input 
                        name="user_email"
                        type="email" 
                        required
                        placeholder="e.g. alex@example.com"
                        className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] xl:rounded-[2rem] outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-sm sm:text-base shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Your Message</label>
                  <div className="relative group">
                    <span className="absolute left-4 sm:left-5 top-5 sm:top-6 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary">
                      <MessageSquare size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <textarea 
                      name="message"
                      required
                      placeholder="Tell me about your project or vision..."
                      rows="5"
                      className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] xl:rounded-[2rem] outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-sm sm:text-base resize-none shadow-sm"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 sm:p-5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold text-center"
                      style={{ 
                        backgroundColor: resultStyle.color + '10',
                        color: resultStyle.color,
                        border: `1px solid ${resultStyle.color}20`
                      }}
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
                  className="w-full py-4 sm:py-5 bg-primary hover:bg-secondary text-white font-bold sm:font-black text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    {isSubmitting ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Send Message
                        <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <Send size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.span>
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
