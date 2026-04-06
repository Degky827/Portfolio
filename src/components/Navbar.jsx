import { useState } from 'react'

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <a href="#home" className="logo" onClick={(e) => handleNavClick(e, 'home')}>
          <span className="logo-icon">⚡</span>
          Portfolio
        </a>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <span className={isOpen ? 'open' : ''}></span>
          <span className={isOpen ? 'open' : ''}></span>
          <span className={isOpen ? 'open' : ''}></span>
        </button>
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={(e) => handleNavClick(e, link.id)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}