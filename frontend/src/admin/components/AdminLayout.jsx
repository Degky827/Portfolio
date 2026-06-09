import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AdminProvider, useAdmin } from '../context/AdminContext'
import { ThemeProvider } from '../context/ThemeContext'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function LayoutInner() {
  const { collapsed } = useAdmin()
  const location = useLocation()
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const sidebarWidth = collapsed ? 80 : 280
  const ml = isDesktop ? sidebarWidth : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <div
        className="flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: ml }}
      >
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <LayoutInner />
      </AdminProvider>
    </ThemeProvider>
  )
}
