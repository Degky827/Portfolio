import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ThemeToggle from '../components/ThemeToggle'

export default function ThemeSettings() {
  return (
    <div>
      <PageHeader
        title="Theme Settings"
        subtitle="Customize your admin dashboard appearance."
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 max-w-2xl space-y-6"
      >
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Theme Preference</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Choose between light, dark, or system theme. Your preference is saved and persists across sessions.
          </p>
          <ThemeToggle />
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Preview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Sun size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-gray-900">Light Mode</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-gray-200" />
                <div className="h-2 w-1/2 rounded bg-gray-100" />
                <div className="h-8 rounded-lg bg-gray-100 flex items-center px-3">
                  <span className="text-xs text-gray-500">Button</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Moon size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-white">Dark Mode</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-slate-700" />
                <div className="h-2 w-1/2 rounded bg-slate-800" />
                <div className="h-8 rounded-lg bg-slate-800 flex items-center px-3">
                  <span className="text-xs text-slate-400">Button</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">How It Works</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <Monitor size={16} className="shrink-0 mt-0.5 text-gray-400" />
              <span><strong className="text-gray-900 dark:text-white">System</strong> — Follows your operating system's appearance setting.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sun size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <span><strong className="text-gray-900 dark:text-white">Light</strong> — Always uses the light color scheme.</span>
            </li>
            <li className="flex items-start gap-2">
              <Moon size={16} className="shrink-0 mt-0.5 text-blue-400" />
              <span><strong className="text-gray-900 dark:text-white">Dark</strong> — Always uses the dark color scheme.</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
