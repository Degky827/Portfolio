import { useRef, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMouseParallaxSubscribe } from './MouseParallaxProvider'

const HOLOGRAM_CONFIGS = {
  linkedin: {
    color: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.5)',
    bgGlow: 'rgba(6,182,212,0.12)',
    label: 'LinkedIn',
  },
  github: {
    color: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.5)',
    bgGlow: 'rgba(6,182,212,0.12)',
    label: 'Github',
  },
}

function HoloParticles({ color, isHovered, count = 6 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
      })),
    [count]
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          animate={
            isHovered
              ? {
                  y: [p.y, p.y - 30, p.y],
                  x: [p.x, p.x + (Math.random() - 0.5) * 20, p.x],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2, 0.5],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          style={{
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
        />
      ))}
    </div>
  )
}

export default function FloatingHologram({ channelName, href, iconComponent, iconVector }) {
  const containerRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [globalTilt, setGlobalTilt] = useState({ x: 0, y: 0, z: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useMouseParallaxSubscribe(useCallback((x, y) => {
    setGlobalTilt({
      x: y * -1.2,
      y: x * 1.2,
      z: Math.abs(x * y) * 2,
    })
  }, []))

  const config = useMemo(() => {
    const name = (channelName || '').toLowerCase()
    if (name.includes('linkedin')) return HOLOGRAM_CONFIGS.linkedin
    return HOLOGRAM_CONFIGS.github
  }, [channelName])

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setRotate({ x: y * -20, y: x * 20 })
  }, [])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }, [])

  const combinedRotateX = rotate.x + globalTilt.x
  const combinedRotateY = rotate.y + globalTilt.y

  return (
    <motion.a
      ref={containerRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative block group"
      style={{ perspective: '600px' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={channelName}
      aria-label={channelName}
    >
      <motion.div
        className="relative"
        animate={{
          rotateX: combinedRotateX,
          rotateY: combinedRotateY,
          y: isHovered ? -8 : 0,
          translateZ: isHovered ? 10 : globalTilt.z,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute -inset-3 rounded-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? 0.8 : 0.15,
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.4 }}
          style={{
            background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
            filter: 'blur(12px)',
          }}
        />

        {/* Holographic ring */}
        <motion.div
          className="absolute -inset-1 rounded-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0.1,
            rotate: isHovered ? 360 : 0,
          }}
          transition={{
            opacity: { duration: 0.3 },
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          }}
          style={{
            padding: '1px',
            background: `conic-gradient(from 0deg, ${config.color}60, transparent 30%, ${config.glowColor} 50%, transparent 70%, ${config.color}60)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          }}
        />

        {/* Icon container */}
        <div
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            background: isHovered
              ? `linear-gradient(135deg, ${config.bgGlow}, rgba(255,255,255,0.05))`
              : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isHovered ? `${config.color}40` : 'rgba(255,255,255,0.06)'}`,
            boxShadow: isHovered
              ? `0 12px 35px rgba(0,0,0,0.4), 0 0 25px ${config.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
              : '0 6px 20px rgba(0,0,0,0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Chrome/metallic reflection */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={
              isHovered
                ? {
                    background: [
                      `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)`,
                      `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)`,
                      `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)`,
                    ],
                  }
                : {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
                  }
            }
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Icon */}
          <div
            className="relative z-10 transition-all duration-300"
            style={{
              color: isHovered ? config.color : 'rgba(255,255,255,0.6)',
              filter: isHovered ? `drop-shadow(0 0 8px ${config.glowColor})` : 'none',
              transform: `translateZ(10px)`,
            }}
          >
            {iconComponent || (
              <span className="text-sm font-bold uppercase">
                {channelName?.charAt(0)}
              </span>
            )}
          </div>

          {/* Scan lines */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={isHovered ? { opacity: [0.03, 0.06, 0.03] } : { opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)',
            }}
          />

          {/* Holographic particles */}
          <HoloParticles color={config.color} isHovered={isHovered} count={5} />
        </div>

        {/* Floating shadow */}
        <motion.div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-4 rounded-full pointer-events-none"
          animate={{
            width: isHovered ? '80%' : '60%',
            opacity: isHovered ? 0.3 : 0.1,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(ellipse, ${config.color}50, transparent)`,
            filter: 'blur(6px)',
          }}
        />

        {/* Label */}
        <motion.div
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 4,
          }}
          transition={{ duration: 0.2 }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: config.color,
              textShadow: `0 0 8px ${config.glowColor}`,
            }}
          >
            {channelName}
          </span>
        </motion.div>
      </motion.div>
    </motion.a>
  )
}
