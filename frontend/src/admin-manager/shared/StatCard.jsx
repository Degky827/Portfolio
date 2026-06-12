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

const accentConfig = {
  primary: { gradient: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', darkText: 'dark:text-indigo-400', shadow: 'shadow-indigo-500/20' },
  green: { gradient: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', darkText: 'dark:text-emerald-400', shadow: 'shadow-emerald-500/20' },
  blue: { gradient: 'from-blue-500 to-blue-600', light: 'bg-blue-50', text: 'text-blue-600', darkText: 'dark:text-blue-400', shadow: 'shadow-blue-500/20' },
  purple: { gradient: 'from-purple-500 to-purple-600', light: 'bg-purple-50', text: 'text-purple-600', darkText: 'dark:text-purple-400', shadow: 'shadow-purple-500/20' },
  amber: { gradient: 'from-amber-500 to-amber-600', light: 'bg-amber-50', text: 'text-amber-600', darkText: 'dark:text-amber-400', shadow: 'shadow-amber-500/20' },
  cyan: { gradient: 'from-cyan-500 to-cyan-600', light: 'bg-cyan-50', text: 'text-cyan-600', darkText: 'dark:text-cyan-400', shadow: 'shadow-cyan-500/20' },
}

export default function StatCard({ title, value, icon: Icon, trend, loading, delay = 0, accent = 'primary', subtitle }) {
  const config = accentConfig[accent] || accentConfig.primary

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-premium-dark"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 shimmer-bg" />
            <div className="w-14 h-6 rounded-lg bg-gray-100 dark:bg-slate-800 shimmer-bg" />
          </div>
          <div className="w-28 h-9 rounded-lg bg-gray-100 dark:bg-slate-800 shimmer-bg mb-2" />
          <div className="w-24 h-4 rounded bg-gray-100 dark:bg-slate-800 shimmer-bg" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-premium-dark hover:shadow-premium-lg dark:hover:shadow-premium-lg-dark transition-shadow duration-300"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-[0.02] dark:opacity-[0.04]`} />
      </div>
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg ${config.shadow}`}
          >
            <Icon size={22} />
          </motion.div>
          {trend !== undefined && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3, type: 'spring', stiffness: 300 }}
              className={`text-sm font-bold px-2 py-1 rounded-lg ${
                trend >= 0
                  ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30'
                  : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30'
              }`}
            >
              {trend >= 0 ? '+' : ''}
              {trend}%
            </motion.span>
          )}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="text-3xl font-black text-gray-900 dark:text-white tracking-tight tabular-nums"
        >
          <AnimatedCounter value={value} />
        </motion.p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{title}</p>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="text-xs text-gray-400 dark:text-gray-500 mt-0.5"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.gradient} origin-left`}
      />
    </motion.div>
  )
}
