import { useEffect, useCallback } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { useDarkMode, usePageTracking } from './hooks'
import api from './services/api'
import ErrorBoundary from './components/common/ErrorBoundary'
import ScrollProgressBar from './components/common/ScrollProgressBar'
import ThemeToggle from './components/common/ThemeToggle'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminRoutes from './admin/routes/AdminRoutes'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function PublicLayout() {
  const [darkMode, setDarkMode] = useDarkMode()

  const handleToggle = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev
      const mode = next ? 'dark' : 'light'
      api.patch('/settings/appearance', { mode }).catch(() => {})
      return next
    })
  }, [setDarkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <ScrollProgressBar />
      <ThemeToggle darkMode={darkMode} onToggle={handleToggle} />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  usePageTracking()

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
