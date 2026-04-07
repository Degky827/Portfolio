import { motion } from 'framer-motion'
import { Zap, ArrowUp, Mail } from 'lucide-react'

const GithubIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

const LinkedinIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
)

const TelegramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
  </svg>
)

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { 
      href: 'mailto:desalegnky827@gmail.com', 
      title: 'Email', 
      icon: <Mail size={20} />
    },
    { 
      href: 'https://linkedin.com/in/dk-cs-3rd', 
      title: 'LinkedIn', 
      icon: <LinkedinIcon size={20} />
    },
    { 
      href: 'https://github.com/desalegn-tech', 
      title: 'GitHub', 
      icon: <GithubIcon size={20} />
    },
    { 
      href: 'https://t.me/Ds35kg', 
      title: 'Telegram', 
      icon: <TelegramIcon size={20} />
    }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 dark:bg-black text-white pt-16 sm:pt-20 pb-8 sm:pb-12 relative overflow-hidden">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg className="relative block w-[calc(100%+1.3px)] h-[50px] sm:h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21 0 0 0 321.39,56.44Z" className="fill-gray-50 dark:fill-slate-900 transition-colors duration-500"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 md:gap-16 mb-12 sm:mb-16">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-3 text-2xl sm:text-3xl font-black mb-4 sm:mb-6 md:mb-8">
              <span className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              <span className="tracking-tight uppercase">Desalegn</span>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-sm mb-6 sm:mb-8 md:mb-10 leading-relaxed">
              Building robust digital experiences through modern web development and secure network infrastructure.
            </p>
            <div className="flex gap-3 sm:gap-4 md:gap-5">
              {socialLinks.map((link, index) => (
                <motion.a 
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group shadow-sm shadow-white/5"
                  title={link.title}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 mb-6 sm:mb-8 md:mb-10">Explore</h4>
            <ul className="space-y-3 sm:space-y-4 md:space-y-6">
              {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-sm sm:text-base md:text-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2 sm:gap-3 group font-medium sm:font-bold">
                    <span className="w-0 sm:w-0 group-hover:w-3 h-0.5 sm:h-1 bg-primary rounded-full transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 mb-6 sm:mb-8 md:mb-10">Contact</h4>
            <ul className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-400">
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-lg sm:text-xl md:text-2xl">📍</span>
                <div>
                  <a 
                    href="https://www.google.com/maps/place/Bahir+Dar,+Ethiopia/@11.5833,37.3333,12z" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base md:text-lg font-medium leading-tight block hover:text-primary transition-colors"
                  >
                    Bahirdar, Ethiopia
                  </a>
                  <span className="text-xs text-white/50">Amhara Region</span>
                </div>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-lg sm:text-xl md:text-2xl">📧</span>
                <a href="mailto:desalegnky827@gmail.com" className="text-sm sm:text-base md:text-lg font-medium hover:text-white transition-colors break-all">desalegnky827@gmail.com</a>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-lg sm:text-xl md:text-2xl">📱</span>
                <a href="tel:+251908720092" className="text-sm sm:text-base md:text-lg font-medium hover:text-white transition-colors">+251 908 720 092</a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-6 sm:pt-10 md:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 text-gray-500 text-xs sm:text-sm font-medium sm:font-bold uppercase tracking-wider"
        >
          <p>© {currentYear} Desalegn. Built with passion and precision.</p>
          <div className="flex items-center gap-2 sm:gap-3">
            <span>Made with</span>
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-red-500 text-base sm:text-xl"
            >
              ❤️
            </motion.span>
            <span>using React & Tailwind</span>
          </div>
          
          {/* Back to Top Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 hover:bg-primary flex items-center justify-center transition-colors"
            title="Back to top"
          >
            <ArrowUp size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  )
}
