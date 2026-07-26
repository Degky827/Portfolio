import { useState, useEffect, useCallback, memo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIntroAudio } from '../audio/useIntroAudio'
import ProgressBar from '../components/ProgressBar'
import ParticleField from '../components/ParticleField'
import ScanlineOverlay from '../components/ScanlineOverlay'

const MODULES = [
  { text: 'Initializing Developer Intelligence Core...', color: '#06b6d4' },
  { text: 'Building React Runtime...', color: '#61dafb' },
  { text: 'Loading TypeScript Compiler...', color: '#3178c6' },
  { text: 'Initializing Three.js Rendering Engine...', color: '#8b5cf6' },
  { text: 'Synchronizing Git Repository...', color: '#f05032' },
  { text: 'Connecting GitHub Profile...', color: '#ffffff' },
  { text: 'Connecting LinkedIn Network...', color: '#0a66c2' },
  { text: 'Initializing Node.js Runtime...', color: '#68a063' },
  { text: 'Loading MongoDB Collections...', color: '#47a248' },
  { text: 'Connecting Express API...', color: '#ffffff' },
  { text: 'Deploying Cloud Services...', color: '#ff9900' },
  { text: 'Starting CI/CD Pipeline...', color: '#06b6d4' },
  { text: 'Optimizing Performance Engine...', color: '#f59e0b' },
  { text: 'Running Security Scan...', color: '#ef4444' },
  { text: 'Building Interactive Experience...', color: '#8b5cf6' },
]

function CheckmarkIcon({ color, size = 14 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.path
        d="M5 12l5 5L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}

function Phase2CoreInitialization({ onComplete }) {
  const [completedModules, setCompletedModules] = useState([])
  const [currentModule, setCurrentModule] = useState(-1)
  const [overallProgress, setOverallProgress] = useState(0)
  const { playCheckmark, playRelayClick } = useIntroAudio()
  const indexRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < MODULES.length) {
        const idx = indexRef.current
        setCurrentModule(idx)
        playRelayClick()

        setTimeout(() => {
          setCompletedModules((prev) => [...prev, idx])
          setOverallProgress((idx + 1) / MODULES.length)
          playCheckmark()
          indexRef.current++
        }, 150 + Math.random() * 100)
      } else {
        clearInterval(interval)
        setTimeout(() => onComplete?.(), 500)
      }
    }, 250)

    return () => clearInterval(interval)
  }, [onComplete, playCheckmark, playRelayClick])

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
      <ParticleField count={100} color="#06b6d4" />

      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="font-mono text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#06b6d480' }}>
            System Bootstrap
          </div>
          <div className="font-mono text-sm" style={{ color: '#06b6d4' }}>
            Loading modules...
          </div>
        </motion.div>

        {/* Progress bar */}
        <ProgressBar progress={overallProgress} color="#06b6d4" height={2} className="mb-6" />

        {/* Module list */}
        <div className="space-y-1.5 max-h-[50vh] overflow-hidden">
          <AnimatePresence mode="popLayout">
            {MODULES.map((mod, i) => {
              const isDone = completedModules.includes(i)
              const isActive = currentModule === i && !isDone
              const isVisible = i <= currentModule

              if (!isVisible) return null

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 font-mono text-xs sm:text-sm py-1"
                >
                  {isDone ? (
                    <CheckmarkIcon color={mod.color} />
                  ) : isActive ? (
                    <motion.div
                      animate={{ opacity: [0.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-3.5 h-3.5 rounded-full border-2"
                      style={{ borderColor: mod.color }}
                    />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-white/10" />
                  )}
                  <span
                    style={{
                      color: isDone ? mod.color : isActive ? '#ffffff' : '#ffffff40',
                      textShadow: isDone ? `0 0 10px ${mod.color}40` : 'none',
                    }}
                  >
                    {isDone && <span style={{ color: '#4ade80' }}>✓ </span>}
                    {mod.text}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="mt-6 font-mono text-xs flex justify-between"
          style={{ color: '#06b6d460' }}
        >
          <span>Modules: {completedModules.length}/{MODULES.length}</span>
          <span>Integrity: {Math.round(overallProgress * 100)}%</span>
        </motion.div>
      </div>

      <ScanlineOverlay opacity={0.02} />
    </div>
  )
}

export default memo(Phase2CoreInitialization)
