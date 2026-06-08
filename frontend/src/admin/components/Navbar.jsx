import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <Menu size={24} />
        </button>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
