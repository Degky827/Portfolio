import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

function DynamicIsland({ color, isHovered }) {
  return (
    <motion.div
      className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5"
      animate={{
        width: isHovered ? 90 : 34,
        height: isHovered ? 28 : 10,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <motion.div
          className="flex items-center gap-1 px-2"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              boxShadow: isHovered
                ? [`0 0 4px ${color}`, `0 0 8px ${color}`, `0 0 4px ${color}`]
                : '0 0 0px transparent',
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[8px] font-bold text-white/60 tracking-wider uppercase">Live</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function CameraModule({ color, isHovered }) {
  return (
    <div
      className="absolute top-3 left-3 z-20"
      style={{ perspective: '400px' }}
    >
      <motion.div
        className="relative"
        style={{
          width: 44,
          height: 44,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: isHovered ? -5 : 0,
          rotateY: isHovered ? 8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div
          className="w-full h-full rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%)',
            boxShadow: `
              0 2px 8px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Camera lenses */}
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="rounded-full relative"
                style={{
                  width: 14,
                  height: 14,
                  background: `radial-gradient(circle at 35% 35%, #3a3a4a 0%, #1a1a2a 60%, #0a0a1a 100%)`,
                  boxShadow: `
                    inset 0 1px 2px rgba(255,255,255,0.1),
                    0 1px 2px rgba(0,0,0,0.5)
                  `,
                }}
              >
                <motion.div
                  className="absolute inset-1 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 40% 40%, ${color}30 0%, transparent 70%)`,
                  }}
                  animate={{
                    opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2,
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <div
                  className="absolute inset-2 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 40% 40%, #2a2a3a 0%, #0a0a1a 100%)',
                    boxShadow: 'inset 0 0 2px rgba(0,0,0,0.8)',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SideButtons({ color, isHovered }) {
  return (
    <>
      {/* Power button (right side) */}
      <div
        className="absolute right-0 top-20 z-10"
        style={{
          width: 3,
          height: 28,
          background: 'linear-gradient(180deg, #4a4a5a 0%, #3a3a4a 50%, #2a2a3a 100%)',
          borderRadius: '0 2px 2px 0',
          boxShadow: `
            1px 0 2px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}
      />
      {/* Volume buttons (left side) */}
      <div
        className="absolute left-0 top-16 z-10"
        style={{
          width: 3,
          height: 20,
          background: 'linear-gradient(180deg, #4a4a5a 0%, #3a3a4a 50%, #2a2a3a 100%)',
          borderRadius: '2px 0 0 2px',
          boxShadow: `
            -1px 0 2px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}
      />
      <div
        className="absolute left-0 top-24 z-10"
        style={{
          width: 3,
          height: 36,
          background: 'linear-gradient(180deg, #4a4a5a 0%, #3a3a4a 50%, #2a2a3a 100%)',
          borderRadius: '2px 0 0 2px',
          boxShadow: `
            -1px 0 2px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}
      />
    </>
  )
}

function ScreenContent({ app, color, isHovered }) {
  const features = app.features || []

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* App background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${color}15 0%, ${color}08 30%, #0a0a14 100%)`,
        }}
      />

      {/* Status bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[9px] font-semibold text-white/70">9:41</span>
        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
          </svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
            <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
            <line x1="23" y1="13" x2="23" y2="11" />
          </svg>
        </div>
      </div>

      {/* App icon */}
      <div className="relative z-10 flex flex-col items-center mt-6 px-4">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
            boxShadow: `0 8px 24px ${color}40`,
          }}
          animate={isHovered ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <span className="text-white text-xl font-bold relative z-10 drop-shadow-lg">
            {app.title.charAt(0)}
          </span>
        </motion.div>

        <h4 className="text-[11px] font-bold text-white text-center leading-tight mb-1 line-clamp-2">
          {app.title}
        </h4>
        <p className="text-[9px] text-white/40 text-center line-clamp-1">
          {app.description}
        </p>
      </div>

      {/* Feature pills */}
      <div className="relative z-10 flex flex-wrap justify-center gap-1 mt-3 px-3">
        {features.slice(0, 3).map((f, i) => (
          <span
            key={i}
            className="px-2 py-0.5 text-[7px] font-medium rounded-full"
            style={{
              background: `${color}20`,
              color: `${color}`,
              border: `1px solid ${color}30`,
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Bottom action */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center">
        <motion.div
          className="px-4 py-1.5 rounded-full text-[9px] font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
            boxShadow: `0 4px 12px ${color}40`,
          }}
          animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Open App
        </motion.div>
      </div>

      {/* Screen reflections on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.08) 45%, transparent 50%)',
        }}
      />
    </div>
  )
}

function PhoneReflection({ mouseX, mouseY, isHovered }) {
  const xPct = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), SPRING)
  const yPct = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), SPRING)
  const bg = useMotionTemplate`radial-gradient(ellipse at ${xPct}% ${yPct}%, rgba(255,255,255,0.15) 0%, transparent 50%)`

  return (
    <motion.div
      className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-40"
      animate={{ opacity: isHovered ? 0.8 : 0.3 }}
      transition={{ duration: 0.3 }}
      style={{ background: bg }}
    />
  )
}

function HolographicGlow({ color, isHovered }) {
  return (
    <motion.div
      className="absolute -inset-3 rounded-[3rem] pointer-events-none z-[-1]"
      animate={isHovered ? {
        boxShadow: [
          `0 0 30px ${color}20, 0 0 60px ${color}10, 0 20px 60px rgba(0,0,0,0.4)`,
          `0 0 50px ${color}30, 0 0 100px ${color}15, 0 20px 60px rgba(0,0,0,0.4)`,
          `0 0 30px ${color}20, 0 0 60px ${color}10, 0 20px 60px rgba(0,0,0,0.4)`,
        ],
      } : {
        boxShadow: `0 10px 40px rgba(0,0,0,0.3)`,
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function SmartphoneDevice({ app, isHovered, mouseX, mouseY, color }) {
  const phoneRef = useRef(null)

  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      {/* Shadow on surface */}
      <motion.div
        className="absolute -bottom-6 left-[10%] right-[10%] h-8 rounded-[50%] blur-xl z-0"
        style={{ background: `radial-gradient(ellipse, ${color}25 0%, transparent 70%)` }}
        animate={{
          opacity: isHovered ? 0.9 : 0.4,
          scaleX: isHovered ? 1.1 : 0.9,
          y: isHovered ? 6 : 0,
          blur: isHovered ? 20 : 15,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Phone body */}
      <motion.div
        ref={phoneRef}
        className="relative mx-auto"
        style={{
          width: 200,
          height: 400,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: isHovered ? -12 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Metallic frame */}
        <div
          className="absolute inset-0 rounded-[2.5rem] overflow-hidden"
          style={{
            background: `linear-gradient(145deg, 
              #e8e8ec 0%, 
              #c8c8cc 15%, 
              #a8a8ac 30%, 
              #88888c 50%, 
              #a8a8ac 70%, 
              #c8c8cc 85%, 
              #e8e8ec 100%)`,
            padding: '2px',
          }}
        >
          {/* Inner frame shadow */}
          <div
            className="absolute inset-0 rounded-[2.5rem]"
            style={{
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.2)
              `,
            }}
          />
        </div>

        {/* Back panel (visible around edges) */}
        <div
          className="absolute inset-[2px] rounded-[2.3rem] overflow-hidden"
          style={{
            background: `linear-gradient(145deg, #1a1a1e 0%, #0d0d12 50%, #1a1a1e 100%)`,
          }}
        >
          {/* Glass back effect */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)',
            }}
          />
        </div>

        {/* Camera module */}
        <CameraModule color={color} isHovered={isHovered} />

        {/* Side buttons */}
        <SideButtons color={color} isHovered={isHovered} />

        {/* Screen area */}
        <div
          className="absolute inset-[3px] rounded-[2.2rem] overflow-hidden z-10"
          style={{
            boxShadow: `
              inset 0 0 0 1px rgba(255,255,255,0.05),
              inset 0 2px 8px rgba(0,0,0,0.3)
            `,
          }}
        >
          <ScreenContent app={app} color={color} isHovered={isHovered} />
        </div>

        {/* Dynamic Island */}
        <DynamicIsland color={color} isHovered={isHovered} />

        {/* Phone reflection */}
        <PhoneReflection mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} />

        {/* Edge highlight */}
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-50"
          animate={{
            boxShadow: isHovered
              ? `inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.1)`
              : `inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.05)`,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Holographic glow */}
      <HolographicGlow color={color} isHovered={isHovered} />
    </div>
  )
}
