import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIntroAudio } from '../audio/useIntroAudio'
import CircularScanner from '../components/CircularScanner'
import ParticleField from '../components/ParticleField'
import ScanlineOverlay from '../components/ScanlineOverlay'

const DEVELOPER_INFO = [
  { label: 'Name', value: 'Desalegn Kasaye' },
  { label: 'Role', value: 'Full Stack Developer' },
]

const SPECIALIZATIONS = [
  { name: 'React', color: '#61dafb' },
  { name: 'Node.js', color: '#68a063' },
  { name: 'Express.js', color: '#ffffff' },
  { name: 'MongoDB', color: '#47a248' },
  { name: 'Flutter', color: '#02569b' },
  { name: 'Three.js', color: '#8b5cf6' },
]

const SYSTEM_INFO = [
  { label: 'Status', value: 'Available for Collaboration', color: '#4ade80' },
  { label: 'System Integrity', value: '100%', color: '#06b6d4' },
  { label: 'Portfolio Version', value: 'v3.0', color: '#8b5cf6' },
]

function Phase3IdentityRecognition({ onComplete }) {
  const [scanProgress, setScanProgress] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showSpecs, setShowSpecs] = useState(false)
  const [showSystem, setShowSystem] = useState(false)
  const { playScanPulse, playDigitalChime, playBeep } = useIntroAudio()

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 0.02
        if (next >= 1) {
          clearInterval(interval)
          return 1
        }
        return next
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scanProgress > 0.3 && !showInfo) {
      setShowInfo(true)
      playScanPulse()
    }
    if (scanProgress > 0.6 && !showSpecs) {
      setShowSpecs(true)
      playDigitalChime()
    }
    if (scanProgress >= 1 && !showSystem) {
      setShowSystem(true)
      playBeep()
      setTimeout(() => onComplete?.(), 1500)
    }
  }, [scanProgress, showInfo, showSpecs, showSystem, onComplete, playScanPulse, playDigitalChime, playBeep])

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
      <ParticleField count={120} color="#8b5cf6" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        {/* Scanner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularScanner color="#06b6d4" size={180} progress={scanProgress} />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={scanProgress < 1 ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
              transition={{ duration: 1, repeat: scanProgress < 1 ? Infinity : 0 }}
              className="text-center"
            >
              <div className="font-mono text-xs tracking-widest" style={{ color: '#06b6d480' }}>
                {scanProgress < 1 ? 'SCANNING...' : 'IDENTIFIED'}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Developer Detected */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              className="text-center"
            >
              <div
                className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
                style={{ color: '#4ade80', textShadow: '0 0 15px #4ade8040' }}
              >
                Developer Detected
              </div>
              {DEVELOPER_INFO.map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="font-mono text-sm mb-1"
                >
                  <span style={{ color: '#ffffff50' }}>{info.label}: </span>
                  <span style={{ color: '#ffffff', textShadow: '0 0 10px #06b6d430' }}>{info.value}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Specializations */}
        <AnimatePresence>
          {showSpecs && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-2 max-w-md"
            >
              <div className="w-full text-center font-mono text-xs tracking-widest mb-1" style={{ color: '#ffffff40' }}>
                Specializations
              </div>
              {SPECIALIZATIONS.map((spec, i) => (
                <motion.span
                  key={spec.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="px-3 py-1 rounded-full font-mono text-xs border"
                  style={{
                    color: spec.color,
                    borderColor: `${spec.color}40`,
                    backgroundColor: `${spec.color}10`,
                    textShadow: `0 0 8px ${spec.color}30`,
                  }}
                >
                  {spec.name}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Info */}
        <AnimatePresence>
          {showSystem && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-6 font-mono text-xs"
            >
              {SYSTEM_INFO.map((info) => (
                <div key={info.label} className="text-center">
                  <div style={{ color: '#ffffff40' }}>{info.label}</div>
                  <div style={{ color: info.color, textShadow: `0 0 8px ${info.color}30` }}>{info.value}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScanlineOverlay opacity={0.02} />
    </div>
  )
}

export default memo(Phase3IdentityRecognition)
