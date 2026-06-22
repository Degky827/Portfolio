import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, LogOut, User, Palette, Bell, ChevronDown, ChevronRight, Search, X, Command,
} from 'lucide-react'
import { useAuth } from '../authentication/AuthContext'
import { useAdmin } from '../context/AdminContext'
import { useSocket } from '../../shared/context/SocketContext'
import { logout as logoutApi } from '../../shared/services/authService'
import ThemeToggle from './ThemeToggle'
import NotificationBell from '../shared/NotificationBell'
import Toast from '../shared/Toast'

const breadcrumbMap = {
  '/admin/dashboard': { parent: null, label: 'Overview' },
  '/admin/analytics': { parent: 'Dashboard', label: 'Analytics' },
  '/admin/home': { parent: 'Portfolio CMS', label: 'Home' },
  '/admin/about': { parent: 'Portfolio CMS', label: 'About' },
  '/admin/skills': { parent: 'Portfolio CMS', label: 'Skills' },
  '/admin/projects': { parent: 'Portfolio CMS', label: 'Projects' },
  '/admin/projects/new': { parent: 'Projects', label: 'New Project' },
  '/admin/media': { parent: 'Portfolio CMS', label: 'Media Library' },
  '/admin/footer': { parent: 'Portfolio CMS', label: 'Footer' },
  '/admin/navigation': { parent: 'Portfolio CMS', label: 'Navigation' },
  '/admin/contact': { parent: 'Portfolio CMS', label: 'Contact Settings' },
  '/admin/inbox': { parent: 'Communication', label: 'Inbox' },
  '/admin/notifications': { parent: 'Portfolio CMS', label: 'Notifications' },
  '/admin/activity-logs': { parent: 'System', label: 'Activity Logs' },
  '/admin/backup': { parent: 'System', label: 'Backup & Restore' },
  '/admin/import-export': { parent: 'System', label: 'Import / Export' },
  '/admin/maintenance': { parent: 'System', label: 'Maintenance' },
  '/admin/system-config': { parent: 'System', label: 'System Config' },
  '/admin/users': { parent: 'System', label: 'Users' },
  '/admin/profile': { parent: 'Account', label: 'Profile' },
  '/admin/theme': { parent: 'Account', label: 'Appearance' },
}

const searchableRoutes = [
  { path: '/admin/dashboard', label: 'Overview', keywords: 'dashboard home' },
  { path: '/admin/analytics', label: 'Analytics', keywords: 'analytics metrics visits' },
  { path: '/admin/projects', label: 'Projects', keywords: 'projects portfolio work' },
  { path: '/admin/projects/new', label: 'New Project', keywords: 'add project create' },
  { path: '/admin/skills', label: 'Skills', keywords: 'skills technologies certificates credentials' },
  { path: '/admin/home', label: 'Home Content', keywords: 'home hero banner' },
  { path: '/admin/about', label: 'About Content', keywords: 'about biography' },
  { path: '/admin/contact', label: 'Contact Settings', keywords: 'contact settings social channels' },
  { path: '/admin/inbox', label: 'Inbox', keywords: 'inbox messages inquiries contact submissions' },
  { path: '/admin/footer', label: 'Footer Content', keywords: 'footer links' },
  { path: '/admin/navigation', label: 'Navigation', keywords: 'navigation menu navbar links' },
  { path: '/admin/media', label: 'Media Library', keywords: 'media images files upload' },
  { path: '/admin/notifications', label: 'Notifications', keywords: 'notifications alerts' },
  { path: '/admin/activity-logs', label: 'Activity Logs', keywords: 'logs activity history' },
  { path: '/admin/backup', label: 'Backup & Restore', keywords: 'backup restore data' },
  { path: '/admin/import-export', label: 'Import / Export', keywords: 'import export data' },
  { path: '/admin/maintenance', label: 'Maintenance', keywords: 'maintenance tools' },
  { path: '/admin/system-config', label: 'System Config', keywords: 'system configuration' },
  { path: '/admin/profile', label: 'Profile', keywords: 'profile account' },
  { path: '/admin/theme', label: 'Appearance', keywords: 'theme appearance dark light' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { toggleMobile } = useAdmin()
  const { on } = useSocket()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)
  const selectedIndexRef = useRef(-1)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !searchOpen) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setDropdownOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const cleanup = on('new_contact_message', (data) => {
      setToast({ message: `New Message Received from ${data.name}`, type: 'info' })
    })
    return cleanup
  }, [on])

  const handleLogout = useCallback(async () => {
    try { await logoutApi() } catch { /* noop */ }
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  const crumb = breadcrumbMap[location.pathname]
  const breadcrumbs = []
  if (crumb?.parent) {
    breadcrumbs.push({ label: crumb.parent, path: null })
    breadcrumbs.push({ label: crumb.label, path: location.pathname })
  } else if (crumb) {
    breadcrumbs.push({ label: crumb.label, path: location.pathname })
  }

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return searchableRoutes.slice(0, 8)
    const q = searchQuery.toLowerCase()
    return searchableRoutes.filter(
      (r) => r.label.toLowerCase().includes(q) || r.keywords.toLowerCase().includes(q),
    ).slice(0, 10)
  }, [searchQuery])

  function handleSearchNavigate(path) {
    setSearchOpen(false)
    setSearchQuery('')
    navigate(path)
  }

  function handleSearchKeyDown(e) {
    const results = filteredResults
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedIndexRef.current = Math.min(selectedIndexRef.current + 1, results.length - 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, 0)
    } else if (e.key === 'Enter' && selectedIndexRef.current >= 0) {
      e.preventDefault()
      handleSearchNavigate(results[selectedIndexRef.current].path)
    }
  }

  return (
    <>
      <header className="glass-nav sticky top-0 z-20">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobile}
              className="lg:hidden p-2 -ml-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </motion.button>

            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/admin/dashboard"
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0 font-medium"
                >
                  Dashboard
                </Link>
              </motion.div>
              {breadcrumbs.map((b, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.2 }}
                  className="flex items-center gap-1.5 min-w-0"
                >
                  <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
                  {b.path ? (
                    <Link
                      to={b.path}
                      className="text-gray-900 dark:text-white font-medium truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 truncate">{b.label}</span>
                  )}
                </motion.span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-slate-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
              title="View My Portfolio"
            >
              View My Portfolio
            </a>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors border border-gray-200/60 dark:border-slate-700/60"
              aria-label="Search"
            >
              <Search size={16} />
              <span className="hidden md:inline">Search...</span>
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100/50 dark:bg-slate-800/50 rounded border border-gray-200/60 dark:border-slate-700/60 ml-4">
                <Command size={10} />
                <span>K</span>
              </kbd>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </motion.button>

            <ThemeToggle compact />
            <NotificationBell />

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="p-1.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
                aria-label="Account menu"
                aria-expanded={dropdownOpen}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-lg object-cover shadow-md shadow-indigo-500/20" />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center"
                  >
                    {user?.displayName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'D'}
                  </motion.div>
                )}
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
                      className="absolute right-0 top-full mt-1 w-64 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-premium-lg dark:shadow-premium-lg-dark border border-gray-200/60 dark:border-slate-700/60 overflow-hidden"
                    >
                      <div className="px-4 py-4 border-b border-gray-100/60 dark:border-slate-800/60">
                        <div className="flex items-center gap-3">
                          {user?.avatar ? (
                            <img src={user.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shadow-md shadow-indigo-500/20" />
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="w-10 h-10 rounded-xl bg-indigo-600 text-white text-sm font-black flex items-center justify-center"
                            >
                              {user?.displayName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'D'}
                            </motion.div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                              {user?.name || user?.email?.split('@')[0] || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                            <motion.span
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 capitalize"
                            >
                              {user?.role?.replace('_', ' ') || 'Admin'}
                            </motion.span>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        {[
                          { label: 'My Profile', icon: User, onClick: () => { setDropdownOpen(false); navigate('/admin/profile') } },
                          { label: 'Appearance', icon: Palette, onClick: () => { setDropdownOpen(false); navigate('/admin/theme') } },
                          { label: 'Notifications', icon: Bell, onClick: () => { setDropdownOpen(false); navigate('/admin/notifications') } },
                        ].map((item) => (
                          <motion.button
                            key={item.label}
                            whileHover={{ x: 4 }}
                            onClick={item.onClick}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <item.icon size={16} className="text-gray-400" />
                            {item.label}
                          </motion.button>
                        ))}
                      </div>
                      <div className="border-t border-gray-100/60 dark:border-slate-800/60 py-1">
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed inset-x-0 top-0 z-50 mx-auto mt-16 w-full max-w-xl"
            >
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-premium-lg dark:shadow-premium-lg-dark border border-gray-200/60 dark:border-slate-700/60 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/60 dark:border-slate-800/60">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); selectedIndexRef.current = -1 }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search pages, settings, and more..."
                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                    aria-label="Search"
                  />
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100/50 dark:bg-slate-800/50 rounded border border-gray-200/60 dark:border-slate-700/60">
                    ESC
                  </kbd>
                </div>
                {searchQuery.trim() && filteredResults.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    No results found
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto py-2">
                    {filteredResults.map((r, i) => (
                      <motion.button
                        key={r.path}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleSearchNavigate(r.path)}
                        onMouseEnter={() => { selectedIndexRef.current = i }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                          i === selectedIndexRef.current
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <Search size={14} className="shrink-0 text-gray-400" />
                        <span className="font-medium">{r.label}</span>
                        <span className="ml-auto text-xs text-gray-400">{r.path.replace('/admin/', '')}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
                {!searchQuery.trim() && (
                  <div className="px-4 py-2 border-t border-gray-100/60 dark:border-slate-800/60 flex items-center gap-4 text-[11px] text-gray-400">
                    <span>Type to search</span>
                    <span className="ml-auto">↑↓ Navigate · Enter Select · Esc Close</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  )
}
