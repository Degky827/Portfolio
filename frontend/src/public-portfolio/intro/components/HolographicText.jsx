import { memo } from 'react'
import { motion } from 'framer-motion'

function HolographicText({
  children,
  color = '#06b6d4',
  fontSize = 'text-sm',
  className = '',
  delay = 0,
  animate = true,
}) {
  const baseStyle = {
    color,
    textShadow: `0 0 10px ${color}60, 0 0 20px ${color}30, 0 0 40px ${color}15`,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  }

  if (!animate) {
    return (
      <span className={`${fontSize} font-bold tracking-wider ${className}`} style={baseStyle}>
        {children}
      </span>
    )
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`${fontSize} font-bold tracking-wider ${className}`}
      style={baseStyle}
    >
      {children}
    </motion.span>
  )
}

export default memo(HolographicText)
