import { memo } from 'react'
import { motion } from 'framer-motion'

function CircularScanner({ color = '#06b6d4', size = 200, progress = 0, className = '' }) {
  const radius = size * 0.42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${color}15`}
          strokeWidth={2}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `drop-shadow(0 0 6px ${color}80)`,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
        {/* Tick marks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180
          const inner = radius - 6
          const outer = radius + 4
          return (
            <line
              key={i}
              x1={size / 2 + inner * Math.cos(angle)}
              y1={size / 2 + inner * Math.sin(angle)}
              x2={size / 2 + outer * Math.cos(angle)}
              y2={size / 2 + outer * Math.sin(angle)}
              stroke={i % 3 === 0 ? `${color}60` : `${color}20`}
              strokeWidth={i % 3 === 0 ? 1.5 : 0.5}
            />
          )
        })}
      </svg>
      {/* Center glow */}
      <div
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '50%',
          width: size * 0.15,
          height: size * 0.15,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          filter: `blur(8px)`,
        }}
      />
      {/* Rotating inner ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius * 0.7}
            fill="none"
            stroke={`${color}20`}
            strokeWidth={1}
            strokeDasharray="8 12"
          />
        </svg>
      </motion.div>
    </div>
  )
}

export default memo(CircularScanner)
