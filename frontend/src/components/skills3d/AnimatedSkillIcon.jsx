import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getSkillIcon } from './SkillIconMapper'

const ICON_ANIMATIONS = {
  REACT: {
    animate: { rotate: 360 },
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
    glow: '#61dafb',
  },
  'REACT.JS': {
    animate: { rotate: 360 },
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
    glow: '#61dafb',
  },
  'REACTJS': {
    animate: { rotate: 360 },
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
    glow: '#61dafb',
  },
  'REACT JS': {
    animate: { rotate: 360 },
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
    glow: '#61dafb',
  },
  JAVASCRIPT: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    glow: '#facc15',
  },
  JS: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    glow: '#facc15',
  },
  'NODE.JS': {
    animate: { y: [0, -3, 0] },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    glow: '#22c55e',
  },
  NODEJS: {
    animate: { y: [0, -3, 0] },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    glow: '#22c55e',
  },
  NODE: {
    animate: { y: [0, -3, 0] },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    glow: '#22c55e',
  },
  MONGODB: {
    animate: { y: [0, -4, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    glow: '#8b5cf6',
  },
  MONGO: {
    animate: { y: [0, -4, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    glow: '#8b5cf6',
  },
  GITHUB: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    glow: '#6b7280',
  },
  FIREBASE: {
    animate: { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    glow: '#f97316',
  },
  FLUTTER: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    glow: '#3b82f6',
  },
  GIT: {
    animate: { rotate: [0, 5, -5, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    glow: '#f97316',
  },
  CISCO: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    glow: '#06b6d4',
  },
}

function getAnimation(skillName) {
  if (!skillName) return null
  const normalized = skillName.toUpperCase().trim()
  return ICON_ANIMATIONS[normalized] || null
}

function getGlowColor(skillName) {
  const anim = getAnimation(skillName)
  return anim?.glow || null
}

export default function AnimatedSkillIcon({ skill, size = 18, color, className = '' }) {
  const skillName = skill?.icon || skill?.name
  const IconComponent = useMemo(() => getSkillIcon(skillName), [skillName])
  const animation = useMemo(() => getAnimation(skillName), [skillName])
  const glowColor = useMemo(() => getGlowColor(skillName), [skillName])

  const iconSize = size

  if (!animation) {
    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        style={{ width: iconSize, height: iconSize }}
      >
        <IconComponent
          size={iconSize}
          style={{ color: color || glowColor }}
        />
      </div>
    )
  }

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: iconSize, height: iconSize }}
      animate={animation.animate}
      transition={animation.transition}
    >
      {/* Glow effect behind icon */}
      {glowColor && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Icon */}
      <IconComponent
        size={iconSize}
        style={{ color: color || glowColor }}
        className="relative z-10 drop-shadow-lg"
      />
    </motion.div>
  )
}
