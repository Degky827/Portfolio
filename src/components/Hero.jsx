import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Code2, Globe, Rocket } from 'lucide-react'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const [typedText, setTypedText] = useState('')
  const fullText = 'Developer and Network Designer'

  useEffect(() => {
    setLoaded(true)
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-500">
      {/* Dynamic Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 mt-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
        >
          <motion.div 
            variants={itemVariants}
            className="glass-panel noise-bg p-8 md:p-14 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-6xl relative overflow-hidden"
          >
            {/* Glow effect inside panel */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
            
            {/* Image Wrapper */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative"
            >
              <div className="w-52 h-52 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-8 border-white/50 dark:border-slate-700/50 shadow-2xl relative z-10 bg-gray-100 dark:bg-slate-700">
                <picture className="w-full h-full">
                  <source srcSet="/dkk.avif" type="image/avif" />
                  <source srcSet="/dkk.webp" type="image/webp" />
                  <img 
                    src="/dkk.jpg" 
                    alt="Desalegn Profile" 
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                    onLoad={(e) => e.currentTarget.style.opacity = 1}
                    style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
                  />
                </picture>
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-20px] rounded-[3.5rem] border-2 border-dashed border-primary/30"
              />
              <div className="absolute -bottom-6 -right-6 w-20 h-20 glass-panel rounded-2xl flex items-center justify-center text-primary shadow-xl z-20">
                <Sparkles size={32} />
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left relative z-10">
              <motion.div variants={itemVariants} className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-primary/80 mb-6 flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-px bg-primary/40" />
                <span>Creative Developer</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-6 tracking-tight font-display">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Desalegn</span>
                <span className="text-primary">.</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-10 min-h-[1.5em] font-medium leading-relaxed">
                I build <span className="text-primary font-black">{typedText}</span>
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-5 justify-center md:justify-start mb-14">
                <motion.button 
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all flex items-center gap-4 group" 
                  onClick={scrollToContact}
                >
                  Let's Talk
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                </motion.button>
                <motion.a 
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="#projects" 
                  className="px-10 py-5 glass-panel rounded-[2rem] font-black text-lg hover:bg-white dark:hover:bg-slate-800 transition-all"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  View Work
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="flex gap-12 justify-center md:justify-start pt-10 border-t border-gray-100 dark:border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary"><Rocket size={24} /></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-gray-900 dark:text-white leading-none">5+</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Experience</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-xl text-secondary"><Code2 size={24} /></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-gray-900 dark:text-white leading-none">50+</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Projects</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-xl text-accent"><Globe size={24} /></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-gray-900 dark:text-white leading-none">30+</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Skills</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Improved Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500 cursor-pointer group"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Discover More</span>
        <div className="w-7 h-12 border-2 border-gray-300 dark:border-slate-700 rounded-full flex justify-center p-1.5 group-hover:border-primary transition-colors">
          <motion.div 
            animate={{ 
              y: [0, 15, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-3 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}