import { memo } from 'react'
import { motion } from 'framer-motion'

function BlinkingCursor({ color = '#06b6d4', size = 16, className = '' }) {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      className={`inline-block ${className}`}
      style={{
        width: size * 0.6,
        height: size,
        backgroundColor: color,
        borderRadius: 1,
        boxShadow: `0 0 ${size * 0.5}px ${color}, 0 0 ${size}px ${color}40`,
        verticalAlign: 'text-bottom',
      }}
    />
  )
}

export default memo(BlinkingCursor)
