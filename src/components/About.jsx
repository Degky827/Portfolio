import { useState } from 'react'

const aboutSections = [
  {
    title: 'Education & Background',
    content: 'I hold a Bachelor\'s degree in Computer Science and a Master\'s degree in Cyber Security, which has provided me with a comprehensive understanding of both software development and information security principles.'
  },
  {
    title: 'Professional Focus',
    content: 'As a Developer and Network Designer, I specialize in creating robust software solutions and designing secure, efficient network infrastructures. My work combines practical development skills with strategic network architecture to deliver comprehensive technology solutions.'
  },
  {
    title: 'Expertise Areas',
    content: 'My expertise includes software development, network design and implementation, security architecture, and system integration. I\'m passionate about building scalable applications and designing network systems that are both secure and performant.'
  },
  {
    title: 'Approach',
    content: 'I believe in creating solutions that balance functionality, security, and efficiency. Whether developing applications or designing network infrastructures, I focus on delivering reliable systems that meet real-world needs while maintaining best practices in security and performance.'
  }
]

export default function About() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(null)

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">About Me</span>
          <h2>Get to Know Me</h2>
          <p className="section-subtitle">A passionate developer and network designer</p>
        </div>
        <div className="about-box">
          <button 
            className={`toggle-button ${isOpen ? 'active' : ''}`} 
            onClick={() => { setIsOpen(!isOpen); setActiveSection(null) }}
          >
            {isOpen ? 'Show Less' : 'Read More'}
            <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>+</span>
          </button>
          <div className={`about-content section-content ${isOpen ? 'active' : ''}`}>
            <div className="about-grid">
              <div className="about-cards">
                {aboutSections.map((section, index) => (
                  <div 
                    key={index}
                    className={`about-card ${activeSection === index ? 'active' : ''}`}
                    onClick={() => setActiveSection(activeSection === index ? null : index)}
                  >
                    <div className="card-icon">
                      {index === 0 && '🎓'}
                      {index === 1 && '💼'}
                      {index === 2 && '🚀'}
                      {index === 3 && '🎯'}
                    </div>
                    <h3>{section.title}</h3>
                    <p>{section.content}</p>
                    <span className="expand-icon">{activeSection === index ? '−' : '+'}</span>
                  </div>
                ))}
              </div>
              <div className="about-visual">
                <div className="code-block">
                  <div className="code-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <pre><code>{`const developer = {
  name: "Desalegn",
  role: "Full-Stack Developer",
  skills: ["React", "Node.js", "Network Design"],
  passion: "Building great software",
  available: true
};

// Let's build something amazing!`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}