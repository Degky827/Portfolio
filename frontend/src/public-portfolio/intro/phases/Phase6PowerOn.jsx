import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIntroAudio } from '../audio/useIntroAudio'
import ParticleField from '../components/ParticleField'
import ScanlineOverlay from '../components/ScanlineOverlay'

const POWER_SEQUENCE = [
  { label: 'Keyboard RGB', delay: 0, color: '#8b5cf6' },
  { label: 'PC Fans', delay: 300, color: '#06b6d4' },
  { label: 'Monitor Display', delay: 600, color: '#4ade80' },
  { label: 'Room Lighting', delay: 900, color: '#f59e0b' },
  { label: 'Ambient Particles', delay: 1100, color: '#ec4899' },
]

function PowerIndicator({ item, isActive, isComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 font-mono text-sm"
    >
      <div className="relative">
        <motion.div
          animate={isActive ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: isComplete ? item.color : isActive ? item.color : '#ffffff15',
            boxShadow: isComplete ? `0 0 12px ${item.color}80, 0 0 4px ${item.color}` : 'none',
          }}
        />
        {isActive && (
          <motion.div
            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
        )}
      </div>
      <span
        style={{
          color: isComplete ? item.color : '#ffffff30',
          textShadow: isComplete ? `0 0 10px ${item.color}30` : 'none',
        }}
      >
        {item.label}
      </span>
      {isComplete && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: '#4ade80', fontSize: 10 }}
        >
          ✓
        </motion.span>
      )}
    </motion.div>
  )
}

function Phase6PowerOn({ onComplete }) {
  const [completedSteps, setCompletedSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [showWelcome, setShowWelcome] = useState(false)
  const { playRelayClick, playPowerOn, playDigitalChime } = useIntroAudio()

  useEffect(() => {
    let step = 0
    const interval = setInterval(() => {
      if (step < POWER_SEQUENCE.length) {
        setCurrentStep(step)
        playRelayClick()
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, step])
          playPowerOn()
          step++
        }, 200)
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setShowWelcome(true)
          playDigitalChime()
          setTimeout(() => onComplete?.(), 2000)
        }, 300)
      }
    }, 400)
    return () => clearInterval(interval)
  }, [onComplete, playRelayClick, playPowerOn, playDigitalChime])

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
      <ParticleField count={100} color="#06b6d4" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="font-mono text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#06b6d480' }}>
            System Power-On
          </div>
          <div className="font-mono text-sm" style={{ color: '#06b6d4' }}>
            Activating hardware...
          </div>
        </motion.div>

        {/* Power sequence */}
        <div className="space-y-3">
          {POWER_SEQUENCE.map((item, i) => (
            <PowerIndicator
              key={item.label}
              item={item}
              isActive={currentStep === i}
              isComplete={completedSteps.includes(i)}
            />
          ))}
        </div>

        {/* Welcome message */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-mono text-3xl sm:text-4xl font-bold mb-2"
                style={{
                  color: '#06b6d4',
                  textShadow: '0 0 30px #06b6d440, 0 0 60px #06b6d420',
                }}
              >
                WELCOME
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-mono text-lg tracking-[0.2em] mb-3"
                style={{ color: '#8b5cf6' }}
              >
                DESALEGN OS
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-mono text-xs"
                style={{ color: '#ffffff50' }}
              >
                Preparing Interactive Portfolio...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScanlineOverlay opacity={0.02} />
    </div>
  )
}

export default memo(Phase6PowerOn)
