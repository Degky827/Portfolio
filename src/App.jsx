import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'

const Projects = lazy(() => import('./components/Projects'))
const Contact = lazy(() => import('./components/Contact'))

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [scrollProgress, setScrollProgress] = useState(0)
  const location = useLocation()

  const scrollToSection = useCallback((hash) => {
    const id = hash.replace('#', '').replace('/', '') || 'home'
    const target = document.getElementById(id)
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = windowHeight > 0 ? (totalHeight / windowHeight) * 100 : 0
      setScrollProgress(Math.min(progress, 100))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (location.hash) {
      scrollToSection(location.hash)
    }
  }, [location.hash, scrollToSection])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-[9999] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page scroll progress"
        />

        <button
          className="fixed top-20 right-4 sm:right-6 z-[9998] w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 flex items-center justify-center text-lg sm:text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
        >
          {darkMode ? '\u2600\uFE0F' : '\uD83C\uDF19'}
        </button>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
            <Projects />
          </Suspense>
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default App
