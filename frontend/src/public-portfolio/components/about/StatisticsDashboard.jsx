import { memo, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Award, Users, TrendingUp, Briefcase, Cpu, Code } from 'lucide-react'
import StatisticCard from './StatisticCard'
import DashboardPlatform from './DashboardPlatform'

/**
 * StatisticsDashboard
 *
 * Premium futuristic dashboard assembling:
 * - DashboardPlatform (metallic base with LED strips)
 * - StatisticCard (glass modules with icons, counters, titles)
 *
 * Features:
 * - Mouse-reactive rotation (max 3°)
 * - Platform lighting
 * - Responsive grid (3 → 2 → 1 columns)
 */

// Icon mapping for metrics
const iconComponents = { Award, Users, TrendingUp, Briefcase, Cpu, Code }

// Accent colors for each card
const accentColors = ['#f59e0b', '#60a5fa', '#34d399', '#8b5cf6', '#22d3ee', '#f472b6']

const StatisticsDashboard = memo(function StatisticsDashboard({
  metrics = [],
  t,
  isAm,
}) {
  const containerRef = useRef(null)

  // Mouse-tracking for subtle 3D rotation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [1.5, -1.5]), {
    stiffness: 100,
    damping: 18,
  })
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-1, 1]), {
    stiffness: 100,
    damping: 18,
  })

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Process metrics with labels
  const processedMetrics = metrics.map((metric, idx) => {
    const defaultLabels = [
      t('about.metricNetworkDesigner'),
      t('about.metricHappyClients'),
      t('about.metricYearsExperience'),
    ]
    const defaultLabel = defaultLabels[idx] || `Metric ${idx + 1}`
    const label = isAm
      ? (metric.titleAm || metric.title || defaultLabel)
      : (metric.title || defaultLabel)

    return {
      icon: metric.icon || 'Award',
      title: label,
      value: metric.value || (idx === 0 ? '' : idx === 1 ? '50+' : '5+'),
    }
  })

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Platform ambient glow */}
      <div
        className="absolute -inset-[40px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(139,92,246,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <DashboardPlatform>
        <div className="p-4 sm:p-6 md:p-8">
          {/* Section label */}
          <div className="flex items-center gap-2 mb-5 sm:mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-purple-400/50">
              Dashboard Metrics
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {processedMetrics.map((metric, idx) => (
              <StatisticCard
                key={idx}
                icon={iconComponents[metric.icon] || Award}
                title={metric.title}
                value={metric.value}
                color={accentColors[idx % accentColors.length]}
                animationDelay={idx * 0.1}
                index={idx}
              />
            ))}
          </div>
        </div>
      </DashboardPlatform>
    </motion.div>
  )
})

export default StatisticsDashboard
