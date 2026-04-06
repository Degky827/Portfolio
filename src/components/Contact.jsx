import { useState } from 'react'

export default function Contact() {
  const [result, setResult] = useState('')
  const [resultStyle, setResultStyle] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult('')

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    }

    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setResult('✓ Message sent! You will receive an SMS and email notification.')
        setResultStyle({ color: '#10b981' })
        e.target.reset()
      } else {
        setResult('✗ Failed to send. Please try again or email me directly.')
        setResultStyle({ color: '#ef4444' })
      }
    } catch (error) {
      setResult('✗ Failed to send. Please email me directly at desalegnky827@gmail.com')
      setResultStyle({ color: '#ef4444' })
    }

    setIsSubmitting(false)
  }

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'desalegnky827@gmail.com', href: 'mailto:desalegnky827@gmail.com' },
    { icon: '📱', label: 'Phone', value: '+251 908720092', href: 'tel:+251908720092' },
    { icon: '📍', label: 'Location', value: 'Ethiopia', href: null }
  ]

  return (
    <section id="contact" className="contact">
      <div className="contact-background">
        <div className="contact-orb"></div>
      </div>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Contact</span>
          <h2>Get In Touch</h2>
          <p className="section-subtitle">Let's work together</p>
        </div>
        <div className="contact-box">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Let's Connect</h3>
              <p>Feel free to reach out if you're looking for a developer, have a question, or just want to connect.</p>
              <div className="contact-details">
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-item">
                    <span className="contact-icon">{info.icon}</span>
                    <div className="contact-text">
                      <span className="contact-label">{info.label}</span>
                      {info.href ? (
                        <a href={info.href}>{info.value}</a>
                      ) : (
                        <span>{info.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="social-links">
                <a href="mailto:desalegnky827@gmail.com" className="social-link" title="Email">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                </a>
                <a href="https://linkedin.com/in/dk-cs-3rd" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
                </a>
                <a href="https://github.com/desalegn-tech" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" /></svg>
                </a>
                <a href="https://t.me/Ds35kg" target="_blank" rel="noopener noreferrer" className="social-link" title="Telegram">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" /></svg>
                </a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>

              <div className={`form-group ${focusedField === 'name' ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder=" "
                  required
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
                <label htmlFor="name">Your Name</label>
                <span className="input-icon">👤</span>
              </div>

              <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder=" "
                  required
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
                <label htmlFor="email">Your Email</label>
                <span className="input-icon">✉️</span>
              </div>

              <div className={`form-group ${focusedField === 'message' ? 'focused' : ''}`}>
                <textarea
                  name="message"
                  id="message"
                  placeholder=" "
                  rows="5"
                  required
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                ></textarea>
                <label htmlFor="message">Your Message</label>
                <span className="input-icon">💬</span>
              </div>

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
          <div id="result" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.1rem', ...resultStyle }}>{result}</div>
        </div>
      </div>
    </section>
  )
}