import { useEffect, useCallback } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { useDarkMode, usePageTracking } from './shared/hooks'
import api from './shared/services/api'
import ErrorBoundary from './shared/components/ErrorBoundary'
import ScrollProgressBar from './public-portfolio/shared/ScrollProgressBar'
import ThemeToggle from './public-portfolio/shared/ThemeToggle'
import Navbar from './public-portfolio/layout/Navbar'
import Footer from './public-portfolio/layout/Footer'
import HomePage from './public-portfolio/pages/HomePage'
import LoginPage from './admin-manager/authentication/LoginPage'
import AdminRoutes from './admin-manager/routes/AdminRoutes'

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
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
