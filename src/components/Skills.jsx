import { useState } from 'react'

const skillsData = [
  {
    category: 'Database',
    icon: '🗄️',
    color: '#00d4ff',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL']
  },
  {
    category: 'Frontend',
    icon: '🎨',
    color: '#8b5cf6',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'GitHub']
  },
  {
    category: 'Backend',
    icon: '⚙️',
    color: '#10b981',
    skills: ['Node.js', 'Express', 'AI']
  },
  {
    category: 'Class Courses',
    icon: '📚',
    color: '#f59e0b',
    skills: ['PHP', 'Java', 'C++', 'Video Editing', 'Cisco (Networking)', 'Algorithms', 'Mobile App Development', 'UI/UX Design', 'Computer Graphics']
  }
]

export default function Skills() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Skills</span>
          <h2>My Expertise</h2>
          <p className="section-subtitle">Technologies I work with</p>
        </div>
        <div className="skills-box">
          <button 
            className={`toggle-button ${isOpen ? 'active' : ''}`} 
            onClick={() => { setIsOpen(!isOpen); setActiveCategory(null) }}
          >
            {isOpen ? 'Hide Skills' : 'View Skills'}
            <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>+</span>
          </button>
          <div className={`skills-content section-content ${isOpen ? 'active' : ''}`}>
            <div className="skills-grid">
              {skillsData.map((category, index) => (
                <div 
                  key={index}
                  className={`skill-card ${activeCategory === index ? 'active' : ''}`}
                  style={{ '--accent-color': category.color }}
                  onClick={() => setActiveCategory(activeCategory === index ? null : index)}
                >
                  <div className="skill-header">
                    <span className="skill-icon">{category.icon}</span>
                    <h3>{category.category}</h3>
                    <span className="expand-indicator">{activeCategory === index ? '−' : '+'}</span>
                  </div>
                  <div className="skill-tags">
                    {category.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="skill-tag"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="skill-progress">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: activeCategory === index ? '100%' : '0%',
                        backgroundColor: category.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="skills-showcase">
              <div className="showcase-item">
                <span className="showcase-number">30+</span>
                <span className="showcase-label">Technologies</span>
              </div>
              <div className="showcase-item">
                <span className="showcase-number">5+</span>
                <span className="showcase-label">Years Experience</span>
              </div>
              <div className="showcase-item">
                <span className="showcase-number">100%</span>
                <span className="showcase-label">Client Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}