import { useState, useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import { useIntroAudio } from '../audio/useIntroAudio'
import ParticleField from '../components/ParticleField'
import ScanlineOverlay from '../components/ScanlineOverlay'

const METRICS = [
  { label: 'Repositories', value: '24+', icon: '◆', color: '#06b6d4' },
  { label: 'Projects Completed', value: '30+', icon: '▲', color: '#8b5cf6' },
  { label: 'Years of Experience', value: '3+', icon: '●', color: '#4ade80' },
  { label: 'Technologies', value: '30+', icon: '⬡', color: '#f59e0b' },
  { label: 'Git Commits', value: '500+', icon: '■', color: '#06b6d4' },
  { label: 'Open Source', value: '12+', icon: '☆', color: '#ec4899' },
  { label: 'Performance', value: '98%', icon: '◈', color: '#4ade80' },
  { label: 'Code Quality', value: 'A+', icon: '◆', color: '#06b6d4' },
  { label: 'Deploy Status', value: 'LIVE', icon: '●', color: '#4ade80' },
]

function MetricPanel({ metric, index }) {
  const [count, setCount] = useState(0)
  const isNumeric = /^\d+/.test(metric.value)

  useEffect(() => {
    if (!isNumeric) return
    const target = parseInt(metric.value)
    const duration = 800
    const steps = 20
    const increment = target / steps
    let step = 0

    const interval = setInterval(() => {
      step++
      setCount(Math.min(Math.round(increment * step), target))
      if (step >= steps) clearInterval(interval)
    }, duration / steps)

    return () => clearInterval(interval)
  }, [metric.value, isNumeric])

  const displayValue = isNumeric ? `${count}${metric.value.replace(/\d+/, '')}` : metric.value

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-4 rounded-xl border backdrop-blur-sm"
      style={{
        borderColor: `${metric.color}25`,
        backgroundColor: `${metric.color}08`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-3 right-3 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${metric.color}60, transparent)` }}
      />

      <div className="flex items-center gap-2 mb-2">
        <span style={{ color: metric.color, fontSize: 10 }}>{metric.icon}</span>
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#ffffff50' }}>
          {metric.label}
        </span>
      </div>

      <div
        className="font-mono text-xl font-bold"
        style={{ color: metric.color, textShadow: `0 0 15px ${metric.color}30` }}
      >
        {displayValue}
      </div>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${metric.color}30, transparent)` }}
      />
    </motion.div>
  )
}

function Phase4Dashboard({ onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const { playBeep } = useIntroAudio()

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= METRICS.length) {
          clearInterval(interval)
          setTimeout(() => onComplete?.(), 800)
          return prev
        }
        playBeep()
        return prev + 1
      })
    }, 200)
    return () => clearInterval(interval)
  }, [onComplete, playBeep])

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
      <ParticleField count={80} color="#8b5cf6" />

      <div className="relative z-10 w-full max-w-4xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="font-mono text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#8b5cf680' }}>
            Engineering Dashboard
          </div>
          <div className="font-mono text-sm" style={{ color: '#06b6d4' }}>
            Live Metrics
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {METRICS.slice(0, visibleCount).map((metric, i) => (
            <MetricPanel key={metric.label} metric={metric} index={i} />
          ))}
        </div>
      </div>

      <ScanlineOverlay opacity={0.02} />
    </div>
  )
}

export default memo(Phase4Dashboard)
