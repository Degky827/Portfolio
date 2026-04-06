import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Code2, Globe, Rocket, MapPin, Coffee } from 'lucide-react'

export default function Hero() {
  const [typedText, setTypedText] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const fullText = 'Developer and Network Designer'

  useEffect(() => {
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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
      {/* Cursor Glow Effect */}
      <motion.div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        }}
      />

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
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
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
          className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-secondary/20 rounded-full blur-[140px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px]"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px' 
          }} 
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 mt-20 md:mt-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
        >
          <motion.div 
            variants={itemVariants}
            className="glass-panel noise-bg p-6 sm:p-8 md:p-14 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 max-w-5xl lg:max-w-6xl xl:max-w-7xl relative overflow-hidden w-full"
          >
            {/* Glow effects */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px] -z-10" />
            
            {/* Image Wrapper */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative flex-shrink-0"
            >
              <div className="w-40 h-52 sm:w-52 sm:h-64 md:w-64 md:h-80 lg:w-72 lg:h-88 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-4 sm:border-8 border-white/50 dark:border-slate-700/50 shadow-2xl relative z-10">
                <img 
                  src="/BDU1601297.png" 
                  alt="Desalegn Profile" 
                  className="w-full h-full object-contain object-top"
                  loading="eager"
                  fetchpriority="high"
                  onLoad={(e) => e.currentTarget.style.opacity = 1}
                  style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out', backgroundColor: '#f1f5f9' }}
                />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] sm:inset-[-15px] md:inset-[-20px] rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[3.5rem] border-2 border-dashed border-primary/30 pointer-events-none"
              />
              
              {/* Status Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-12 h-12 sm:w-14 sm:h-14 glass-panel rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl z-20"
              >
                <div className="relative">
                  <Coffee size={20} className="text-primary" />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left relative z-10">
              {/* Location Badge */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-4 sm:mb-6 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold"
              >
                <MapPin size={14} />
                <span>Available for Work</span>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/80 mb-4 sm:mb-6 flex items-center justify-center lg:justify-start gap-3">
                <div className="w-6 sm:w-8 h-px bg-primary/40" />
                <span>Creative Developer</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 tracking-tight font-display">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Desalegn</span>
                <span className="text-primary">.</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 min-h-[1.5em] font-medium leading-relaxed">
                I build <span className="text-primary font-black">{typedText}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-primary"
                >|</motion.span>
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-3 sm:gap-5 justify-center lg:justify-start mb-8 sm:mb-14">
                <motion.button 
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-primary text-white rounded-full sm:rounded-[2rem] font-bold sm:font-black text-sm sm:text-base lg:text-lg shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all flex items-center gap-2 sm:gap-4 group" 
                  onClick={scrollToContact}
                >
                  Let's Talk
                  <ArrowRight className="group-hover:translate-x-2 transition-transform w-4 h-4 sm:w-6 sm:h-6" />
                </motion.button>
                <motion.a 
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="#projects" 
                  className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 glass-panel rounded-full sm:rounded-[2rem] font-bold sm:font-black text-sm sm:text-base lg:text-lg hover:bg-white dark:hover:bg-slate-800 transition-all"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  View Work
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="flex gap-6 sm:gap-10 lg:gap-12 justify-center lg:justify-start pt-6 sm:pt-10 border-t border-gray-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl text-primary"><Rocket size={18} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-none">5+</span>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Experience</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg sm:rounded-xl text-secondary"><Code2 size={18} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-none">50+</span>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Projects</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-accent/10 rounded-lg sm:rounded-xl text-accent"><Globe size={18} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-none">30+</span>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Skills</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 text-gray-400 dark:text-gray-500 cursor-pointer group"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] group-hover:text-primary transition-colors">Discover More</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 sm:w-7 sm:h-12 border-2 border-gray-300 dark:border-slate-700 rounded-full flex justify-center p-1.5 group-hover:border-primary transition-colors"
        >
          <motion.div 
            animate={{ 
              y: [0, 12, 0],
              opacity: [1, 0.3, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-3 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
