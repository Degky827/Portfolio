import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

export default function FuturisticPanel({ children, className = '' }) {
  const panelRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setRotate({ x: y * -8, y: x * 8 })
  }, [])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }, [])

  return (
    <motion.div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1500px',
      }}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
        translateZ: isHovered ? 20 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-1 rounded-3xl pointer-events-none"
        animate={{
          opacity: isHovered ? 0.6 : 0.15,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'conic-gradient(from 0deg, rgba(99,102,241,0.3), rgba(6,182,212,0.2), rgba(139,92,246,0.3), rgba(99,102,241,0.3))',
          filter: 'blur(20px)',
        }}
      />

      {/* Holographic border */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none z-10"
        style={{ padding: '1px' }}
        animate={{ opacity: isHovered ? 1 : 0.25 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={isHovered ? {
            background: [
              'conic-gradient(from 0deg, rgba(99,102,241,0.5), transparent 25%, rgba(6,182,212,0.4) 50%, transparent 75%, rgba(99,102,241,0.5))',
              'conic-gradient(from 360deg, rgba(99,102,241,0.5), transparent 25%, rgba(6,182,212,0.4) 50%, transparent 75%, rgba(99,102,241,0.5))',
            ],
          } : {
            background: 'conic-gradient(from 0deg, rgba(99,102,241,0.15), transparent 25%, rgba(6,182,212,0.1) 50%, transparent 75%, rgba(99,102,241,0.15))',
          }}
          transition={{ duration: isHovered ? 4 : 0, repeat: Infinity, ease: 'linear' }}
          style={{
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          }}
        />
      </motion.div>

      {/* Glass panel body */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(99,102,241,0.03) 100%)',
          backdropFilter: 'blur(40px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: isHovered
            ? '0 30px 80px rgba(0,0,0,0.4), 0 0 40px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 15px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
        }}
      >
        {/* Reflective surface overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          animate={{
            background: isHovered
              ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(255,255,255,0.03) 60%, transparent 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(255,255,255,0.01) 100%)',
          }}
          transition={{ duration: 0.4 }}
          style={{
            transform: `translateX(${rotate.y * 2}px) translateY(${rotate.x * -2}px)`,
            transformStyle: 'preserve-3d',
          }}
        />

        {/* Fine scanlines */}
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-[0.02]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />

        {/* Ambient glow inside */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 pointer-events-none z-0"
          animate={{
            opacity: isHovered ? 0.15 : 0.06,
          }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
