import { memo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import CertificateCard from './CertificateCard'

/**
 * CertificateGallery
 *
 * 3D floating gallery wall for certificates:
 * - Perspective depth layout (NOT flat grid)
 * - Slight rotation variation per item
 * - Floor reflection
 * - Depth-based blur for distance realism
 * - Staggered fade-in + zoom-in from depth on scroll
 */
const CertificateGallery = memo(function CertificateGallery({ certificates = [], t }) {
  const containerRef = useRef(null)

  // Mouse-tracking for subtle 3D rotation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [2, -2]), {
    stiffness: 80,
    damping: 15,
  })
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-1, 1]), {
    stiffness: 80,
    damping: 15,
  })

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  if (certificates.length === 0) return null

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8 }}
      className="relative"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400/50">
          {t('about.certificationsPrefix') || 'Certifications'}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
        <span className="text-[10px] sm:text-[11px] font-mono text-purple-400/40">
          {certificates.length} earned
        </span>
      </div>

      {/* Gallery Grid with Perspective */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
        style={{
          perspective: '1000px',
        }}
      >
        {certificates.map((cert, index) => (
          <CertificateCard
            key={cert.id || index}
            title={cert.title}
            verificationUrl={cert.verificationUrl}
            index={index}
            total={certificates.length}
          />
        ))}
      </div>

      {/* Floor Reflection */}
      <div
        className="absolute -bottom-8 left-[5%] right-[5%] h-[60px] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(34,211,238,0.03), transparent)',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.3), transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.3), transparent)',
          filter: 'blur(4px)',
        }}
        aria-hidden="true"
      />

      {/* Depth Fog */}
      <div
        className="absolute -bottom-4 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(5,2,16,0.8))',
        }}
        aria-hidden="true"
      />
    </motion.div>
  )
})

export default CertificateGallery
