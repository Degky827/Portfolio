import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import { useIntroAudio } from '../audio/useIntroAudio'
import BlinkingCursor from '../components/BlinkingCursor'
import ParticleField from '../components/ParticleField'
import ScanlineOverlay from '../components/ScanlineOverlay'

function Phase1DigitalAwakening({ onComplete }) {
  const [showCursor, setShowCursor] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [showText, setShowText] = useState(false)
  const { displayed, isComplete } = useTypewriter('Wake Developer Environment...', 50, 800, showText)
  const { playStartupHum, playKeystroke } = useIntroAudio()

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowCursor(true)
      playStartupHum()
    }, 300)
    const t2 = setTimeout(() => setShowParticles(true), 1200)
    const t3 = setTimeout(() => setShowText(true), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [playStartupHum])

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => onComplete?.(), 800)
      return () => clearTimeout(t)
    }
  }, [isComplete, onComplete])

  useEffect(() => {
    if (showText && displayed.length > 0) {
      playKeystroke()
    }
  }, [displayed.length, showText, playKeystroke])

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Subtle particles */}
      <AnimatePresence>
        {showParticles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            <ParticleField count={150} color="#06b6d4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showCursor ? 0.2 : 0 }}
        transition={{ duration: 2 }}
        className="absolute"
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #06b6d420 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Terminal text */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-mono text-lg sm:text-xl md:text-2xl tracking-wider"
          style={{
            color: '#06b6d4',
            textShadow: '0 0 20px #06b6d440, 0 0 40px #06b6d420',
          }}
        >
          {showText && (
            <>
              <span style={{ color: '#4ade80' }}>{'>'}</span>{' '}
              {displayed}
              {showCursor && !isComplete && <BlinkingCursor color="#06b6d4" size={20} />}
            </>
          )}
          {!showText && showCursor && <BlinkingCursor color="#06b6d4" size={20} />}
        </motion.div>
      </div>

      <ScanlineOverlay opacity={0.02} />
    </div>
  )
}

export default memo(Phase1DigitalAwakening)
