import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Layers, Globe, Smartphone } from 'lucide-react'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

function TabParticles({ color, isActive }) {
  if (!isActive) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            backgroundColor: color,
            left: `${15 + (i * 10)}%`,
            top: `${20 + (i * 7)}%`,
          }}
          animate={{
            y: [-12, 12, -12],
            opacity: [0, 0.7, 0],
            scale: [0.6, 1.2, 0.6],
          }}
          transition={{
            duration: 2.2 + (i * 0.2),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}

function HolographicTab({ id, label, icon: Icon, isActive, onClick, count, accentColor = '#6C2BFF' }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), SPRING)
  const scale = useSpring(isHovered ? 1.04 : 1, SPRING)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const activeColor = isDark ? '#8B5CF6' : '#6C2BFF'

  return (
    <motion.button
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
      }}
      className="relative group focus:outline-none select-none"
      type="button"
    >
      <div
        className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl overflow-hidden transition-all duration-300 flex items-center gap-2.5 sm:gap-3 ${
          isActive
            ? 'shadow-lg border-2'
            : 'border'
        }`}
        style={{
          background: isActive
            ? isDark
              ? 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(30,42,58,0.9) 100%)'
              : 'linear-gradient(135deg, rgba(108,43,255,0.1) 0%, rgba(255,255,255,0.95) 100%)'
            : isDark
              ? 'rgba(30, 42, 58, 0.6)'
              : 'rgba(255, 255, 255, 0.75)',
          borderColor: isActive
            ? activeColor
            : isDark
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.08)',
          boxShadow: isActive
            ? `0 8px 25px ${activeColor}30`
            : 'none',
          backdropFilter: 'blur(16px)',
        }}
      >
        <TabParticles color={activeColor} isActive={isActive} />

        {/* Tab Icon */}
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            background: isActive
              ? `${activeColor}25`
              : isDark
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.04)',
            color: isActive ? activeColor : isDark ? '#94a3b8' : '#64748b',
          }}
        >
          <Icon size={16} />
        </div>

        {/* Tab Label */}
        <div className="text-left">
          <span
            className="text-xs sm:text-sm font-bold tracking-wide transition-colors block"
            style={{
              color: isActive
                ? isDark ? '#ffffff' : activeColor
                : isDark ? '#94a3b8' : '#475569',
            }}
          >
            {label}
          </span>
        </div>

        {/* Count Badge */}
        {count !== undefined && (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold transition-all"
            style={{
              background: isActive
                ? `${activeColor}25`
                : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              color: isActive ? activeColor : isDark ? '#cbd5e1' : '#64748b',
              border: `1px solid ${isActive ? `${activeColor}40` : 'transparent'}`,
            }}
          >
            {count}
          </span>
        )}
      </div>
    </motion.button>
  )
}

export default function HolographicTabs({
  activeTab,
  setActiveTab,
  allCount = 0,
  webCount = 0,
  mobileCount = 0,
}) {
  return (
    <div className="flex justify-center mb-8 sm:mb-10 w-full px-2">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
        <HolographicTab
          id="all"
          label="All Projects"
          icon={Layers}
          isActive={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
          count={allCount}
        />
        <HolographicTab
          id="web"
          label="Web & Systems"
          icon={Globe}
          isActive={activeTab === 'web'}
          onClick={() => setActiveTab('web')}
          count={webCount}
        />
        <HolographicTab
          id="mobile"
          label="Applications"
          icon={Smartphone}
          isActive={activeTab === 'mobile'}
          onClick={() => setActiveTab('mobile')}
          count={mobileCount}
        />
      </div>
    </div>
  )
}
