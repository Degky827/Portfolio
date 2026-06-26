import { motion } from 'framer-motion'

export default function RotatingShowcasePlatform({ color, isHovered }) {
  return (
    <div className="relative mx-auto" style={{ width: 240, height: 20 }}>
      {/* Platform glow */}
      <motion.div
        className="absolute -inset-4 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${color}20 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
        animate={{
          opacity: isHovered ? [0.4, 0.7, 0.4] : 0.2,
          scale: isHovered ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main platform */}
      <motion.div
        className="relative mx-auto rounded-full overflow-hidden"
        style={{
          width: 200,
          height: 12,
          perspective: '600px',
        }}
      >
        {/* Top surface */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, 
              ${color}10 0%, 
              ${color}30 20%, 
              rgba(255,255,255,0.15) 50%, 
              ${color}30 80%, 
              ${color}10 100%)`,
            transform: 'rotateX(60deg)',
            transformOrigin: 'center top',
          }}
        />

        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${color}30`,
            borderTopColor: `${color}60`,
            borderRightColor: 'transparent',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute inset-1 rounded-full"
          style={{
            border: `1px solid ${color}15`,
            borderBottomColor: `${color}40`,
            borderLeftColor: 'transparent',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
            boxShadow: `0 0 12px ${color}40`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Holographic light beams */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 h-1 pointer-events-none"
          style={{
            left: `${15 + i * 17}%`,
            width: '2px',
            background: `linear-gradient(180deg, ${color}40 0%, transparent 100%)`,
            transformOrigin: 'top center',
          }}
          animate={{
            height: isHovered ? [4, 12, 4] : [2, 6, 2],
            opacity: isHovered ? [0.3, 0.6, 0.3] : [0.1, 0.3, 0.1],
            rotateZ: isHovered ? [0, (i - 2) * 5, 0] : 0,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
