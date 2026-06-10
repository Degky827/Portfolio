import { motion } from 'framer-motion'

export default function PageHeader({ title, description, subtitle, actions, icon: Icon }) {
  const desc = description || subtitle
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800"
    >
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 items-center justify-center shrink-0">
            <Icon size={20} className="text-primary" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
            {title}
          </h1>
          {desc && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {desc}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
