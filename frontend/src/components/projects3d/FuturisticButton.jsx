import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'

const SPRING = { stiffness: 400, damping: 25, mass: 0.4 }

export default function FuturisticButton({
  href,
  icon: Icon,
  label,
  color = '#6366f1',
  variant = 'ghost',
  onClick,
}) {
  const btnRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState([])
  const [flash, setFlash] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), SPRING)
  const translateZ = useSpring(isHovered ? 16 : 0, SPRING)
  const scale = useSpring(isHovered ? 1.08 : 1, SPRING)

  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), SPRING)
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), SPRING)

  const handleMouseMove = useCallback((e) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const handleClick = useCallback((e) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700)

    setFlash(true)
    setTimeout(() => setFlash(false), 300)

    onClick?.(e)
  }, [onClick])

  const isPrimary = variant === 'primary'

  return (
    <motion.a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation()
        handleClick(e)
      }}
      style={{
        perspective: '600px',
        rotateX,
        rotateY,
        translateZ,
        scale,
        transformStyle: 'preserve-3d',
      }}
      className="relative inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold tracking-wider uppercase rounded-xl cursor-pointer overflow-hidden group"
    >
      {/* Depth shadow */}
      <motion.div
        className="absolute inset-0 rounded-xl -z-10"
        animate={{
          boxShadow: isHovered
            ? isPrimary
              ? `0 8px 30px ${color}50, 0 2px 8px ${color}30, inset 0 1px 0 rgba(255,255,255,0.15)`
              : `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${color}25, inset 0 1px 0 rgba(255,255,255,0.08)`
            : isPrimary
              ? `0 2px 10px ${color}25, 0 1px 3px rgba(0,0,0,0.3)`
              : '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Glass background */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          background: isPrimary
            ? isHovered
              ? `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}bb 100%)`
              : `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`
            : isHovered
              ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.08) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Neon border */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ padding: '1px' }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            background: isHovered
              ? `conic-gradient(from 0deg, ${color}80, transparent 30%, ${color}40 50%, transparent 70%, ${color}80)`
              : `conic-gradient(from 0deg, ${color}25, transparent 30%, ${color}10 50%, transparent 70%, ${color}25)`,
          }}
          transition={{ duration: isHovered ? 3 : 0, repeat: Infinity, ease: 'linear' }}
          style={{
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          }}
        />
      </motion.div>

      {/* Glare reflection */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
        }}
      />

      {/* Holographic flash on click */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none z-20"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `linear-gradient(135deg, ${color}60, rgba(255,255,255,0.4), ${color}60)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none z-10"
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              left: ripple.x - 100,
              top: ripple.y - 100,
              background: `radial-gradient(circle, ${color}50, transparent 70%)`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Breathing glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? [
                `inset 0 0 15px ${color}15, 0 0 8px ${color}20`,
                `inset 0 0 25px ${color}25, 0 0 15px ${color}35`,
                `inset 0 0 15px ${color}15, 0 0 8px ${color}20`,
              ]
            : 'inset 0 0 0px transparent, 0 0 0px transparent',
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Icon */}
      <motion.span
        className="relative z-10 flex items-center justify-center"
        animate={{
          rotate: isHovered ? [0, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Icon
          size={13}
          className="transition-colors duration-300"
          style={{ color: isPrimary ? 'white' : isHovered ? color : '#94a3b8' }}
        />
      </motion.span>

      {/* Label */}
      <span
        className="relative z-10 transition-colors duration-300"
        style={{ color: isPrimary ? 'white' : isHovered ? color : '#94a3b8' }}
      >
        {label}
      </span>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)',
        }}
      />
    </motion.a>
  )
}
