import { useState, useCallback, useMemo, useRef, useEffect, forwardRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BarChart3, FolderKanban, Code2,
  Home, UserCircle, Mail, FileText, X, ChevronLeft, ChevronRight,
  Image, HardDrive, Activity, Download, Wrench, Bell,
  HeartPulse, Palette, User, ChevronDown, Search, MessageSquare,
  Shield, LogOut, Settings, Eye,
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../../context/AuthContext'
import { canAccess } from './RoleGuard'

function UserAvatar({ user, size = 'md', className = '' }) {
  const sizeMap = { sm: 'w-7 h-7 text-[8px]', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' }
  const dim = sizeMap[size] || sizeMap.md
  const initials = (user?.displayName || user?.name || 'D').charAt(0).toUpperCase()

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt=""
        className={`${dim} rounded-lg object-cover shrink-0 shadow-md ${className}`}
      />
    )
  }

  return (
    <div className={`${dim} rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-black flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 ${className}`}>
      {initials}
    </div>
  )
}

function getUserInitials(user) {
  if (user?.displayName) return user.displayName.charAt(0).toUpperCase()
  if (user?.name) return user.name.charAt(0).toUpperCase()
  return 'D'
}

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
  hover: { x: 4 },
  tap: { scale: 0.97 },
}

const sidebarVariants = {
  open: { width: 280, transition: { type: 'spring', stiffness: 260, damping: 26 } },
  collapsed: { width: 80, transition: { type: 'spring', stiffness: 260, damping: 26 } },
}

const mobileSidebarVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

const navItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.03, type: 'spring', stiffness: 300, damping: 24 },
  }),
}

export default function Sidebar() {
  const { mobileOpen, closeMobile, collapsed, toggleCollapsed } = useAdmin()
  const { user, userRole, logout } = useAuth()
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
    <div className="flex flex-col h-full">
      <DesktopHeader collapsed={collapsed} onToggle={toggleCollapsed} user={user} />

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-3 pt-3 pb-1"
        >
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </motion.div>
      )}

      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-1 admin-sidebar-nav"
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {filteredGroups.length === 0 && isSearching && (
          <div className="px-3 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            No results found
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

      <ProfileFooter collapsed={collapsed} user={user} userRole={userRole} onLogout={logout} />
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
              variants={mobileSidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="glass-sidebar fixed inset-y-0 left-0 z-50 w-72 lg:hidden flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/60 dark:border-slate-700/60 shrink-0">
                  <div className="flex items-center gap-3">
                  <UserAvatar user={user} size="sm" className="rounded-lg" />
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold text-gray-900 dark:text-white"
                  >
                    {user?.displayName || user?.name || 'Portfolio'}
                  </motion.span>
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
                className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-1 admin-sidebar-nav"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {filteredGroups.length === 0 && isSearching && (
                  <div className="px-3 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    No results found
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
              <ProfileFooter collapsed={false} user={user} userRole={userRole} onLogout={logout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        variants={sidebarVariants}
        className="glass-sidebar fixed inset-y-0 left-0 z-30 hidden lg:flex flex-col overflow-hidden shadow-premium-lg dark:shadow-premium-lg-dark"
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
        className="w-full h-9 pl-9 pr-3 text-sm rounded-xl border border-gray-200/60 dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-200"
        aria-label="Search navigation"
      />
      {!value && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100/50 dark:bg-slate-800/50 rounded border border-gray-200/60 dark:border-slate-700/60 pointer-events-none">
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
        {group.items.map((item, i) => (
          <motion.div
            key={item.path}
            custom={i}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <NavItem item={item} collapsed onItemClick={onItemClick} />
          </motion.div>
        ))}
      </div>
    )
  }

  if (!group.collapsible) {
    return (
      <div>
        <SectionLabel label={group.label} />
        <div className="space-y-0.5">
          {group.items.map((item, i) => (
            <motion.div
              key={item.path}
              custom={i}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <NavItem item={item} collapsed={false} onItemClick={onItemClick} />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <motion.button
        onClick={onToggle}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
          hasActiveChild
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
        }`}
        aria-expanded={isOpen}
        aria-controls={`section-${group.id}`}
        whileHover={{ x: 2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
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
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`section-${group.id}`}
            key={`section-${group.id}`}
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { height: 'auto', opacity: 1, transition: { duration: 0.25, ease: 'easeInOut' } },
              closed: { height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
            }}
            className="overflow-hidden"
          >
            <div className="pl-9 pr-1 py-0.5 space-y-0.5">
              {group.items.map((item, i) => (
                <motion.div
                  key={item.path}
                  custom={i}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <NavItem item={item} collapsed={false} onItemClick={onItemClick} />
                </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-3 pt-3 pb-1"
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400/70 dark:text-gray-500/70">
        {label}
      </span>
    </motion.div>
  )
}

function NavItem({ item, collapsed, onItemClick }) {
  const location = useLocation()

  const isActive = useMemo(() => {
    if (item.path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard'
    }
    if (item.path === '/admin/projects' || item.path === '/admin/skills') {
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative flex items-center justify-center w-full h-10 rounded-xl text-sm font-medium transition-colors duration-200 ${
            isActive
              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-indigo-500"
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
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.97 }}
        className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicatorExpanded"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-indigo-500"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <motion.span
          className="shrink-0 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <item.icon size={18} />
        </motion.span>
        <span className="truncate">{item.label}</span>
      </motion.div>
    </NavLink>
  )
}

function DesktopHeader({ collapsed, onToggle, user }) {
  return (
    <motion.div
      layout
      className="flex items-center h-16 border-b border-gray-200/60 dark:border-slate-700/60 shrink-0 overflow-hidden px-4"
    >
      {collapsed ? (
        <div className="flex items-center justify-center w-full">
          <UserAvatar user={user} size="sm" className="rounded-lg" />
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <motion.div layout className="flex items-center gap-3 overflow-hidden">
            <UserAvatar user={user} size="sm" className="rounded-lg" />
            <motion.span
              layout
              className="font-bold text-gray-900 dark:text-white whitespace-nowrap text-base"
            >
              {user?.displayName || user?.name || 'Portfolio'}
            </motion.span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </motion.button>
        </div>
      )}
      {collapsed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="absolute -right-3 top-14 p-1 rounded-full bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-700/60 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shadow-lg"
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={14} />
        </motion.button>
      )}
    </motion.div>
  )
}

function ProfileFooter({ collapsed, user, userRole, onLogout }) {
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
      <div className="border-t border-gray-200/60 dark:border-slate-700/60 p-3 shrink-0">
        <div className="relative" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center justify-center w-full h-10 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Account menu"
            aria-expanded={open}
          >
            <UserAvatar user={user} size="sm" />
          </motion.button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 bottom-full mb-2 w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-premium-lg dark:shadow-premium-lg-dark border border-gray-200/60 dark:border-slate-700/60 overflow-hidden"
              >
                <NavLink
                  to="/admin/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 font-medium transition-colors"
                >
                  <User size={16} />
                  Profile
                </NavLink>
                <button
                  onClick={() => { setOpen(false); onLogout() }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 font-medium transition-colors"
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
    <div className="border-t border-gray-200/60 dark:border-slate-700/60 p-3 shrink-0">
      <div className="relative" ref={menuRef}>
        <motion.button
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Account menu"
          aria-expanded={open}
        >
          <UserAvatar user={user} size="sm" />
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.displayName || user?.name || 'Account'}
            </p>
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
        </motion.button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 bottom-full mb-2 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-premium-lg dark:shadow-premium-lg-dark border border-gray-200/60 dark:border-slate-700/60 overflow-hidden"
            >
              <NavLink
                to="/admin/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 font-medium transition-colors"
              >
                <User size={16} />
                Profile
              </NavLink>
              <button
                onClick={() => { setOpen(false); onLogout() }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 font-medium transition-colors"
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
