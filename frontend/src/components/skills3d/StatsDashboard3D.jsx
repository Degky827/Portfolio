import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { Code2, Award, Layers } from 'lucide-react'

function useAnimatedCounter(target, duration = 2, inView = false) {
  const [value, setValue] = useState(0)
  const controls = useRef(null)

  useEffect(() => {
    if (!inView) return
    const num = parseInt(target, 10)
    if (isNaN(num)) return

    controls.current = animate(0, num, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setValue(Math.round(v)),
    })

    return () => controls.current?.stop()
  }, [target, duration, inView])

  return value
}

export default function StatsDashboard3D({
  technologies,
  certificates,
  categories,
}) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const techCount = useAnimatedCounter(technologies, 2, isInView)
  const certCount = useAnimatedCounter(certificates, 1.8, isInView)
  const catCount = useAnimatedCounter(categories, 1.5, isInView)

  const stats = useMemo(() => [
    {
      label: 'Technologies',
      value: technologies,
      animatedValue: techCount,
      color: '#6366f1',
      icon: Code2,
    },
    {
      label: 'Certificates',
      value: certificates,
      animatedValue: certCount,
      color: '#8b5cf6',
      icon: Award,
    },
    {
      label: 'Categories',
      value: categories,
      animatedValue: catCount,
      color: '#06b6d4',
      icon: Layers,
    },
  ], [technologies, certificates, categories, techCount, certCount, catCount])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[var(--border-primary)] relative z-10"
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>
          Analytics
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#6366f1]/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative flex items-center gap-2.5 p-3 sm:p-4 rounded-xl border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <div className="w-8 h-8 flex items-center justify-center rotate-45 rounded-md shrink-0" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon size={14} className="-rotate-45" style={{ color: stat.color }} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-bold leading-none" style={{ color: stat.color }}>
                {stat.animatedValue}+
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                {stat.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
