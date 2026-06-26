import { motion } from 'framer-motion'

export default function HolographicLighting({ color, isHovered }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
      {/* Ambient light orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 60 + i * 20,
            height: 60 + i * 20,
            background: `radial-gradient(circle, ${color}${15 + i * 5} 0%, transparent 70%)`,
            filter: `blur(${20 + i * 10}px)`,
          }}
          animate={{
            x: [0, (i - 1) * 30, 0],
            y: [0, (i % 2 === 0 ? -20 : 20), 0],
            opacity: isHovered ? [0.2, 0.5, 0.2] : [0.05, 0.15, 0.05],
            scale: isHovered ? [1, 1.2, 1] : [0.9, 1, 0.9],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Light rays */}
      {isHovered && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute"
              style={{
                width: 1,
                height: '120%',
                background: `linear-gradient(180deg, transparent, ${color}20, transparent)`,
                left: `${20 + i * 20}%`,
                top: '-10%',
                transformOrigin: 'top center',
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scaleY: [0, 1, 0],
                rotateZ: [(i - 1.5) * 8, (i - 1.5) * 12, (i - 1.5) * 8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </>
      )}

      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          boxShadow: `0 0 8px ${color}30`,
        }}
        animate={{
          top: ['-5%', '105%'],
          opacity: isHovered ? [0, 0.5, 0] : [0, 0.2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating particles */}
      {isHovered && [...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            backgroundColor: i % 2 === 0 ? color : '#8b5cf6',
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
