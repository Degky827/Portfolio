import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, LogOut, User, ChevronDown, ChevronRight, Search, X, Command,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import { logout as logoutApi } from '../../services/authService'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './NotificationBell'

const breadcrumbMap = {
  '/admin/dashboard': { parent: null, label: 'Overview' },
  '/admin/analytics': { parent: 'Dashboard', label: 'Analytics' },
  '/admin/home': { parent: 'Portfolio CMS', label: 'Home' },
  '/admin/about': { parent: 'Portfolio CMS', label: 'About' },
  '/admin/skills': { parent: 'Portfolio CMS', label: 'Skills' },
  '/admin/certificates': { parent: 'Portfolio CMS', label: 'Certificates' },
  '/admin/projects': { parent: 'Portfolio CMS', label: 'Projects' },
  '/admin/projects/new': { parent: 'Projects', label: 'New Project' },
  '/admin/media': { parent: 'Portfolio CMS', label: 'Media Library' },
  '/admin/footer': { parent: 'Portfolio CMS', label: 'Footer' },
  '/admin/contact': { parent: 'Communication', label: 'Contact Messages' },
  '/admin/notifications': { parent: 'Communication', label: 'Notifications' },
  '/admin/activity-logs': { parent: 'Communication', label: 'Activity Logs' },
  '/admin/settings': { parent: 'System', label: 'Settings' },
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
  { path: '/admin/certificates', label: 'Certificates', keywords: 'certificates credentials' },
  { path: '/admin/skills', label: 'Skills', keywords: 'skills technologies' },
  { path: '/admin/home', label: 'Home Content', keywords: 'home hero banner' },
  { path: '/admin/about', label: 'About Content', keywords: 'about biography' },
  { path: '/admin/contact', label: 'Contact Messages', keywords: 'contact messages inquiries' },
  { path: '/admin/footer', label: 'Footer Content', keywords: 'footer links' },
  { path: '/admin/media', label: 'Media Library', keywords: 'media images files upload' },
  { path: '/admin/notifications', label: 'Notifications', keywords: 'notifications alerts' },
  { path: '/admin/activity-logs', label: 'Activity Logs', keywords: 'logs activity history' },
  { path: '/admin/settings', label: 'Settings', keywords: 'settings configuration' },
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
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)
  const selectedIndexRef = useRef(-1)

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
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobile}
              className="lg:hidden p-2 -ml-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </motion.button>

            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
              <Link
                to="/admin/dashboard"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0 font-medium"
              >
                Dashboard
              </Link>
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-1.5 min-w-0">
                  <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
                  {b.path ? (
                    <Link
                      to={b.path}
                      className="text-gray-900 dark:text-white font-medium truncate hover:text-primary transition-colors"
                    >
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 truncate">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-700"
              aria-label="Search"
            >
              <Search size={16} />
              <span className="hidden md:inline">Search...</span>
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 ml-4">
                <Command size={10} />
                <span>K</span>
              </kbd>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
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
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Account menu"
                aria-expanded={dropdownOpen}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-700 to-purple-900 text-white text-[8px] font-black flex items-center justify-center">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                  {user?.email || 'Admin'}
                </span>
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden md:block"
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
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-slate-800">
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
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700">
                    ESC
                  </kbd>
                </div>
                {searchQuery.trim() && filteredResults.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto py-2">
                    {filteredResults.map((r, i) => (
                      <button
                        key={r.path}
                        onClick={() => handleSearchNavigate(r.path)}
                        onMouseEnter={() => { selectedIndexRef.current = i }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                          i === selectedIndexRef.current
                            ? 'bg-primary/10 text-primary dark:bg-primary/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Search size={14} className="shrink-0 text-gray-400" />
                        <span className="font-medium">{r.label}</span>
                        <span className="ml-auto text-xs text-gray-400">{r.path.replace('/admin/', '')}</span>
                      </button>
                    ))}
                  </div>
                )}
                {!searchQuery.trim() && (
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-800 flex items-center gap-4 text-[11px] text-gray-400">
                    <span>Type to search</span>
                    <span className="ml-auto">↑↓ Navigate &middot; Enter Select &middot; Esc Close</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}


