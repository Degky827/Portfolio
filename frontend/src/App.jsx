import { useEffect } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { useDarkMode, usePageTracking } from './hooks'
import ErrorBoundary from './components/common/ErrorBoundary'
import ScrollProgressBar from './components/common/ScrollProgressBar'
import ThemeToggle from './components/common/ThemeToggle'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function PublicLayout() {
  const [darkMode, setDarkMode] = useDarkMode()

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <ScrollProgressBar />
      <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((prev) => !prev)} />
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
