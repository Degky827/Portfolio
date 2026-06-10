import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function AnimatedCounter({ value, duration = 1.5 }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    startRef.current = null
    const target = Number(value) || 0

    function animate(timestamp) {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, duration])

  return <>{display.toLocaleString()}</>
}

export default function StatCard({ title, value, icon: Icon, trend, loading, delay = 0, accent = 'primary', subtitle }) {
  const accentMap = {
    primary: { from: '#7c3aed', to: '#6366f1' },
    green: { from: '#059669', to: '#10b981' },
    blue: { from: '#2563eb', to: '#3b82f6' },
    orange: { from: '#ea580c', to: '#f97316' },
    pink: { from: '#db2777', to: '#ec4899' },
    cyan: { from: '#0891b2', to: '#06b6d4' },
  }
  const gradient = accentMap[accent] || accentMap.primary

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-slate-700" />
          <div className="w-16 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="w-24 h-8 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
        <div className="w-32 h-3 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
            style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
          >
            <Icon size={22} />
          </div>
          {trend !== undefined && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3, type: 'spring', stiffness: 300 }}
              className={`text-sm font-bold px-2 py-1 rounded-lg ${
                trend >= 0
                  ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30'
                  : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30'
              }`}
            >
              {trend >= 0 ? '+' : ''}
              {trend}%
            </motion.span>
          )}
        </div>
        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight tabular-nums">
          <AnimatedCounter value={value} />
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}
