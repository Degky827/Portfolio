import { Suspense, useEffect, useCallback, useState } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { useDarkMode, usePageTracking } from './shared/hooks'
import api from './shared/services/api'
import ErrorBoundary from './shared/components/ErrorBoundary'
import ScrollProgressBar from './public-portfolio/shared/ScrollProgressBar'
import Navbar from './public-portfolio/layout/Navbar'
import Footer from './public-portfolio/layout/Footer'
import HomePage from './public-portfolio/pages/HomePage'
import LoginPage from './admin-manager/authentication/LoginPage'
import AdminRoutes from './admin-manager/routes/AdminRoutes'
import AIButton from './ai/components/AIButton'
import ChatWindow from './ai/components/ChatWindow'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function PublicLayout() {
  const [darkMode, setDarkMode] = useDarkMode()
  const [chatOpen, setChatOpen] = useState(false)

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
      <Navbar darkMode={darkMode} onToggleDark={handleToggle} />
      <main className="pt-28 sm:pt-32">
        <Outlet />
      </main>
      <Footer />
      <AIButton isOpen={chatOpen} onClick={() => setChatOpen((prev) => !prev)} />
      <ChatWindow isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}

function App() {
  usePageTracking()

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-black"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
