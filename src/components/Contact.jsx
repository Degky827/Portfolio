import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, User, MessageSquare, Linkedin, Github, Send as Telegram } from 'lucide-react'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const form = useRef()
  const [result, setResult] = useState('')
  const [resultStyle, setResultStyle] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult('')

    // Note: Use environment variables for better security and maintainability
    // Create a .env file in the root directory with these keys:
    // VITE_EMAILJS_SERVICE_ID=...
    // VITE_EMAILJS_TEMPLATE_ID=...
    // VITE_EMAILJS_PUBLIC_KEY=...
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_your_id' 
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_your_id'
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key'

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        form.current,
        PUBLIC_KEY
      )

      setResult('✓ Message sent successfully! I will get back to you soon.')
      setResultStyle({ color: '#10b981' })
      e.target.reset()
    } catch (error) {
      console.error('EmailJS Error:', error)
      setResult('✗ Failed to send. Please try again or email me directly.')
      setResultStyle({ color: '#ef4444' })
    }

    setIsSubmitting(false)
  }

  const contactInfo = [
    { icon: <Mail size={24} />, label: 'Email', value: 'desalegnky827@gmail.com', href: 'mailto:desalegnky827@gmail.com' },
    { icon: <Phone size={24} />, label: 'Phone', value: '+251 908720092', href: 'tel:+251908720092' },
    { icon: <MapPin size={24} />, label: 'Location', value: 'Addis Ababa, Ethiopia', href: null }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-slate-900/50 transition-colors duration-500 relative overflow-hidden">
      {/* Background Decor */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"
      />
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.12, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"
      />

      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full"
          >
            Contact
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Let's Collaborate
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Ready to bring your vision to life? Reach out and let's start a conversation about your next big project.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="glass-panel noise-bg rounded-[3.5rem] shadow-2xl max-w-6xl mx-auto overflow-hidden relative"
        >
          <div className="grid lg:grid-cols-5 relative z-10">
            {/* Contact Info Sidebar */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 bg-primary p-12 md:p-16 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-4xl font-black mb-10 leading-tight font-display tracking-tight">Connect With Me</h3>
                <p className="text-white/80 mb-14 text-xl leading-relaxed font-medium">
                  I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>
                
                <div className="space-y-10 mb-14">
                  {contactInfo.map((info, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-6 group"
                    >
                      <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all duration-300">
                        {info.icon}
                      </div>
                      <div>
                        <span className="block text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-1">{info.label}</span>
                        {info.href ? (
                          <a href={info.href} className="text-xl font-bold hover:text-accent transition-colors font-display tracking-tight">{info.value}</a>
                        ) : (
                          <span className="text-xl font-bold font-display tracking-tight">{info.value}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-5">
                  {[
                    { title: 'LinkedIn', icon: <Linkedin size={20} />, href: "https://linkedin.com/in/dk-cs-3rd" },
                    { title: 'GitHub', icon: <Github size={20} />, href: "https://github.com/desalegn-tech" },
                    { title: 'Telegram', icon: <Telegram size={20} />, href: "https://t.me/Ds35kg" }
                  ].map((social, idx) => (
                    <motion.a 
                      key={idx} 
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300" 
                      title={social.title}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Decorative background element for sidebar */}
              <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-white/5 rounded-full blur-[100px] -z-0 pointer-events-none" />
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-3 p-12 md:p-16"
            >
              <form ref={form} className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Your Name</label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary">
                        <User size={20} />
                      </span>
                      <input 
                        name="user_name"
                        type="text" 
                        required
                        placeholder="e.g. Alex Johnson"
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-3xl outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-lg shadow-sm"
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Email Address</label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary">
                        <Mail size={20} />
                      </span>
                      <input 
                        name="user_email"
                        type="email" 
                        required
                        placeholder="e.g. alex@example.com"
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-3xl outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-lg shadow-sm"
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Your Message</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-6 opacity-40 group-focus-within:opacity-100 transition-opacity text-primary">
                      <MessageSquare size={20} />
                    </span>
                    <textarea 
                      name="message"
                      required
                      placeholder="Tell me about your project or vision..."
                      rows="6"
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-3xl outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium text-lg shadow-sm resize-none"
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                    ></textarea>
                  </div>
                </div>

                <AnimatePresence>
                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-5 rounded-2xl text-base font-bold text-center"
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
                  className="w-full py-5 bg-primary hover:bg-secondary text-white font-black text-xl rounded-[2rem] shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {isSubmitting ? (
                      <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Send Message
                        <motion.span 
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Send size={24} />
                        </motion.span>
                      </>
                    )}
                  </span>
                  <motion.div 
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -z-0"
                  />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}