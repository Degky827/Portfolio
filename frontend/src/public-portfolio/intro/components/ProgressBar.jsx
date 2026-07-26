import { memo } from 'react'
import { motion } from 'framer-motion'

function ProgressBar({ progress = 0, color = '#06b6d4', height = 3, glow = true, className = '' }) {
  return (
    <div
      className={`w-full overflow-hidden rounded-full ${className}`}
      style={{ height, backgroundColor: `${color}15` }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          width: `${progress * 100}%`,
          backgroundColor: color,
          boxShadow: glow ? `0 0 12px ${color}80, 0 0 4px ${color}` : 'none',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </div>
  )
}

export default memo(ProgressBar)
