import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDarkMode, useScrollToSection } from './hooks'
import ErrorBoundary from './components/common/ErrorBoundary'
import ScrollProgressBar from './components/common/ScrollProgressBar'
import ThemeToggle from './components/common/ThemeToggle'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [darkMode, setDarkMode] = useDarkMode()
  const scrollToSection = useScrollToSection()
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      scrollToSection(location.hash)
    }
  }, [location.hash, scrollToSection])

  return (
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
  )
}

export default App
