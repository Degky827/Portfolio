import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useMouseParallaxSubscribe } from './MouseParallaxProvider'

const ICON_CONFIGS = {
  email: {
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.4)',
    bgGlow: 'rgba(59,130,246,0.15)',
    label: 'Holographic Envelope',
  },
  phone: {
    color: '#22c55e',
    glowColor: 'rgba(34,197,94,0.4)',
    bgGlow: 'rgba(34,197,94,0.15)',
    label: 'Neon Phone',
  },
  location: {
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.4)',
    bgGlow: 'rgba(245,158,11,0.15)',
    label: 'Map Beacon',
  },
  linkedin: {
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.5)',
    bgGlow: 'rgba(59,130,246,0.15)',
    label: 'Metallic Cube',
  },
  github: {
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.5)',
    bgGlow: 'rgba(167,139,250,0.15)',
    label: 'Chrome Sphere',
  },
}

function getIconType(iconComponent, channelName) {
  if (channelName) {
    const n = channelName.toLowerCase()
    if (n.includes('linkedin')) return 'linkedin'
    if (n.includes('github')) return 'github'
  }
  if (iconComponent?.type === Mail) return 'email'
  if (iconComponent?.type === Phone) return 'phone'
  if (iconComponent?.type === MapPin) return 'location'
  return 'email'
}

function EmailShape({ color, isHovered }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-7 h-5 sm:w-8 sm:h-6 rounded-sm"
        animate={{
          rotateY: isHovered ? 10 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          background: `linear-gradient(135deg, ${color}20, ${color}40)`,
          border: `1px solid ${color}60`,
          boxShadow: isHovered ? `0 0 20px ${color}40, inset 0 0 10px ${color}20` : 'none',
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-0"
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `5px solid ${color}50`,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-sm"
          animate={isHovered ? {
            background: [
              `linear-gradient(135deg, ${color}10, ${color}30, ${color}10)`,
              `linear-gradient(135deg, ${color}30, ${color}10, ${color}30)`,
            ],
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </div>
  )
}

function PhoneShape({ color, isHovered }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-5 h-8 sm:w-6 sm:h-9 rounded-md"
        animate={{
          rotateY: isHovered ? 10 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          background: `linear-gradient(180deg, ${color}15, ${color}30)`,
          border: `1.5px solid ${color}50`,
          boxShadow: isHovered ? `0 0 20px ${color}40, inset 0 0 8px ${color}20` : 'none',
        }}
      >
        <div
          className="absolute top-1 left-0.5 right-0.5 bottom-2 rounded-[2px]"
          style={{ background: `${color}10` }}
        />
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: `${color}40` }}
        />
        <motion.div
          className="absolute -inset-1 rounded-md pointer-events-none"
          animate={isHovered ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            border: `1px solid ${color}30`,
            boxShadow: `0 0 12px ${color}30`,
          }}
        />
      </motion.div>
    </div>
  )
}

function LocationShape({ color, isHovered }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative"
        animate={{
          rotateY: isHovered ? 10 : 0,
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="relative">
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${color}60, ${color}30)`,
              boxShadow: isHovered ? `0 0 25px ${color}50, 0 0 50px ${color}20` : `0 0 10px ${color}20`,
            }}
          />
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              animate={isHovered ? {
                scale: [1, 1.8 + ring * 0.3],
                opacity: [0.4, 0],
              } : { scale: 1, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: ring * 0.3,
                ease: 'easeOut',
              }}
              style={{
                width: `${20 + ring * 4}px`,
                height: `${20 + ring * 4}px`,
                border: `1px solid ${color}40`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function LinkedInShape({ color, isHovered }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '200px' }}>
      <motion.div
        className="relative w-6 h-6 sm:w-7 sm:h-7"
        animate={{
          rotateX: isHovered ? 15 : 0,
          rotateY: isHovered ? 15 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 rounded-md"
          style={{
            background: `linear-gradient(135deg, ${color}25, ${color}50)`,
            border: `1.5px solid ${color}60`,
            boxShadow: isHovered ? `0 0 20px ${color}40, 4px 4px 12px rgba(0,0,0,0.3)` : 'none',
            transform: 'translateZ(4px)',
          }}
        />
        <div
          className="absolute inset-0 rounded-md"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
            transform: 'rotateY(90deg) translateZ(4px)',
          }}
        />
        <div
          className="absolute inset-0 rounded-md"
          style={{
            background: `${color}20`,
            border: `1px solid ${color}40`,
            transform: 'rotateX(90deg) translateZ(4px)',
          }}
        />
      </motion.div>
    </div>
  )
}

function GithubShape({ color, isHovered }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full"
        animate={{
          rotateY: isHovered ? 15 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}50, ${color}20, ${color}10)`,
          border: `1.5px solid ${color}40`,
          boxShadow: isHovered
            ? `0 0 25px ${color}40, inset 0 -3px 6px ${color}20, 4px 4px 12px rgba(0,0,0,0.3)`
            : `inset 0 -2px 4px ${color}10`,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={isHovered ? {
            background: [
              `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.15), transparent 60%)`,
              `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.1), transparent 50%)`,
              `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.15), transparent 60%)`,
            ],
          } : {
            background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.08), transparent 50%)`,
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </div>
  )
}

const ShapeMap = {
  email: EmailShape,
  phone: PhoneShape,
  location: LocationShape,
  linkedin: LinkedInShape,
  github: GithubShape,
}

export default function InteractiveIcon3D({ icon, label, value, href, color, channelName, iconVector, socialIconComponent }) {
  const containerRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [globalTilt, setGlobalTilt] = useState({ x: 0, y: 0, z: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useMouseParallaxSubscribe(useCallback((x, y) => {
    setGlobalTilt({
      x: y * -1,
      y: x * 1,
      z: Math.abs(x * y) * 3,
    })
  }, []))

  const iconType = useMemo(() => {
    if (channelName) {
      const n = channelName.toLowerCase()
      if (n.includes('linkedin')) return 'linkedin'
      if (n.includes('github')) return 'github'
    }
    if (icon?.type === Mail) return 'email'
    if (icon?.type === Phone) return 'phone'
    if (icon?.type === MapPin) return 'location'
    return 'email'
  }, [icon, channelName])

  const config = ICON_CONFIGS[iconType]
  const ShapeComponent = ShapeMap[iconType]

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setRotate({ x: y * -15, y: x * 15 })
  }, [])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }, [])

  const combinedRotateX = rotate.x + globalTilt.x
  const combinedRotateY = rotate.y + globalTilt.y

  const Tag = href ? 'a' : 'div'
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative"
      style={{ perspective: '600px' }}
    >
      <motion.div
        className="flex items-center gap-4 sm:gap-5"
        animate={{
          x: isHovered ? 8 : 0,
          rotateX: combinedRotateX,
          rotateY: combinedRotateY,
          translateZ: isHovered ? 15 : globalTilt.z,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* 3D Icon container */}
        <div className="relative flex-shrink-0" style={{ perspective: '400px' }}>
          {/* Outer glow on hover */}
          <motion.div
            className="absolute -inset-2 rounded-2xl pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />

          {/* Icon box */}
          <motion.div
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden"
            animate={{
              rotateX: isHovered ? 5 : 0,
              rotateY: isHovered ? 5 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              transformStyle: 'preserve-3d',
              background: isHovered
                ? `linear-gradient(135deg, ${config.bgGlow}, rgba(255,255,255,0.05))`
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isHovered ? `${config.color}40` : 'rgba(255,255,255,0.06)'}`,
              boxShadow: isHovered
                ? `0 8px 25px rgba(0,0,0,0.3), 0 0 20px ${config.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
                : '0 4px 12px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* 3D shape behind icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-60">
              <ShapeComponent color={config.color} isHovered={isHovered} />
            </div>

            {/* Lucide icon or social icon */}
            <div className="relative z-10" style={{ color: isHovered ? config.color : 'rgba(255,255,255,0.7)' }}>
              {socialIconComponent || icon}
            </div>

            {/* Scanline on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={isHovered ? { opacity: [0.05, 0.1, 0.05] } : { opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
              }}
            />
          </motion.div>

          {/* Floating shadow */}
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 rounded-full pointer-events-none"
            animate={{
              width: isHovered ? '80%' : '60%',
              opacity: isHovered ? 0.3 : 0.1,
              blur: isHovered ? 8 : 4,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(ellipse, ${config.color}40, transparent)`,
            }}
          />
        </div>

        {/* Text content */}
        <Tag
          {...linkProps}
          className="min-w-0 group/text"
        >
          <span className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 mb-1">{label}</span>
          <span
            className="text-sm sm:text-base md:text-lg lg:text-xl font-bold font-display tracking-tight break-all transition-colors duration-300"
            style={{ color: isHovered ? config.color : 'rgba(255,255,255,0.9)' }}
          >
            {value}
          </span>
        </Tag>
      </motion.div>
    </motion.div>
  )
}
