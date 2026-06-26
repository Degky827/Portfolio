import { motion } from 'framer-motion'

const HOLO_CONFIG = {
  completed: {
    color: '#10b981',
    label: 'Completed',
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)',
    glow: 'rgba(16, 185, 129, 0.6)',
    particleColor: '#34d399',
  },
  in_progress: {
    color: '#f59e0b',
    label: 'In Progress',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)',
    glow: 'rgba(245, 158, 11, 0.6)',
    particleColor: '#fbbf24',
  },
  planned: {
    color: '#3b82f6',
    label: 'Planned',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #2563eb 100%)',
    glow: 'rgba(59, 130, 246, 0.6)',
    particleColor: '#60a5fa',
  },
}

const ICON_MAP = {
  completed: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  in_progress: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  planned: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

export default function HolographicBadge({ status, size = 'sm', className = '' }) {
  const config = HOLO_CONFIG[status] || HOLO_CONFIG.planned
  const iconPath = ICON_MAP[status] || ICON_MAP.planned
  const isSmall = size === 'sm'

  return (
    <motion.span
      className={`relative inline-flex items-center gap-1.5 overflow-hidden rounded-full font-bold uppercase tracking-wider whitespace-nowrap shrink-0 ${className}`}
      style={{
        fontSize: isSmall ? '10px' : '12px',
        padding: isSmall ? '4px 10px' : '6px 14px',
        color: config.color,
        background: `linear-gradient(135deg, ${config.color}18 0%, ${config.color}08 100%)`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${config.color}35`,
        boxShadow: `
          0 0 8px ${config.color}20,
          0 0 20px ${config.color}10,
          0 4px 12px rgba(0,0,0,0.3),
          inset 0 1px 0 ${config.color}15,
          inset 0 -1px 0 rgba(0,0,0,0.15)
        `,
      }}
      animate={{
        boxShadow: [
          `0 0 8px ${config.color}20, 0 0 20px ${config.color}10, 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 ${config.color}15, inset 0 -1px 0 rgba(0,0,0,0.15)`,
          `0 0 12px ${config.color}35, 0 0 30px ${config.color}18, 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 ${config.color}20, inset 0 -1px 0 rgba(0,0,0,0.15)`,
          `0 0 8px ${config.color}20, 0 0 20px ${config.color}10, 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 ${config.color}15, inset 0 -1px 0 rgba(0,0,0,0.15)`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Holographic reflection sweep */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 30%, ${config.color}12 45%, ${config.color}20 50%, ${config.color}12 55%, transparent 70%)`,
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
      />

      {/* Neon pulse ring */}
      <motion.span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `1px solid ${config.color}40`,
        }}
        animate={{
          opacity: [0, 0.6, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particle dots */}
      {[...Array(3)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full pointer-events-none"
          style={{
            background: config.particleColor,
            left: `${20 + i * 25}%`,
            top: '50%',
          }}
          animate={{
            y: [-4, -14],
            opacity: [0.8, 0],
            scale: [1, 0.3],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Icon */}
      <svg
        width={isSmall ? 10 : 14}
        height={isSmall ? 10 : 14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        <path d={iconPath} />
      </svg>

      {/* Label */}
      <span className="relative z-10">{config.label}</span>
    </motion.span>
  )
}
