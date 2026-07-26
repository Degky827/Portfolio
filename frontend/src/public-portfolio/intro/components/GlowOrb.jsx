import { memo } from 'react'
import { motion } from 'framer-motion'

function GlowOrb({ color = '#06b6d4', size = 200, x = '50%', y = '50%', blur = 100, opacity = 0.15, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity, scale: 1 }}
      transition={{ duration: 1.5, delay, ease: 'easeOut' }}
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}40 0%, ${color}10 40%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

export default memo(GlowOrb)
