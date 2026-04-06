import { useEffect, useState } from 'react'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const [typedText, setTypedText] = useState('')
  const fullText = 'Developer and Network Designer'

  useEffect(() => {
    setLoaded(true)
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className={`hero ${loaded ? 'loaded' : ''}`}>
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="grid-pattern"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="profile-box">
            <div className="profile-image-wrapper">
              <div className="profile-image">
                <img src="/dkk.jpg" alt="Desalegn Profile" />
              </div>
              <div className="profile-ring"></div>
            </div>
            <div className="hero-text">
              <div className="greeting">
                <span className="wave">👋</span> Hi, I'm
              </div>
              <h1>
                <span className="name">Desalegn</span>
                <span className="dot">.</span>
              </h1>
              <p className="subtitle">
                I am a <span className="typing-text">{typedText}</span>
                <span className="cursor">|</span>
              </p>
              <div className="cta-buttons">
                <button className="cta-button primary" onClick={scrollToContact}>
                  Get In Touch
                  <span className="arrow">→</span>
                </button>
                <a href="#projects" className="cta-button secondary" onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  View Work
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat">
                  <span className="stat-number">30+</span>
                  <span className="stat-label">Skills</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-indicator" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        <span>Scroll Down</span>
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
    </section>
  )
}