import { useState, useCallback, useMemo, useRef, useEffect, forwardRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BarChart3, FolderKanban, Award, Code2,
  Home, UserCircle, Mail, FileText, X, ChevronLeft, ChevronRight,
  Image, HardDrive, Activity, Download, Wrench, Bell,
  HeartPulse, Palette, User, ChevronDown, Search, MessageSquare,
  Shield, LogOut, Settings, Eye,
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../../context/AuthContext'
import { canAccess } from './RoleGuard'

const navGroups = [
  {
    id: 'dashboard',
    label: 'DASHBOARD',
    icon: LayoutDashboard,
    collapsible: false,
    section: true,
    items: [
      { path: '/admin/dashboard', label: 'Overview', icon: Eye, roles: ['super_admin', 'admin', 'editor'] },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart3, roles: ['super_admin', 'admin'] },
    ],
  },
  {
    id: 'cms',
    label: 'PORTFOLIO CMS',
    icon: FolderKanban,
    section: true,
    collapsible: true,
    items: [
      { path: '/admin/home', label: 'Home', icon: Home, roles: ['super_admin', 'admin', 'editor'] },
      { path: '/admin/about', label: 'About', icon: UserCircle, roles: ['super_admin', 'admin', 'editor'] },
      { path: '/admin/skills', label: 'Skills', icon: Code2, roles: ['super_admin', 'admin', 'editor'] },
      { path: '/admin/certificates', label: 'Certificates', icon: Award, roles: ['super_admin', 'admin', 'editor'] },
      { path: '/admin/projects', label: 'Projects', icon: FolderKanban, roles: ['super_admin', 'admin', 'editor'] },
      { path: '/admin/media', label: 'Media Library', icon: Image, roles: ['super_admin', 'admin'] },
      { path: '/admin/footer', label: 'Footer', icon: FileText, roles: ['super_admin', 'admin', 'editor'] },
    ],
  },
  {
    id: 'communication',
    label: 'COMMUNICATION',
    icon: MessageSquare,
    section: true,
    collapsible: true,
    items: [
      { path: '/admin/contact', label: 'Contact Messages', icon: Mail, roles: ['super_admin', 'admin', 'editor'] },
      { path: '/admin/notifications', label: 'Notifications', icon: Bell, roles: ['super_admin', 'admin'] },
      { path: '/admin/activity-logs', label: 'Activity Logs', icon: Activity, roles: ['super_admin', 'admin'] },
    ],
  },
  {
    id: 'system',
    label: 'SYSTEM',
    icon: Shield,
    section: true,
    collapsible: true,
    items: [
      { path: '/admin/settings', label: 'Settings', icon: Settings, roles: ['super_admin', 'admin'] },
      { path: '/admin/backup', label: 'Backup & Restore', icon: HardDrive, roles: ['super_admin', 'admin'] },
      { path: '/admin/import-export', label: 'Import / Export', icon: Download, roles: ['super_admin', 'admin'] },
      { path: '/admin/maintenance', label: 'Maintenance', icon: HeartPulse, roles: ['super_admin'] },
    ],
  },
  {
    id: 'account',
    label: 'ACCOUNT',
    icon: User,
    section: true,
    collapsible: false,
    items: [
      { path: '/admin/profile', label: 'Profile', icon: User, roles: ['super_admin', 'admin', 'editor'] },
      { path: '/admin/theme', label: 'Appearance', icon: Palette, roles: ['super_admin', 'admin'] },
    ],
  },
]

const allNavItems = navGroups.flatMap((g) => g.items)

const itemVariants = {
  hover: { scale: 1.04, x: 4 },
  tap: { scale: 0.97 },
}

const dropdownVariants = {
  open: { height: 'auto', opacity: 1 },
  closed: { height: 0, opacity: 0 },
}

export default function Sidebar() {
  const { mobileOpen, closeMobile, collapsed, toggleCollapsed } = useAdmin()
  const { userRole, logout } = useAuth()
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState({ cms: true, communication: false, system: false })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    setSearchQuery('')
  }, [location.pathname])

  const toggleMenu = useCallback((menuId) => {
    setOpenMenus((prev) => {
      const next = { cms: false, communication: false, system: false }
      next[menuId] = !prev[menuId]
      return next
    })
  }, [])

  const isSearching = searchQuery.trim().length > 0

  const filteredGroups = useMemo(() => {
    if (!isSearching) {
      return navGroups
        .map((g) => ({
          ...g,
          items: g.items.filter((item) => canAccess(userRole, item.roles)),
        }))
        .filter((g) => g.items.length > 0)
    }

    const q = searchQuery.toLowerCase()
    return navGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) => canAccess(userRole, item.roles) && item.label.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [userRole, searchQuery, isSearching])

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <DesktopHeader collapsed={collapsed} onToggle={toggleCollapsed} />

      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      )}

      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-1 scrollbar-thin"
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {filteredGroups.length === 0 && isSearching && (
          <div className="px-3 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            No results found for &ldquo;{searchQuery}&rdquo;
          </div>
        )}
        {filteredGroups.map((group) => (
          <NavGroup
            key={group.id}
            group={group}
            collapsed={collapsed}
            isOpen={isSearching || openMenus[group.id]}
            onToggle={() => toggleMenu(group.id)}
            onItemClick={closeMobile}
          />
        ))}
      </nav>

      <ProfileFooter collapsed={collapsed} userRole={userRole} onLogout={logout} />
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 z-40 bg-black lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 lg:hidden flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-purple-900 text-white text-[9px] font-black flex items-center justify-center">
                    ደካ
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
                </div>
                <button
                  onClick={closeMobile}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="px-3 pt-3 pb-1">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              <nav
                className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-1"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {filteredGroups.length === 0 && isSearching && (
                  <div className="px-3 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
                {filteredGroups.map((group) => (
                  <NavGroup
                    key={group.id}
                    group={group}
                    collapsed={false}
                    isOpen={isSearching || openMenus[group.id]}
                    onToggle={() => toggleMenu(group.id)}
                    onItemClick={closeMobile}
                  />
                ))}
              </nav>
              <ProfileFooter collapsed={false} userRole={userRole} onLogout={logout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="fixed inset-y-0 left-0 z-30 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 hidden lg:flex flex-col overflow-hidden"
        role="navigation"
        aria-label="Sidebar"
      >
        {sidebarContent}
      </motion.aside>
    </>
  )
}

const SearchBar = forwardRef(function SearchBar({ value, onChange }, ref) {
  const inputRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Quick search..."
        className="w-full h-9 pl-9 pr-3 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
        aria-label="Search navigation"
      />
      {!value && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 pointer-events-none">
          <span>⌘</span>K
        </kbd>
      )}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
})

function NavGroup({ group, collapsed, isOpen, onToggle, onItemClick }) {
  const location = useLocation()

  const hasActiveChild = useMemo(
    () => group.items.some((item) => {
      if (item.path === '/admin/dashboard') return location.pathname === '/admin/dashboard'
      return location.pathname.startsWith(item.path) || location.pathname === item.path
    }),
    [location.pathname, group.items],
  )

  if (collapsed) {
    return (
      <div className="space-y-1">
        {group.items.map((item) => (
          <NavItem key={item.path} item={item} collapsed onItemClick={onItemClick} />
        ))}
      </div>
    )
  }

  if (!group.collapsible) {
    return (
      <div>
        <SectionLabel label={group.label} />
        <div className="space-y-0.5">
          {group.items.map((item) => (
            <NavItem key={item.path} item={item} collapsed={false} onItemClick={onItemClick} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
          hasActiveChild
            ? 'text-primary dark:text-primary'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
        }`}
        aria-expanded={isOpen}
        aria-controls={`section-${group.id}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <group.icon size={20} className="shrink-0" />
          <span className="truncate">{group.label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`section-${group.id}`}
            key={`section-${group.id}`}
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pl-9 pr-1 py-0.5 space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.path} item={item} collapsed={false} onItemClick={onItemClick} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SectionLabel({ label }) {
  if (!label) return null
  return (
    <div className="px-3 pt-3 pb-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {label}
      </span>
    </div>
  )
}

function NavItem({ item, collapsed, onItemClick }) {
  const location = useLocation()

  const isActive = useMemo(() => {
    if (item.path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard'
    }
    if (item.path === '/admin/projects' || item.path === '/admin/certificates' || item.path === '/admin/skills') {
      return location.pathname.startsWith(item.path)
    }
    return location.pathname === item.path
  }, [location.pathname, item.path])

  if (collapsed) {
    return (
      <NavLink
        to={item.path}
        onClick={onItemClick}
        className="block"
        aria-label={item.label}
      >
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
          className={`relative flex items-center justify-center w-full h-10 rounded-xl text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary/10 text-primary dark:bg-primary/20'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <item.icon size={20} />
        </motion.div>
      </NavLink>
    )
  }

  return (
    <NavLink to={item.path} onClick={onItemClick} className="block">
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={itemVariants}
        className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicatorExpanded"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-primary"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <span className="shrink-0">
          <item.icon size={18} />
        </span>
        <span className="truncate">{item.label}</span>
      </motion.div>
    </NavLink>
  )
}

function DesktopHeader({ collapsed, onToggle }) {
  return (
    <div className="flex items-center h-16 border-b border-gray-200 dark:border-slate-800 shrink-0 overflow-hidden px-4">
      {collapsed ? (
        <div className="flex items-center justify-center w-full">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-purple-900 text-white text-[9px] font-black flex items-center justify-center shrink-0">
            ደካ
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-purple-900 text-white text-[9px] font-black flex items-center justify-center shrink-0">
              ደካ
            </div>
            <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
              Admin Panel
            </span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      )}
      {collapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-14 p-1 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shadow-sm"
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}

function ProfileFooter({ collapsed, userRole, onLogout }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  if (collapsed) {
    return (
      <div className="border-t border-gray-200 dark:border-slate-800 p-3 shrink-0">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center justify-center w-full h-10 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Account menu"
            aria-expanded={open}
          >
            <User size={20} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 bottom-full mb-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden"
              >
                <NavLink
                  to="/admin/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  <User size={16} />
                  Profile
                </NavLink>
                <button
                  onClick={() => { setOpen(false); onLogout() }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200 dark:border-slate-800 p-3 shrink-0">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Account menu"
          aria-expanded={open}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-700 to-purple-900 text-white text-[8px] font-black flex items-center justify-center shrink-0">
            A
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Account</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize truncate">
              {userRole?.replace('_', ' ') || 'Admin'}
            </p>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <ChevronDown size={16} />
          </motion.div>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 bottom-full mb-2 w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden"
            >
              <NavLink
                to="/admin/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                <User size={16} />
                Profile
              </NavLink>
              <button
                onClick={() => { setOpen(false); onLogout() }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
