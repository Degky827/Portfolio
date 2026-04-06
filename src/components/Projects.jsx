import { useState } from 'react'

const projectsData = [
  {
    title: 'Web Application Development',
    description: 'Full-stack web applications with responsive design and modern user interfaces.',
    tags: ['Frontend', 'Backend', 'Database'],
    icon: '🌐',
    color: '#6366f1'
  },
  {
    title: 'Network Infrastructure Design',
    description: 'Enterprise network architecture with secure and scalable infrastructure solutions.',
    tags: ['Network Design', 'Security', 'Infrastructure'],
    icon: '🔗',
    color: '#8b5cf6'
  },
  {
    title: 'System Integration',
    description: 'Integration of software systems with network infrastructure for seamless operations.',
    tags: ['Integration', 'Automation', 'Optimization'],
    icon: '⚡',
    color: '#10b981'
  }
]

export default function Projects() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null)

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Projects</span>
          <h2>Featured Work</h2>
          <p className="section-subtitle">Things I've built</p>
        </div>
        <div className="projects-box">
          <button 
            className={`toggle-button ${isOpen ? 'active' : ''}`} 
            onClick={() => { setIsOpen(!isOpen); setActiveProject(null) }}
          >
            {isOpen ? 'Hide Projects' : 'View Projects'}
            <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>+</span>
          </button>
          <div className={`projects-grid section-content ${isOpen ? 'active' : ''}`}>
            {projectsData.map((project, index) => (
              <div 
                key={index}
                className={`project-card ${activeProject === index ? 'active' : ''}`}
                style={{ '--project-color': project.color }}
                onMouseEnter={() => setActiveProject(index)}
                onMouseLeave={() => setActiveProject(null)}
              >
                <div className="project-icon">{project.icon}</div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="project-overlay">
                  <button className="view-project-btn">
                    View Details
                    <span>→</span>
                  </button>
                </div>
                <div className="project-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}