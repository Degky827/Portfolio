import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * CodeEditor
 *
 * Premium VS Code-like code editor with:
 * - macOS traffic lights
 * - File title (ABOUT_ME.js)
 * - Line numbers
 * - Syntax highlighting (VS Code Dark+ theme)
 * - Blinking cursor
 * - Minimap
 * - Status bar
 * - Typing animation
 * - 3D interactive tilt on mouse hover
 */

// VS Code Dark+ syntax colors
const COLORS = {
  keyword: '#c586c0',    // const, let, return
  variable: '#9cdcfe',   // developer, name
  string: '#ce9178',     // "string"
  number: '#b5cea8',     // numbers
  property: '#9cdcfe',   // object properties
  punctuation: '#d4d4d4', // {, }, ;, :
  comment: '#6a9955',    // comments
  type: '#4ec9b0',       // types
  function: '#dcdcaa',   // functions
  lineNumber: '#858585',
  lineNumberActive: '#c6c6c6',
  lineNumberBg: '#1e1e1e',
  editorBg: '#1e1e1e',
  gutterBg: '#1e1e1e',
  statusBarBg: '#007acc',
  titleBarBg: '#323233',
  tabBg: '#2d2d2d',
  tabActiveBg: '#1e1e1e',
}

// Build code lines from developer data
function buildCodeLines(fullName, roleTitle, locationText, skills, available) {
  return [
    { tokens: [{ text: 'const ', cls: 'kw' }, { text: 'developer', cls: 'var' }, { text: ' = {', cls: 'punc' }] },
    { tokens: [{ text: '  name: ', cls: 'prop' }, { text: `"${fullName}"`, cls: 'str' }, { text: ',', cls: 'punc' }] },
    { tokens: [{ text: '  role: ', cls: 'prop' }, { text: `"${roleTitle}"`, cls: 'str' }, { text: ',', cls: 'punc' }] },
    { tokens: [{ text: '  location: ', cls: 'prop' }, { text: `"${locationText}"`, cls: 'str' }, { text: ',', cls: 'punc' }] },
    { tokens: [{ text: '  skills: [', cls: 'prop' }, { text: `"${skills.slice(0, 4).join('", "')}"`, cls: 'str' }, { text: '],', cls: 'punc' }] },
    { tokens: [{ text: '  available: ', cls: 'prop' }, { text: available ? 'true' : 'false', cls: 'num' }, { text: ',', cls: 'punc' }] },
    { tokens: [{ text: '};', cls: 'punc' }] },
    { tokens: [] },
    { tokens: [{ text: '// Build something amazing', cls: 'cmt' }] },
  ]
}

const colorMap = {
  kw: COLORS.keyword,
  var: COLORS.variable,
  str: COLORS.string,
  num: COLORS.number,
  prop: COLORS.property,
  punc: COLORS.punctuation,
  cmt: COLORS.comment,
  type: COLORS.type,
  fn: COLORS.function,
}

function CodeEditor({ fullName, roleTitle, locationText, skills, available }) {
  const codeLines = useMemo(
    () => buildCodeLines(fullName, roleTitle, locationText, skills, available),
    [fullName, roleTitle, locationText, skills, available]
  )

  const flatLines = useMemo(
    () => codeLines.map((line) => line.tokens.map((t) => t.text).join('')),
    [codeLines]
  )

  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)
  const pauseTimerRef = useRef(null)
  const scrollRef = useRef(null)
  const containerRef = useRef(null)

  // ── Mouse-interactive tilt ──
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const mouseRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 100,
    damping: 15,
  })
  const mouseRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 100,
    damping: 15,
  })

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const totalLines = codeLines.length

  const tick = useCallback(() => {
    setCharIdx((prev) => {
      const currentLineLen = flatLines[lineIdx].length
      if (prev < currentLineLen) return prev + 1
      if (lineIdx + 1 < totalLines) {
        setLineIdx((l) => l + 1)
        return 0
      }
      setPaused(true)
      return prev
    })
  }, [lineIdx, totalLines, flatLines])

  useEffect(() => {
    if (paused) {
      pauseTimerRef.current = setTimeout(() => {
        setLineIdx(0)
        setCharIdx(0)
        setPaused(false)
      }, 3000)
      return () => clearTimeout(pauseTimerRef.current)
    }
    timerRef.current = setTimeout(tick, 35)
    return () => clearTimeout(timerRef.current)
  }, [lineIdx, charIdx, paused, tick])

  // Auto-scroll as code types
  useEffect(() => {
    if (scrollRef.current) {
      const lineHeight = 22
      const targetScroll = Math.max(0, (lineIdx - 4) * lineHeight)
      scrollRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }, [lineIdx])

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col h-full w-full rounded-lg overflow-hidden"
      style={{
        background: COLORS.editorBg,
        transformStyle: 'preserve-3d',
        rotateX: mouseRotateX,
        rotateZ: 0,
      }}
    >
      <motion.div
        className="flex flex-col h-full w-full"
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
      {/* ── Title Bar ── */}
      <div
        className="flex items-center px-3 py-2 border-b"
        style={{
          background: COLORS.titleBarBg,
          borderColor: '#3c3c3c',
        }}
      >
        {/* macOS traffic lights */}
        <div className="flex items-center gap-[6px] mr-3">
          <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-[11px] h-[11px] rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>

        {/* Tab */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-t text-[11px] font-medium"
          style={{
            background: COLORS.tabActiveBg,
            color: '#ffffff',
          }}
        >
          <svg className="w-3.5 h-3.5 text-[#4ec9b0]" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.5 1.5v13h9v-13h-9zm0-1.5h9a1.5 1.5 0 011.5 1.5v13a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5v-13A1.5 1.5 0 013.5 0z" />
            <path d="M5 5h6v1H5V5zm0 2.5h6v1H5v-1zm0 2.5h4v1H5v-1z" opacity="0.5" />
          </svg>
          <span>ABOUT_ME.js</span>
        </div>
      </div>

      {/* ── Editor Body ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Line numbers + Code */}
        <div className="flex flex-1 overflow-hidden">
          {/* Gutter (line numbers) */}
          <div
            className="flex-shrink-0 select-none text-right pr-3 pt-3 pb-3"
            style={{
              background: COLORS.gutterBg,
              fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontSize: '12px',
              lineHeight: '22px',
            }}
          >
            {codeLines.map((_, i) => (
              <div
                key={i}
                style={{
                  color: i === lineIdx ? COLORS.lineNumberActive : COLORS.lineNumber,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden pt-3 pb-3"
            style={{
              fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontSize: '12px',
              lineHeight: '22px',
            }}
          >
            {codeLines.map((line, i) => {
              const isCurrent = i === lineIdx
              const isFuture = i > lineIdx
              const lineText = flatLines[i]

              let display
              if (isFuture) {
                display = <span style={{ visibility: 'hidden' }}>{lineText || ' '}</span>
              } else if (isCurrent) {
                const shown = lineText.slice(0, charIdx)
                const segments = []
                let pos = 0
                line.tokens.forEach((tok) => {
                  if (pos >= shown.length) return
                  const end = pos + tok.text.length
                  const slice = shown.slice(Math.max(pos, 0), end)
                  if (slice) {
                    segments.push(
                      <span key={pos} style={{ color: colorMap[tok.cls] || COLORS.punctuation }}>
                        {slice}
                      </span>
                    )
                  }
                  pos = end
                })
                display = (
                  <>
                    {segments}
                    <span
                      className="inline-block w-[2px] h-[14px] align-text-bottom ml-[1px]"
                      style={{
                        background: '#aeafad',
                        boxShadow: '0 0 4px rgba(174,175,173,0.5)',
                        animation: 'cursorBlink 1s step-end infinite',
                      }}
                    />
                  </>
                )
              } else {
                display = line.tokens.map((tok, ti) => (
                  <span key={ti} style={{ color: colorMap[tok.cls] || COLORS.punctuation }}>
                    {tok.text}
                  </span>
                ))
              }

              return (
                <div key={i} className="whitespace-pre" style={{ minHeight: '22px' }}>
                  {display || ' '}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Minimap ── */}
        <div
          className="hidden sm:flex flex-shrink-0 w-[40px] flex-col pt-2 pb-2 overflow-hidden"
          style={{ background: COLORS.editorBg }}
        >
          {codeLines.map((line, i) => (
            <div key={i} className="flex items-center gap-[1px] px-1" style={{ height: '4px' }}>
              {line.tokens.map((tok, ti) => (
                <div
                  key={ti}
                  className="rounded-[0.5px]"
                  style={{
                    width: `${Math.min(tok.text.length * 1.2, 30)}px`,
                    height: '2px',
                    background: i <= lineIdx ? (colorMap[tok.cls] || '#555') : '#333',
                    opacity: i <= lineIdx ? 0.6 : 0.2,
                  }}
                />
              ))}
            </div>
          ))}
          {/* Viewport indicator */}
          <div
            className="mt-1 mx-1 rounded-[1px]"
            style={{
              height: '12px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div
        className="flex items-center justify-between px-3 py-[3px] text-[10px] text-white/80"
        style={{ background: COLORS.statusBarBg }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm-.5 3.5a.5.5 0 00-1 0v4l3 1.5.5-.866-2.5-1.25V3.5z" />
            </svg>
            Ln {lineIdx + 1}, Col {charIdx + 1}
          </span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>JavaScript</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.5 3.5a.5.5 0 011 0v4l2.5 1.5.5-.866-3-1.75V4.5z" />
            </svg>
            Prettier
          </span>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      </motion.div>
    </motion.div>
  )
}

export default memo(CodeEditor)
