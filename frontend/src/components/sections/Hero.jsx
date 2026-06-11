import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Code2, Globe, Rocket, MapPin, Download, Zap, Star, GraduationCap, Award, BookOpen, Cpu, Users, Trophy, Shield, Wifi, Server, Palette, Video, Terminal, Heart, Briefcase, Coffee, Smile } from 'lucide-react'

const iconMap = {
  Award, BookOpen, Cpu, Code2, Globe, Rocket, Star, Zap,
  Users, Trophy, Shield, Wifi, Server, Palette, Video,
  Terminal, GraduationCap, Sparkles, Download, MapPin,
  Heart, Briefcase, Coffee, Smile,
}

function getIcon(name) {
  return iconMap[name] || Award
}

export default function Hero({ content, contactButtonText, contactButtonLink }) {
  const [typedText, setTypedText] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const greeting = content?.greeting ?? "Hi, I'm"
  const fullName = content?.fullName ?? 'Desalegn'
  const nameAmharic = content?.nameAmharic ?? 'ደካ'
  const badge = content?.professionalBadge ?? 'Student Developer'
  const fullText = content?.typingWords?.[0] ?? 'Developer and Network Designer'
  const introduction = content?.shortIntroduction ?? "Passionate about creating <span class=\"text-primary font-semibold\">secure</span>, <span class=\"text-secondary font-semibold\">scalable</span> digital solutions and designing robust network architectures. Specializing in modern web development and enterprise networking."
  const profilePhotoUrl = content?.profilePhoto?.url || '/BDU1601297.png'
  const profilePhotoAlt = content?.profilePhoto?.alt || 'Desalegn Profile'
  const stats = content?.statistics?.length > 0
    ? content.statistics
    : [
        { label: 'Top Certifications', value: '3+', icon: 'Award', color: '#6366f1' },
        { label: 'Class Projects', value: '15+', icon: 'BookOpen', color: '#10b981' },
        { label: 'Core Skills', value: '30+', icon: 'Cpu', color: '#f59e0b' },
      ]
  const contactBtnText = contactButtonText || 'Get In Touch'
  const contactBtnLink = contactButtonLink || '#contact'
  const ctaButtons = content?.ctaButtons?.length > 0
    ? content.ctaButtons.map((btn, i) => i === 0 ? { ...btn, text: contactBtnText, link: contactBtnLink } : btn)
    : [{ text: contactBtnText, link: contactBtnLink, openNewTab: false, icon: 'ArrowRight' }]

  useEffect(() => {
    let index = 0
    setTypedText('')
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [fullText])

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

  const handleCtaClick = (btn) => {
    if (btn.openNewTab) {
      window.open(btn.link, '_blank')
    } else if (btn.link) {
      const id = btn.link.replace('#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else window.location.href = btn.link
    } else {
      scrollToContact()
    }
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
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-black transition-colors duration-500">
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
              {/* Concentric Multi-Layered Progress Form */}
              <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 relative">

                {/* Layer 1: Outer pulsing neon glow */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-6 rounded-full bg-cyan-400/10 blur-3xl"
                />

                {/* Layer 2: SVG Audio Waveform Equalizer (outer border) */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full z-[9] overflow-visible"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.3))' }}
                >
                  <defs>
                    <linearGradient id="eqGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="2" />
                  {Array.from({ length: 20 }).map((_, i) => {
                    const angle = (i * 360) / 20
                    const rad = (angle * Math.PI) / 180
                    const innerR = 44
                    const baseR = 47
                    const extendR = 5
                    const x1 = 50 + Math.cos(rad) * innerR
                    const y1 = 50 + Math.sin(rad) * innerR
                    const bx2 = 50 + Math.cos(rad) * baseR
                    const by2 = 50 + Math.sin(rad) * baseR
                    return (
                      <motion.line
                        key={i}
                        x1={x1} y1={y1}
                        x2={bx2} y2={by2}
                        stroke="url(#eqGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={false}
                        animate={{
                          x2: [
                            bx2,
                            bx2 + Math.cos(rad) * extendR,
                            bx2,
                            bx2 + Math.cos(rad) * extendR * 0.6,
                            bx2,
                          ],
                          y2: [
                            by2,
                            by2 + Math.sin(rad) * extendR,
                            by2,
                            by2 + Math.sin(rad) * extendR * 0.6,
                            by2,
                          ],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          delay: (i * 360 / 20) / 360 * 1.8,
                          ease: "easeInOut",
                        }}
                      />
                    )
                  })}
                </svg>

                {/* Layer 3: Multi-segmented circular progress bar (rotating slowly) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 6deg, #2563eb 6deg, #2563eb 135deg, #10b981 135deg, #10b981 255deg, #f59e0b 255deg, #f59e0b 354deg, transparent 354deg, transparent 360deg)',
                    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 13px), #000 calc(100% - 3px), transparent calc(100% - 2px))',
                    mask: 'radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 13px), #000 calc(100% - 3px), transparent calc(100% - 2px))',
                  }}
                />

                {/* Layer 4: Glowing white indicator gap accent at top */}
                <motion.div
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-white shadow-lg z-[12]"
                  style={{ boxShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)' }}
                />

                {/* Layer 5: Inner crisp white ring framing the portrait */}
                <div className="absolute inset-[14px] rounded-full border-[3px] border-white/95 shadow-md z-[11]" />

                {/* Layer 6: Seamless circular portrait (head + shoulders visible) */}
                <div className="absolute inset-[21px] rounded-full overflow-hidden z-10 bg-[#dce5f0] shadow-sm pt-[14px]">
                  <img 
                    src={profilePhotoUrl}
                    alt={profilePhotoAlt}
                    className="w-full h-full object-cover object-[center_18%]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div 
              variants={itemVariants}
              className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6 md:space-y-8"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 hover-lift"
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-[0.2em]">{badge}</span>
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-white leading-tight">
                {greeting}{' '}
                <span className="gradient-text">
                  <span className="inline-flex items-center justify-center h-8 sm:h-10 px-1.5 rounded-xl bg-gradient-to-br from-purple-900 to-purple-700 text-white text-[9px] sm:text-[11px] font-black mr-1.5 -mt-1 align-middle shadow-lg">
                    {nameAmharic}
                  </span>{' '}
                  {fullName}
                </span>
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                  {typedText}
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-1 h-6 sm:h-8 ml-1 bg-gradient-to-b from-primary to-secondary"
                  />
                </span>
              </h1>

              <motion.p 
                variants={itemVariants}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400 max-w-2xl lg:max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: introduction }}
              />

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                {ctaButtons.map((btn, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCtaClick(btn)}
                    className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full transition-all shadow-lg pulse-on-hover"
                  >
                    {btn.text || 'Get In Touch'}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="flex gap-6 sm:gap-10 lg:gap-12 justify-center lg:justify-start pt-6 sm:pt-10 border-t border-gray-100 dark:border-slate-700/50">
                {stats.map((stat, i) => {
                  const StatIcon = getIcon(stat.icon)
                  return (
                    <div key={i} className="flex items-center gap-2 sm:gap-4">
                      <div
                        className="p-2 sm:p-3 rounded-lg sm:rounded-xl"
                        style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}
                      >
                        <StatIcon size={18} className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</span>
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </motion.div>
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
