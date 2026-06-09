import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import { logout as logoutApi } from '../../services/authService'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './NotificationBell'

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/analytics': 'Analytics',
  '/admin/projects': 'Projects',
  '/admin/projects/new': 'New Project',
  '/admin/certificates': 'Certificates',
  '/admin/skills': 'Skills',
  '/admin/home': 'Home',
  '/admin/about': 'About',
  '/admin/contact': 'Contact',
  '/admin/footer': 'Footer',
  '/admin/settings': 'Settings',
  '/admin/backup': 'Backup & Restore',
  '/admin/activity-logs': 'Activity Logs',
  '/admin/import-export': 'Import / Export',
  '/admin/system-config': 'System Config',
  '/admin/notifications': 'Notifications',
  '/admin/maintenance': 'Maintenance',
  '/admin/theme': 'Theme Settings',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { toggleMobile } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try { await logoutApi() } catch { /* cookie cleared regardless */ }
    logout()
    navigate('/login', { replace: true })
  }

  const pageTitle = Object.entries(pageTitles).reduce((title, [path, label]) => {
    if (location.pathname.startsWith('/admin/projects') || location.pathname.startsWith('/admin/certificates') || location.pathname.startsWith('/admin/skills')) return label
    if (location.pathname.startsWith(path)) return label
    return title
  }, 'Dashboard')

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobile}
            className="lg:hidden p-2 -ml-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </motion.button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
            {pageTitle}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle compact />
          <NotificationBell />
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-[8px] font-black flex items-center justify-center">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                {user?.email || 'Admin'}
              </span>
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-gray-400" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-56 z-20 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/admin/profile') }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
