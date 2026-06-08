import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  Award,
  Code2,
  Home,
  UserCircle,
  Mail,
  FileText,
  Settings,
  X,
} from 'lucide-react'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/certificates', label: 'Certificates', icon: Award },
  { path: '/admin/skills', label: 'Skills', icon: Code2 },
  { path: '/admin/home', label: 'Home', icon: Home },
  { path: '/admin/about', label: 'About', icon: UserCircle },
  { path: '/admin/contact', label: 'Contact', icon: Mail },
  { path: '/admin/footer', label: 'Footer', icon: FileText },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-[9px] font-black flex items-center justify-center">
            ደካ
          </div>
          <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto admin-sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
