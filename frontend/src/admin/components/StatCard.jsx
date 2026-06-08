import { motion } from 'framer-motion'

export default function StatCard({ title, value, icon: Icon, trend, loading, delay = 0 }) {
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
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
          <Icon size={24} />
        </div>
        {trend !== undefined && (
          <span
            className={`text-sm font-bold ${
              trend >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend >= 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-gray-900 dark:text-white">
        {value?.toLocaleString() ?? 0}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
    </motion.div>
  )
}
