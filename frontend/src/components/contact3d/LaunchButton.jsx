import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'

function Particle({ x, y, angle, distance, delay }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: [1, 0.8, 0],
        scale: [1, 0.5, 0],
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: 'easeOut',
      }}
      style={{
        left: x,
        top: y,
        background: `radial-gradient(circle, rgba(6,182,212,0.9), rgba(34,211,238,0.6))`,
        boxShadow: '0 0 6px rgba(6,182,212,0.6)',
      }}
    />
  )
}

function EnergyRing({ isActive }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              border: '2px solid transparent',
              borderTopColor: 'rgba(6,182,212,0.8)',
              borderRightColor: 'rgba(34,211,238,0.4)',
              filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.5))',
            }}
          />
          {/* Inner ring */}
          <motion.div
            className="absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{
              border: '1.5px solid transparent',
              borderTopColor: 'rgba(6,182,212,0.7)',
              borderLeftColor: 'rgba(34,211,238,0.4)',
              filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.4))',
            }}
          />
          {/* Core pulse */}
          <motion.div
            className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.4), rgba(34,211,238,0.2), transparent)',
              filter: 'blur(4px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function LaunchButton({ disabled, isSubmitting, isValid, label, ariaLabel }) {
  const btnRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState([])
  const [particles, setParticles] = useState([])
  const [showFlash, setShowFlash] = useState(false)

  const handleClick = useCallback((e) => {
    if (disabled || !isValid) return

    const rect = btnRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Ripple
    const rippleId = Date.now()
    setRipples((prev) => [...prev, { id: rippleId, x, y }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== rippleId)), 800)

    // Particle explosion
    const particleCount = 12
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      angle: (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5,
      distance: 40 + Math.random() * 60,
      delay: Math.random() * 0.1,
    }))
    setParticles((prev) => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)))
    }, 1000)

    // Holographic flash
    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 400)
  }, [disabled, isValid])

  const canLaunch = isValid && !isSubmitting

  return (
    <motion.button
      ref={btnRef}
      type="submit"
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="relative w-full py-4 sm:py-5 font-bold sm:font-black text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-colors duration-300 flex items-center justify-center gap-3 sm:gap-4 group focus:outline-none overflow-hidden"
      whileHover={canLaunch ? { translateY: -3, scale: 1.01 } : {}}
      whileTap={canLaunch ? { scale: 0.98, translateY: 0 } : {}}
      animate={{
        rotateX: isHovered && canLaunch ? 2 : 0,
      }}
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
        background: canLaunch
          ? 'linear-gradient(165deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.08) 50%, rgba(34,211,238,0.06) 100%)'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${canLaunch ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.06)'}`,
        color: canLaunch ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.25)',
        cursor: canLaunch ? 'pointer' : 'not-allowed',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: canLaunch
          ? isHovered
            ? '0 12px 40px rgba(6,182,212,0.35), 0 0 30px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.12)'
            : '0 8px 30px rgba(6,182,212,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 4px 16px rgba(0,0,0,0.15)',
      }}
      aria-label={ariaLabel}
    >
      {/* Neon border glow */}
      <motion.div
        className="absolute inset-[-1px] rounded-xl sm:rounded-2xl pointer-events-none"
        animate={{
          opacity: canLaunch ? (isHovered ? 1 : 0.3) : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          padding: '1px',
          background: 'conic-gradient(from 0deg, rgba(6,182,212,0.55), rgba(34,211,238,0.25), rgba(6,182,212,0.55))',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          filter: canLaunch && isHovered ? 'drop-shadow(0 0 8px rgba(6,182,212,0.4))' : 'none',
        }}
      />

      {/* Holographic reflection */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl"
        animate={{
          background: isHovered && canLaunch
            ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(255,255,255,0.04) 60%, transparent 100%)'
            : 'transparent',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated shimmer */}
      {canLaunch && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl"
          animate={{
            background: [
              'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.06) 50%, transparent 100%)',
              'linear-gradient(90deg, transparent -50%, rgba(34,211,238,0.06) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none rounded-full"
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              left: ripple.x - 100,
              top: ripple.y - 100,
              background: 'radial-gradient(circle, rgba(6,182,212,0.3), rgba(34,211,238,0.15), transparent)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Particle explosion */}
      <AnimatePresence>
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </AnimatePresence>

      {/* Holographic flash on click */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(34,211,238,0.2), rgba(6,182,212,0.3))',
              boxShadow: '0 0 40px rgba(6,182,212,0.4)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Energy ring loading */}
      <EnergyRing isActive={isSubmitting} />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 sm:gap-3">
        {isSubmitting ? (
          <motion.span
            className="text-sm sm:text-base font-bold"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Launching...
          </motion.span>
        ) : (
          <>
            <span className="relative">
              {label}
            </span>
            <motion.span
              animate={canLaunch ? { x: [0, 4, 0], rotate: [0, 10, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
              className="relative"
              style={{
                filter: canLaunch ? 'drop-shadow(0 0 4px rgba(6,182,212,0.5))' : 'none',
              }}
            >
              <Send size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.span>
          </>
        )}
      </span>

      {/* Bottom energy line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] pointer-events-none rounded-full"
        animate={{
          width: canLaunch ? (isHovered ? '80%' : '40%') : '0%',
          opacity: canLaunch ? 1 : 0,
        }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.7), rgba(34,211,238,0.5), transparent)',
          boxShadow: canLaunch ? '0 0 12px rgba(6,182,212,0.4)' : 'none',
        }}
      />
    </motion.button>
  )
}
