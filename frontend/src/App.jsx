import { Suspense, useEffect, useCallback, useState, lazy } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { useDarkMode, usePageTracking } from './shared/hooks'
import ErrorBoundary from './shared/components/ErrorBoundary'
import ScrollProgressBar from './public-portfolio/shared/ScrollProgressBar'
import Navbar from './public-portfolio/layout/Navbar'
import Footer from './public-portfolio/layout/Footer'
import HomePage from './public-portfolio/pages/HomePage'
import DynamicCustomPage from './public-portfolio/pages/DynamicCustomPage'
import LoginPage from './admin-manager/authentication/LoginPage'
import AdminRoutes from './admin-manager/routes/AdminRoutes'
import AIButton from './ai/components/AIButton'
import ChatWindow from './ai/components/ChatWindow'

const ThreeDPortfolio = lazy(() => import('./public-portfolio/3d/ThreeDPortfolio'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function PublicLayout() {
  const [darkMode, toggleDarkMode] = useDarkMode()
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <ScrollProgressBar />
      <Navbar darkMode={darkMode} onToggleDark={toggleDarkMode} />
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
            <Route path="/:customSlug" element={<DynamicCustomPage />} />
          </Route>
          <Route path="/3d" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]"><div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>}>
              <ThreeDPortfolio />
            </Suspense>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
