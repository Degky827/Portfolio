import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar')
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)'
      } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <button 
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}

export default App