import { useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import { useIntroAudio } from '../audio/useIntroAudio'
import ParticleField from '../components/ParticleField'
import ScanlineOverlay from '../components/ScanlineOverlay'

function Phase7EnterWorkspace({ onComplete }) {
  const { playWhoosh } = useIntroAudio()

  useEffect(() => {
    const t1 = setTimeout(() => playWhoosh(), 200)
    const t2 = setTimeout(() => onComplete?.(), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete, playWhoosh])

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
      <ParticleField count={200} color="#06b6d4" speed={0.8} />

      {/* Center expanding portal */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0.5, 50], opacity: [0, 1, 0] }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute rounded-full"
        style={{
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, #06b6d440 0%, #06b6d410 40%, transparent 70%)',
          boxShadow: '0 0 60px #06b6d430, 0 0 120px #06b6d415',
        }}
      />

      {/* Horizontal light streak */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 3], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        className="absolute h-px"
        style={{
          width: '100vw',
          background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
          boxShadow: '0 0 20px #06b6d460',
        }}
      />

      {/* Vertical light streak */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: [0, 1, 3], opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
        className="absolute w-px"
        style={{
          height: '100vh',
          background: 'linear-gradient(180deg, transparent, #8b5cf6, transparent)',
          boxShadow: '0 0 20px #8b5cf660',
        }}
      />

      <ScanlineOverlay opacity={0.01} speed={3} />
    </div>
  )
}

export default memo(Phase7EnterWorkspace)
