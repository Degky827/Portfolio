import { Suspense, useCallback, useState, lazy } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { useDarkMode, usePageTracking } from './shared/hooks'
import ErrorBoundary from './shared/components/ErrorBoundary'
import ScrollProgressBar from './public-portfolio/shared/ScrollProgressBar'
import IntroSystem from './public-portfolio/intro/IntroSystem'
import CursorSystem from './components/cursor/CursorSystem'

const Navbar = lazy(() => import('./public-portfolio/layout/Navbar'))
const Footer = lazy(() => import('./public-portfolio/layout/Footer'))
const HomePage = lazy(() => import('./public-portfolio/pages/HomePage'))
const CVPage = lazy(() => import('./public-portfolio/pages/cv/CVPage'))
const DynamicCustomPage = lazy(() => import('./public-portfolio/pages/DynamicCustomPage'))
const AIButton = lazy(() => import('./ai/components/AIButton'))
const ChatWindow = lazy(() => import('./ai/components/ChatWindow'))
const LoginPage = lazy(() => import('./admin-manager/authentication/LoginPage'))
const AdminRoutes = lazy(() => import('./admin-manager/routes/AdminRoutes'))
const WorkspaceScene = lazy(() => import('./public-portfolio/components/3d/WorkspaceScene'))

const layoutSpinner = (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
    <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.3)', borderTopColor: 'var(--input-focus-border)' }} />
  </div>
)

const sectionSpinner = (
  <div className="h-64 flex items-center justify-center">
    <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.3)', borderTopColor: 'var(--input-focus-border)' }} />
  </div>
)

function ScrollToTop() {
  const { pathname } = useLocation()
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  return null
}

function PublicLayout() {
  const [darkMode, toggleDarkMode] = useDarkMode()
  const [chatOpen, setChatOpen] = useState(false)

  const handleChatToggle = useCallback(() => setChatOpen((prev) => !prev), [])
  const handleChatClose = useCallback(() => setChatOpen(false), [])

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <ScrollProgressBar />
      <Suspense fallback={null}>
        <Navbar darkMode={darkMode} onToggleDark={toggleDarkMode} />
      </Suspense>
      <main className="pt-28 sm:pt-32">
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <AIButton isOpen={chatOpen} onClick={handleChatToggle} />
        <ChatWindow isOpen={chatOpen} onClose={handleChatClose} />
      </Suspense>
    </div>
  )
}

function App() {
  usePageTracking()

  return (
    <ErrorBoundary>
      <CursorSystem />
      <ScrollToTop />
      <IntroSystem />
      <Suspense fallback={layoutSpinner}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cv" element={
              <Suspense fallback={sectionSpinner}>
                <CVPage />
              </Suspense>
            } />
            <Route path="/:customSlug" element={<DynamicCustomPage />} />
          </Route>
          <Route path="/workspace" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a2e' }}><div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" /></div>}>
              <WorkspaceScene />
            </Suspense>
          } />
          <Route path="/workspace/:section" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a2e' }}><div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" /></div>}>
              <WorkspaceScene />
            </Suspense>
          } />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
