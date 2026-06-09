import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, BarChart3, FolderKanban, Award, Code2,
  Home, UserCircle, Mail, FileText, Settings, X, ChevronLeft, ChevronRight,
  Image, Users, User,
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../../context/AuthContext'
import { canAccess } from './RoleGuard'

const allNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3, roles: ['super_admin', 'admin'] },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban, roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/certificates', label: 'Certificates', icon: Award, roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/skills', label: 'Skills', icon: Code2, roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/media', label: 'Media Library', icon: Image, roles: ['super_admin', 'admin'] },
  { path: '/admin/home', label: 'Home', icon: Home, roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/about', label: 'About', icon: UserCircle, roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/contact', label: 'Contact', icon: Mail, roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/footer', label: 'Footer', icon: FileText, roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/users', label: 'Users', icon: Users, roles: ['super_admin'] },
  { path: '/admin/settings', label: 'Settings', icon: Settings, roles: ['super_admin', 'admin'] },
]

const sidebarVariants = {
  mobileOpen: { x: 0 },
  mobileClosed: { x: '-100%' },
  desktopExpanded: { width: 280 },
  desktopCollapsed: { width: 80 },
}

const itemVariants = {
  hover: { scale: 1.04, x: 4 },
  tap: { scale: 0.97 },
}

export default function Sidebar() {
  const { mobileOpen, closeMobile, collapsed, toggleCollapsed } = useAdmin()
  const { userRole, logout } = useAuth()

  const navItems = allNavItems.filter((item) => canAccess(userRole, item.roles))

  return (
    <>
      <motion.aside
        initial={false}
        animate={mobileOpen ? 'mobileOpen' : 'mobileClosed'}
        variants={{ mobileOpen: { x: 0 }, mobileClosed: { x: '-100%' } }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 lg:hidden flex flex-col"
      >
        <Header onClose={closeMobile} />
        <NavItems collapsed={false} onItemClick={closeMobile} items={navItems} />
        <ProfileFooter collapsed={false} userRole={userRole} onLogout={logout} />
      </motion.aside>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="fixed inset-y-0 left-0 z-30 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 hidden lg:flex flex-col overflow-hidden"
      >
        <DesktopHeader collapsed={collapsed} onToggle={toggleCollapsed} />
        <NavItems collapsed={collapsed} onItemClick={closeMobile} items={navItems} />
        <ProfileFooter collapsed={collapsed} userRole={userRole} onLogout={logout} />
      </motion.aside>
    </>
  )
}

function Header({ onClose }) {
  return (
    <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200 dark:border-slate-800 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-[9px] font-black flex items-center justify-center">
          ደካ
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-bold text-gray-900 dark:text-white"
        >
          Admin Panel
        </motion.span>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X size={20} />
      </button>
    </div>
  )
}

function DesktopHeader({ collapsed, onToggle }) {
  return (
    <div className="flex items-center h-16 border-b border-gray-200 dark:border-slate-800 shrink-0 overflow-hidden px-5">
      {collapsed ? (
        <div className="flex items-center justify-center w-full">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-[9px] font-black flex items-center justify-center shrink-0">
            ደካ
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-[9px] font-black flex items-center justify-center shrink-0">
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
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}

function NavItems({ collapsed, onItemClick, items }) {
  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onItemClick}
          className="block"
        >
          {({ isActive }) => (
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={itemVariants}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors overflow-hidden ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 shrink-0">
                <item.icon size={20} />
              </span>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="relative z-10 whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function ProfileFooter({ collapsed, userRole, onLogout }) {
  return (
    <div className="border-t border-gray-200 dark:border-slate-800 p-3 shrink-0">
      <NavLink to="/admin/profile" className="block">
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <User size={20} className="shrink-0" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap"
            >
              Profile
            </motion.span>
          )}
        </motion.div>
      </NavLink>
    </div>
  )
}
