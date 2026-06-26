import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Code, Smartphone } from 'lucide-react'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

function TabParticles({ color, isActive }) {
  if (!isActive) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            backgroundColor: color,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

function GlowRing({ color, isActive }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      animate={isActive ? {
        boxShadow: [
          `0 0 15px ${color}30, 0 0 30px ${color}15, inset 0 0 15px ${color}10`,
          `0 0 25px ${color}50, 0 0 50px ${color}25, inset 0 0 25px ${color}15`,
          `0 0 15px ${color}30, 0 0 30px ${color}15, inset 0 0 15px ${color}10`,
        ],
      } : {
        boxShadow: `0 0 0px transparent`,
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function AnimatedBorder({ color, isActive }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      style={{ padding: '1px' }}
      animate={isActive ? { opacity: 1 } : { opacity: 0.2 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${color}60, transparent 40%, transparent 60%, ${color}60)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
      />
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            background: [
              `conic-gradient(from 0deg, ${color}60, transparent 25%, ${color}40 50%, transparent 75%, ${color}60)`,
              `conic-gradient(from 360deg, ${color}60, transparent 25%, ${color}40 50%, transparent 75%, ${color}60)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          }}
        />
      )}
    </motion.div>
  )
}

function ReflectionOverlay({ mouseX, mouseY }) {
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), SPRING)
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), SPRING)

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        background: `radial-gradient(circle at ${x.get()}% ${y.get()}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
      }}
    />
  )
}

function HolographicTab({ label, icon: Icon, isActive, onClick, count, color }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), SPRING)
  const scale = useSpring(isHovered ? 1.05 : 1, SPRING)
  const translateZ = useSpring(isHovered ? 20 : 0, SPRING)

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
        translateZ,
        transformStyle: 'preserve-3d',
        perspective: '800px',
      }}
      className="relative group"
    >
      {/* Background glass */}
      <div
        className="relative px-8 sm:px-10 py-4 rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${color}15 0%, rgba(255,255,255,0.08) 50%, ${color}10 100%)`
            : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isActive ? `${color}40` : 'rgba(255,255,255,0.08)'}`,
        }}
      >
        {/* Animated effects */}
        <AnimatedBorder color={color} isActive={isActive} />
        <GlowRing color={color} isActive={isActive} />
        <TabParticles color={color} isActive={isActive} />

        {/* Scanning line on active */}
        {isActive && (
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
              boxShadow: `0 0 8px ${color}60`,
            }}
            animate={{ top: ['-5%', '105%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            animate={isActive ? {
              rotateY: [0, 360],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${color}30 0%, ${color}15 100%)`
                  : 'rgba(255,255,255,0.05)',
                boxShadow: isActive ? `0 0 20px ${color}30` : 'none',
              }}
            >
              <Icon
                size={18}
                style={{ color: isActive ? color : '#94a3b8' }}
                className="transition-colors duration-300"
              />
            </div>
          </motion.div>

          <div className="text-left">
            <span
              className="text-sm sm:text-base font-bold tracking-wide transition-all duration-300 block"
              style={{
                color: isActive ? color : '#94a3b8',
                textShadow: isActive ? `0 0 20px ${color}50` : 'none',
              }}
            >
              {label}
            </span>
            {count !== undefined && (
              <span className="text-[10px] font-medium text-slate-500 block mt-0.5">
                {count} items
              </span>
            )}
          </div>

          {count !== undefined && (
            <motion.div
              className="ml-auto px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-300"
              style={{
                background: isActive ? `${color}20` : 'rgba(255,255,255,0.05)',
                color: isActive ? color : '#64748b',
                border: `1px solid ${isActive ? `${color}30` : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isActive ? `0 0 12px ${color}20` : 'none',
              }}
              animate={isActive ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {count}
            </motion.div>
          )}
        </div>
      </div>
    </motion.button>
  )
}

export default function HolographicTabs({ activeTab, setActiveTab, webCount, mobileCount }) {
  return (
    <div className="flex justify-center mb-10 sm:mb-14">
      <div className="relative">
        {/* Ambient glow behind tabs */}
        <motion.div
          className="absolute -inset-4 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative flex gap-3 sm:gap-4 p-2">
          <HolographicTab
            label="Website Projects"
            icon={Code}
            isActive={activeTab === 'web'}
            onClick={() => setActiveTab('web')}
            count={webCount}
            color="#06b6d4"
          />
          <HolographicTab
            label="Applications"
            icon={Smartphone}
            isActive={activeTab === 'mobile'}
            onClick={() => setActiveTab('mobile')}
            count={mobileCount}
            color="#8b5cf6"
          />
        </div>
      </div>
    </div>
  )
}
