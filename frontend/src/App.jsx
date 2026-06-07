import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDarkMode, usePageTracking } from './hooks'
import ErrorBoundary from './components/common/ErrorBoundary'
import ScrollProgressBar from './components/common/ScrollProgressBar'
import ThemeToggle from './components/common/ThemeToggle'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function App() {
  const [darkMode, setDarkMode] = useDarkMode()

  usePageTracking()

  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
          <ScrollProgressBar />
          <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((prev) => !prev)} />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
