import { useState, useEffect, useRef, useMemo } from 'react'

/**
 * CodeEditorScreen
 *
 * VS Code–like editor on the 3D monitor screen.
 * Types out an "about me" developer profile, pauses,
 * then clears and restarts automatically.
 *
 * Fixed virtual screen: 1280×720px.
 */

const CODE_LINES = [
  '/**',
  ' * About Me - Developer Portfolio',
  ' * Auto-generated profile overview',
  ' */',
  '',
  'const aboutMe = {',
  '    name: "Desalegn Abreha",',
  '    title: "Full Stack Developer",',
  '    location: "Ethiopia",',
  '    education: "Software Engineering Student",',
  '',
  '    bio:',
  '        "I build modern, scalable web applications.",',
  '',
  '    skills: {',
  '        frontend: ["React", "Next.js", "TypeScript", "Tailwind"],',
  '        backend:  ["Node.js", "Express", "Python", "Django"],',
  '        database: ["MongoDB", "PostgreSQL", "Redis"],',
  '        devops:   ["Docker", "AWS", "GitHub Actions"]',
  '    },',
  '',
  '    experience: {',
  '        projects: 42,',
  '        commits: "2,500+",',
  '        contributions: "Open Source Enthusiast"',
  '    },',
  '',
  '    interests: [',
  '        "Building futuristic UIs",',
  '        "3D Web Experiences",',
  '        "AI and Machine Learning",',
  '        "System Architecture"',
  '    ],',
  '',
  '    status: "Open To Work",',
  '',
  '    contact: {',
  '        github: "github.com/desalegn",',
  '        email:  "hello@desalegn.dev"',
  '    }',
  '};',
  '',
  'function getGreeting() {',
  '    const { name, title, skills } = aboutMe;',
  '    return `Hi, I am ${name}`;',
  '}',
  '',
  'console.log(getGreeting());',
  'console.log(`${aboutMe.title}`);',
  'console.log(`Skills: ${Object.keys(aboutMe.skills).join(", ")}`);',
]

const FULL_CODE = CODE_LINES.join('\n')

const TYPING_SPEED = 20
const CHARS_PER_TICK = 2
const PAUSE_AFTER_DONE = 3000
const CLEAR_SPEED = 3

/* Syntax highlighting */
function highlightLine(text) {
  if (!text) return null

  const spans = []
  let lastEnd = 0

  const addMatch = (re, color) => {
    let m
    const regex = new RegExp(re.source, re.flags)
    while ((m = regex.exec(text)) !== null) {
      if (m.index >= lastEnd) {
        spans.push({ start: m.index, end: m.index + m[0].length, color, text: m[0] })
      }
    }
  }

  addMatch(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '#6a9955')
  addMatch(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, '#ce9178')
  addMatch(/\$\{[^}]+\}/g, '#ce9178')
  addMatch(/\b(const|let|var|function|return|console|log|join|keys|object)\b/g, '#569cd6')
  addMatch(/\b(name|title|location|education|bio|skills|frontend|backend|database|devops|experience|projects|commits|contributions|interests|status|contact|github|email)\b(?=\s*[:\]])/g, '#9cdcfe')
  addMatch(/\b(true|false|null|undefined|NaN|Infinity)\b/g, '#569cd6')
  addMatch(/\b(\d+\.?\d*)\b/g, '#b5cea8')

  spans.sort((a, b) => a.start - b.start)

  const merged = []
  let end = 0
  for (const s of spans) {
    if (s.start < end) continue
    if (s.start > end) merged.push({ text: text.slice(end, s.start), color: '#d4d4d4' })
    merged.push(s)
    end = s.end
  }
  if (end < text.length) merged.push({ text: text.slice(end), color: '#d4d4d4' })

  return merged.map((p, i) => <span key={i} style={{ color: p.color }}>{p.text}</span>)
}

function TitleBar() {
  return (
    <div style={{
      height: '36px',
      background: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      borderBottom: '1px solid #0f172a',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
      </div>
      <div style={{
        flex: 1,
        textAlign: 'center',
        fontSize: '12px',
        color: '#94a3b8',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        aboutMe.js — Visual Studio Code
      </div>
    </div>
  )
}

function TabBar() {
  return (
    <div style={{
      height: '35px',
      background: '#1e293b',
      display: 'flex',
      alignItems: 'stretch',
      borderBottom: '1px solid #0f172a',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 16px',
        background: '#0f172a',
        borderRight: '1px solid #0f172a',
        borderTop: '2px solid #3b82f6',
        fontSize: '13px',
        color: '#e2e8f0',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span style={{ color: '#f1e05a', fontSize: '11px' }}>JS</span>
        aboutMe.js
        <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '4px' }}>×</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 16px',
        fontSize: '13px',
        color: '#64748b',
        fontFamily: "'JetBrains Mono', monospace",
        opacity: 0.6,
      }}>
        <span style={{ color: '#519aba', fontSize: '11px' }}>{'<>'}</span>
        profile.json
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <div style={{
      width: '220px',
      background: '#1e293b',
      borderRight: '1px solid #0f172a',
      padding: '8px 0',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{
        fontSize: '11px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        padding: '4px 16px 8px',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
      }}>
        Explorer
      </div>
      {[
        { name: 'portfolio', indent: 0, icon: '📁', active: false },
        { name: 'src', indent: 1, icon: '📂', active: false },
        { name: 'components', indent: 2, icon: '📂', active: false },
        { name: 'AboutMe.jsx', indent: 3, icon: '📄', active: true },
        { name: 'Hero.jsx', indent: 3, icon: '📄', active: false },
        { name: 'Profile.jsx', indent: 3, icon: '📄', active: false },
        { name: 'styles', indent: 2, icon: '📂', active: false },
        { name: 'globals.css', indent: 3, icon: '🎨', active: false },
        { name: 'public', indent: 1, icon: '📂', active: false },
        { name: 'package.json', indent: 0, icon: '⚙️', active: false },
      ].map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 0',
          paddingLeft: `${item.indent * 16}px`,
          fontSize: '13px',
          color: item.active ? '#e2e8f0' : '#64748b',
          background: item.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          fontFamily: "'JetBrains Mono', monospace",
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>{item.icon}</span>
          {item.name}
        </div>
      ))}
    </div>
  )
}

function StatusBar() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '28px',
      background: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: "'JetBrains Mono', monospace",
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '10px' }}>⎇</span> main
        </span>
        <span>✓ 0</span>
        <span>⚠ 0</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>Ln 1, Col 1</span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>JavaScript</span>
      </div>
    </div>
  )
}

export default function CodeEditorScreen() {
  const [typedChars, setTypedChars] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [phase, setPhase] = useState('typing')
  const [clearedChars, setClearedChars] = useState(0)
  const intervalRef = useRef(null)

  const totalChars = FULL_CODE.length

  /* Typing animation */
  useEffect(() => {
    if (phase !== 'typing') return
    intervalRef.current = setInterval(() => {
      setTypedChars((prev) => {
        const next = prev + CHARS_PER_TICK
        if (next >= totalChars) {
          clearInterval(intervalRef.current)
          setTimeout(() => setPhase('paused'), 100)
          return totalChars
        }
        return next
      })
    }, TYPING_SPEED)
    return () => clearInterval(intervalRef.current)
  }, [phase, totalChars])

  /* Pause then start clearing */
  useEffect(() => {
    if (phase !== 'paused') return
    const timer = setTimeout(() => setPhase('clearing'), PAUSE_AFTER_DONE)
    return () => clearTimeout(timer)
  }, [phase])

  /* Clearing animation */
  useEffect(() => {
    if (phase !== 'clearing') return
    intervalRef.current = setInterval(() => {
      setClearedChars((prev) => {
        const next = prev + CLEAR_SPEED
        if (next >= totalChars) {
          clearInterval(intervalRef.current)
          setTypedChars(0)
          setClearedChars(0)
          setTimeout(() => setPhase('typing'), 400)
          return 0
        }
        return next
      })
    }, 8)
    return () => clearInterval(intervalRef.current)
  }, [phase, totalChars])

  /* Blinking cursor */
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  const visibleCode = useMemo(() => {
    if (phase === 'clearing') {
      return FULL_CODE.slice(0, totalChars - clearedChars)
    }
    return FULL_CODE.slice(0, typedChars)
  }, [typedChars, clearedChars, phase, totalChars])

  const visibleLines = useMemo(() => visibleCode.split('\n'), [visibleCode])

  return (
    <div style={{
      width: '1280px',
      height: '720px',
      overflow: 'hidden',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      color: '#e2e8f0',
      userSelect: 'none',
      pointerEvents: 'none',
      background: '#0f172a',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(59, 130, 246, 0.08) 0%, rgba(6, 182, 212, 0.04) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 20,
      }} />

      {/* Scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)',
        pointerEvents: 'none',
        zIndex: 21,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.3) 100%)',
        pointerEvents: 'none',
        zIndex: 22,
      }} />

      <TitleBar />
      <TabBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />

        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          background: '#0f172a',
        }}>
          {/* Line numbers */}
          <div style={{
            width: '60px',
            background: '#0f172a',
            borderRight: '1px solid #1e293b',
            padding: '8px 0',
            textAlign: 'right',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            lineHeight: '20px',
            color: '#475569',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {visibleLines.map((_, i) => (
              <div key={i} style={{ paddingRight: '12px', height: '20px' }}>{i + 1}</div>
            ))}
          </div>

          {/* Code content */}
          <div style={{
            flex: 1,
            padding: '8px 16px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Active line highlight */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${8 + (visibleLines.length - 1) * 20}px`,
              height: '20px',
              background: 'rgba(59, 130, 246, 0.06)',
              pointerEvents: 'none',
            }} />

            {visibleLines.map((line, i) => {
              const isLastLine = i === visibleLines.length - 1
              const showCursor = isLastLine && cursorVisible && phase === 'typing'

              return (
                <div key={i} style={{
                  height: '20px',
                  lineHeight: '20px',
                  fontSize: '13px',
                  whiteSpace: 'pre',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {highlightLine(line)}
                  {showCursor && (
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      background: '#60a5fa',
                      verticalAlign: 'middle',
                      marginLeft: '1px',
                      boxShadow: '0 0 8px rgba(96, 165, 250, 0.6)',
                      animation: 'cursorBlink 1.06s step-end infinite',
                    }} />
                  )}
                </div>
              )
            })}

            {/* Status indicator */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              padding: '6px 14px',
              borderRadius: '6px',
              background: phase === 'paused'
                ? 'rgba(34, 197, 94, 0.12)'
                : phase === 'clearing'
                  ? 'rgba(245, 158, 11, 0.12)'
                  : 'rgba(59, 130, 246, 0.12)',
              border: `1px solid ${
                phase === 'paused'
                  ? 'rgba(34, 197, 94, 0.3)'
                  : phase === 'clearing'
                    ? 'rgba(245, 158, 11, 0.3)'
                    : 'rgba(59, 130, 246, 0.3)'
              }`,
              fontSize: '12px',
              color: phase === 'paused'
                ? '#22c55e'
                : phase === 'clearing'
                  ? '#f59e0b'
                  : '#60a5fa',
              fontFamily: "'JetBrains Mono', monospace",
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: phase === 'paused'
                  ? '#22c55e'
                  : phase === 'clearing'
                    ? '#f59e0b'
                    : '#60a5fa',
                boxShadow: `0 0 6px ${
                  phase === 'paused'
                    ? '#22c55e'
                    : phase === 'clearing'
                      ? '#f59e0b'
                      : '#60a5fa'
                }`,
              }} />
              {phase === 'paused' ? 'Complete' : phase === 'clearing' ? 'Restarting...' : 'Typing...'}
            </div>
          </div>
        </div>
      </div>

      <StatusBar />

      {/* Minimap */}
      <div style={{
        position: 'absolute',
        top: '71px',
        right: 0,
        width: '80px',
        bottom: '28px',
        background: 'rgba(15, 23, 42, 0.7)',
        borderLeft: '1px solid #1e293b',
        overflow: 'hidden',
        zIndex: 5,
      }}>
        {visibleLines.map((line, i) => (
          <div key={i} style={{ height: '3px', marginBottom: '1px', padding: '0 4px' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(line.length * 1.5, 100)}%`,
              background: 'rgba(148, 163, 184, 0.12)',
              borderRadius: '1px',
            }} />
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute',
        top: '71px',
        right: 0,
        width: '4px',
        height: `${Math.min(100, (visibleLines.length / CODE_LINES.length) * 100)}%`,
        background: 'rgba(59, 130, 246, 0.25)',
        borderRadius: '2px',
        zIndex: 6,
        transition: 'height 0.3s',
      }} />

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
