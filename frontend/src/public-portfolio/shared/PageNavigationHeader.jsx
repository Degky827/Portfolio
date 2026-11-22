import { memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'

const QUICK_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/skills', label: 'Skills' },
  { path: '/projects', label: 'Projects' },
  { path: '/experience', label: 'Experience' },
  { path: '/contact', label: 'Contact' },
]

const PageNavigationHeader = memo(function PageNavigationHeader({ title, subtitle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname.toLowerCase()

  const handleNavigate = (path) => {
    navigate(path)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3 px-4 sm:px-6 rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm">
        {/* Back button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigate('/')}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer"
            aria-label="Back to Home"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </motion.button>

          {title && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <Home size={12} className="opacity-70" />
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-200 font-semibold">{title}</span>
              {subtitle && <span className="opacity-60 text-[11px]">({subtitle})</span>}
            </div>
          )}
        </div>

        {/* Quick section pills */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
          {QUICK_LINKS.map((link) => {
            const isCurrent = link.path === '/'
              ? (currentPath === '/' || currentPath === '' || currentPath === '/home')
              : (currentPath === link.path)

            return (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
})

export default PageNavigationHeader
