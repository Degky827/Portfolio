import { memo } from 'react'
import { motion } from 'framer-motion'

/**
 * StatisticIcon
 *
 * Glass circle icon container with:
 * - Glass surface
 * - Purple/blue glow
 * - Floating animation
 * - Hover scale
 * - Shadow
 */
const StatisticIcon = memo(function StatisticIcon({ icon: Icon, color = '#8b5cf6', delay = 0 }) {
  return (
    <motion.div
      className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center"
      animate={{
        y: [0, -3, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-3 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}15, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Glass circle */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}18, ${color}08)`,
          border: `1px solid ${color}35`,
          boxShadow: `
            0 4px 16px ${color}20,
            0 0 24px ${color}10,
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.2)
          `,
        }}
      >
        {/* Icon */}
        <div
          className="transition-transform duration-300"
          style={{
            color,
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      {/* Reflection highlight */}
      <div
        className="absolute top-1 left-2 right-2 h-[40%] rounded-full pointer-events-none opacity-20"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0.15), transparent)`,
          maskImage: 'radial-gradient(ellipse at center top, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center top, black 30%, transparent 70%)',
        }}
        aria-hidden="true"
      />
    </motion.div>
  )
})

export default StatisticIcon
