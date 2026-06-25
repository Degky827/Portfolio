import { useState, useEffect } from 'react'

/**
 * PortfolioScreen
 *
 * The complete portfolio UI rendered inside the monitor screen.
 * Contains: profile photo, name, title, skills, progress bars,
 * social icons, and status badge.
 *
 * Fixed virtual screen size: 1280x720px, scaled via CSS transform.
 */

const SKILLS = [
  { name: 'React', level: 92, color: '#61dafb', icon: '⚛' },
  { name: 'Node.js', level: 85, color: '#68a063', icon: '⬢' },
  { name: 'Three.js', level: 78, color: '#8b5cf6', icon: '△' },
  { name: 'Flutter', level: 70, color: '#02569b', icon: '◆' },
]

const SOCIAL_LINKS = [
  { name: 'GitHub', icon: 'GH', color: '#d4d4d4' },
  { name: 'LinkedIn', icon: 'LI', color: '#0077b5' },
  { name: 'Twitter', icon: 'TW', color: '#1da1f2' },
]

function SkillBar({ name, level, color, icon, delay }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(level), 600 + delay)
    return () => clearTimeout(timer)
  }, [level, delay])

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
      }}>
        <span style={{
          fontSize: '16px',
          color: '#d4d4d4',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ color, fontSize: '14px' }}>{icon}</span>
          {name}
        </span>
        <span style={{
          fontSize: '14px',
          color: '#808080',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}>
          {level}%
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '6px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${width}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          borderRadius: '3px',
          transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 12px ${color}66`,
        }} />
      </div>
    </div>
  )
}

export default function PortfolioScreen() {
  return (
    <div
      style={{
        width: '1280px',
        height: '720px',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#d4d4d4',
        userSelect: 'none',
        pointerEvents: 'none',
        background: '#05040a',
        position: 'relative',
      }}
    >
      {/* Background gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Main content container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '40px 60px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Profile Photo */}
        <div style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          marginBottom: '20px',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)',
            animation: 'spin 4s linear infinite',
          }} />
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e1b4b, #0f0a2a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#8b5cf6',
            position: 'relative',
            zIndex: 1,
            border: '3px solid #05040a',
          }}>
            DA
          </div>
          {/* Online indicator */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#4ec9b0',
            border: '3px solid #05040a',
            zIndex: 2,
            boxShadow: '0 0 8px #4ec9b0',
          }} />
        </div>

        {/* Name */}
        <h1 style={{
          margin: 0,
          fontSize: '32px',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
          textAlign: 'center',
        }}>
          Desalegn Abreha
        </h1>

        {/* Title */}
        <p style={{
          margin: '6px 0 0',
          fontSize: '18px',
          color: '#8b5cf6',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          Full Stack Developer
        </p>

        {/* Subtitle */}
        <p style={{
          margin: '4px 0 0',
          fontSize: '14px',
          color: '#808080',
          textAlign: 'center',
        }}>
          Software Engineering Student
        </p>

        {/* Status badge */}
        <div style={{
          marginTop: '12px',
          padding: '4px 14px',
          borderRadius: '20px',
          background: 'rgba(78, 201, 176, 0.15)',
          border: '1px solid rgba(78, 201, 176, 0.3)',
          fontSize: '12px',
          color: '#4ec9b0',
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#4ec9b0',
            boxShadow: '0 0 6px #4ec9b0',
          }} />
          Available for hire
        </div>

        {/* Divider */}
        <div style={{
          width: '200px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent)',
          margin: '20px 0',
        }} />

        {/* Skills Section */}
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <p style={{
            fontSize: '12px',
            color: '#808080',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '14px',
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: 'center',
          }}>
            Core Skills
          </p>
          {SKILLS.map((skill, i) => (
            <SkillBar
              key={skill.name}
              {...skill}
              delay={i * 150}
            />
          ))}
        </div>

        {/* Divider */}
        <div style={{
          width: '200px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent)',
          margin: '16px 0',
        }} />

        {/* Social Links */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '14px',
        }}>
          {SOCIAL_LINKS.map((link) => (
            <div
              key={link.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: link.color,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {link.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Scanline overlay effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 2px)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
