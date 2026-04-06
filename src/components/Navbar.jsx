import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, Mail, ChevronRight } from 'lucide-react'

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
          ? 'glass-panel py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.a 
          href="#home" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 text-2xl font-black tracking-tighter"
          onClick={(e) => handleNavClick(e, 'home')}
        >
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent font-display">
            PORTFOLIO
          </span>
        </motion.a>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center cursor-pointer z-[1001] bg-gray-100 dark:bg-slate-800 rounded-xl hover:bg-primary hover:text-white transition-colors" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link, idx) => (
            <motion.li 
              key={link.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.5 }}
            >
              <a 
                href={`#${link.id}`} 
                className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative group"
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {link.label}
                <motion.span 
                  className="absolute -bottom-2 left-0 w-0 h-1 bg-primary rounded-full group-hover:w-full transition-all duration-300"
                />
              </a>
            </motion.li>
          ))}
        </ul>

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
                className="fixed top-0 right-0 h-full w-full md:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl z-[1001] shadow-2xl p-10 md:hidden flex flex-col noise-bg"
              >
                <div className="flex justify-between items-center mb-16">
                  <motion.div 
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    <Zap size={32} fill="currentColor" />
                  </motion.div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)} 
                    className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-2xl text-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <X size={28} />
                  </motion.button>
                </div>
                
                <ul className="flex flex-col gap-10">
                  {navLinks.map((link, idx) => (
                    <motion.li 
                      key={link.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx, type: 'spring' }}
                    >
                      <a 
                        href={`#${link.id}`} 
                        className="text-5xl font-black text-gray-900 dark:text-white hover:text-primary transition-all flex items-center justify-between group font-display tracking-tighter"
                        onClick={(e) => handleNavClick(e, link.id)}
                      >
                        <span className="group-hover:translate-x-4 transition-transform duration-500">
                          {link.label}
                        </span>
                        <ChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all text-primary duration-500" size={40} />
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-auto space-y-8">
                  <div className="p-8 glass-panel rounded-[2.5rem] noise-bg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                      <Mail size={16} className="text-primary" /> Let's Connect
                    </p>
                    <a href="mailto:desalegnky827@gmail.com" className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors break-all font-display tracking-tight underline decoration-primary/30 underline-offset-8">
                      desalegnky827@gmail.com
                    </a>
                  </div>
                  
                  <div className="flex justify-center gap-6">
                    {/* Social icons can be added here if needed for consistency */}
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