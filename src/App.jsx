import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CVModal from './components/CVModal'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showCV, setShowCV] = useState(false)

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
      const progress = (totalHeight / windowHeight) * 100
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-[9999] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <button 
        className="fixed top-20 right-4 sm:right-6 z-[9998] w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 flex items-center justify-center text-lg sm:text-2xl hover:scale-110 transition-transform"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      <Navbar onOpenCV={() => setShowCV(true)} />
      <main>
        <Hero onOpenCV={() => setShowCV(true)} />
        <About onOpenCV={() => setShowCV(true)} />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <CVModal isOpen={showCV} onClose={() => setShowCV(false)} />
    </div>
  )
}

export default App
