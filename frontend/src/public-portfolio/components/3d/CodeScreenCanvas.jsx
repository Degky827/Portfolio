import { useRef, useEffect, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * CodeScreenCanvas
 *
 * Draws a VS Code–like code editor onto a <canvas>,
 * then uses it as a CanvasTexture on a Three.js plane.
 * No Html component needed — pure Canvas2D + texture.
 *
 * Virtual resolution: 1280×720
 */

const W = 1280
const H = 720

const CODE_LINES = [
  '/**',
  ' * Developer Profile',
  ' * Generated from Portfolio System',
  ' */',
  '',
  'const developer = {',
  '    name: "Desalegn",',
  '    role: "Full Stack Developer",',
  '',
  '    expertise: [',
  '        "React",',
  '        "Node.js",',
  '        "Express.js",',
  '        "MongoDB"',
  '    ],',
  '',
  '    description:',
  '        "I build modern, scalable, and secure',
  '         web applications.",',
  '',
  '    status: "I am Open To Work !!!',
  '             Let\'s work together!",',
  '',
  '    contact: {',
  '        github: "github.com/Degky827",',
  '        email: "desalegnky827@gmail.com"',
  '    }',
  '};',
  '',
  'console.log("Hello, I am " + developer.name);',
  'console.log("Role: " + developer.role);',
]

const FULL_TEXT = CODE_LINES.join('\n')
const TYPING_SPEED = 22
const CHARS_PER_TICK = 2
const PAUSE_MS = 3000
const CLEAR_SPEED = 4

/* Syntax token colors (VS Code dark+ inspired) */
const COLORS = {
  bg: '#0f172a',
  sidebarBg: '#1e293b',
  titleBar: '#1e293b',
  statusBar: '#3b82f6',
  lineNumber: '#475569',
  lineNumberBg: '#0f172a',
  text: '#e2e8f0',
  keyword: '#569cd6',
  string: '#ce9178',
  comment: '#6a9955',
  property: '#9cdcfe',
  number: '#b5cea8',
  punctuation: '#d4d4d4',
  activeLine: 'rgba(59,130,246,0.06)',
  cursor: '#60a5fa',
  minimap: '#1e293b',
  minimapBar: 'rgba(148,163,184,0.12)',
}

/* Simple tokenizer — returns array of { text, color } per line */
function tokenizeLine(line) {
  if (!line) return [{ text: '', color: COLORS.text }]

  const tokens = []
  const patterns = [
    { re: /(\/\/.*$)/, color: COLORS.comment },
    { re: /(["'`])(?:(?!\1|\\).|\\.)*\1/g, color: COLORS.string },
    { re: /\b(const|let|var|function|return|console|log|join)\b/, color: COLORS.keyword },
    { re: /\b(name|role|expertise|description|status|contact|github|email)\b(?=\s*:)/, color: COLORS.property },
  ]

  let remaining = line
  let pos = 0

  while (remaining.length > 0) {
    let earliest = null
    let earliestIdx = remaining.length

    for (const p of patterns) {
      const re = new RegExp(p.re.source, p.re.flags)
      const m = re.exec(remaining)
      if (m && m.index < earliestIdx) {
        earliest = { text: m[0], color: p.color, start: m.index }
        earliestIdx = m.index
      }
    }

    if (earliest) {
      if (earliest.start > 0) {
        tokens.push({ text: remaining.slice(0, earliest.start), color: COLORS.text })
      }
      tokens.push({ text: earliest.text, color: earliest.color })
      remaining = remaining.slice(earliest.start + earliest.text.length)
    } else {
      tokens.push({ text: remaining, color: COLORS.text })
      break
    }
  }

  return tokens.length ? tokens : [{ text: line, color: COLORS.text }]
}

/* Draw rounded rect */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

export default function CodeScreenCanvas({ screenW = 2.48, screenH = 1.38 }) {
  const canvasRef = useRef(null)
  const textureRef = useRef(null)
  const stateRef = useRef({
    typedChars: 0,
    clearedChars: 0,
    phase: 'typing',
    timer: 0,
    cursorBlink: 0,
    cursorVisible: true,
    lastTime: 0,
  })

  /* Create canvas + texture once */
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    canvasRef.current = canvas

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    textureRef.current = texture

    return () => {
      texture.dispose()
    }
  }, [])

  /* Animation frame loop */
  useFrame((_, delta) => {
    const tex = textureRef.current
    const cvs = canvasRef.current
    if (!tex || !cvs) return

    const s = stateRef.current
    const dt = Math.min(delta, 0.05) * 1000

    s.lastTime += dt
    s.cursorBlink += dt
    if (s.cursorBlink > 530) {
      s.cursorBlink -= 530
      s.cursorVisible = !s.cursorVisible
    }

    /* Update typing state */
    if (s.phase === 'typing') {
      s.timer += dt
      while (s.timer >= TYPING_SPEED && s.typedChars < FULL_TEXT.length) {
        s.typedChars = Math.min(s.typedChars + CHARS_PER_TICK, FULL_TEXT.length)
        s.timer -= TYPING_SPEED
      }
      if (s.typedChars >= FULL_TEXT.length) {
        s.phase = 'paused'
        s.timer = 0
      }
    } else if (s.phase === 'paused') {
      s.timer += dt
      if (s.timer >= PAUSE_MS) {
        s.phase = 'clearing'
        s.timer = 0
      }
    } else if (s.phase === 'clearing') {
      s.timer += dt
      while (s.timer >= 8 && s.clearedChars < FULL_TEXT.length) {
        s.clearedChars = Math.min(s.clearedChars + CLEAR_SPEED, FULL_TEXT.length)
        s.timer -= 8
      }
      if (s.clearedChars >= FULL_TEXT.length) {
        s.typedChars = 0
        s.clearedChars = 0
        s.phase = 'typing'
        s.timer = 0
      }
    }

    /* Visible text */
    const visLen = s.phase === 'clearing'
      ? FULL_TEXT.length - s.clearedChars
      : s.typedChars
    const visText = FULL_TEXT.slice(0, visLen)
    const visLines = visText.split('\n')

    /* Draw */
    const ctx = cvs.getContext('2d')
    drawEditor(ctx, visLines, s)
    tex.needsUpdate = true
  })

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: textureRef.current,
      toneMapped: false,
    })
  }, [])

  /* Cleanup texture on unmount */
  useEffect(() => {
    return () => {
      if (material.map) material.map.dispose()
      material.dispose()
    }
  }, [material])

  if (!textureRef.current) return null

  return (
    <mesh position={[0, 0, 0.025]}>
      <planeGeometry args={[screenW, screenH]} />
      <meshBasicMaterial
        map={textureRef.current}
        toneMapped={false}
      />
    </mesh>
  )
}

/* ── Draw the full editor frame ──────────────────────────────── */
function drawEditor(ctx, visLines, state) {
  const { cursorVisible, phase } = state

  /* Background */
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, W, H)

  /* Title bar */
  drawTitleBar(ctx)

  /* Tab bar */
  drawTabBar(ctx)

  /* Sidebar */
  drawSidebar(ctx)

  /* Line numbers + code */
  drawCode(ctx, visLines, cursorVisible, phase)

  /* Status bar */
  drawStatusBar(ctx, phase)

  /* Minimap */
  drawMinimap(ctx, visLines)

  /* Scanlines overlay */
  ctx.fillStyle = 'rgba(0,0,0,0.02)'
  for (let y = 0; y < H; y += 3) {
    ctx.fillRect(0, y, W, 1)
  }
}

function drawTitleBar(ctx) {
  ctx.fillStyle = COLORS.titleBar
  ctx.fillRect(0, 0, W, 36)

  /* Traffic lights */
  const dots = ['#ef4444', '#f59e0b', '#22c55e']
  dots.forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(20 + i * 22, 18, 6, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill()
  })

  /* Title */
  ctx.fillStyle = '#94a3b8'
  ctx.font = '12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('developer.js — Visual Studio Code', W / 2, 22)
  ctx.textAlign = 'left'
}

function drawTabBar(ctx) {
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 36, W, 35)

  /* Active tab */
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 36, 200, 35)
  ctx.fillStyle = '#3b82f6'
  ctx.fillRect(0, 36, 200, 2)

  ctx.fillStyle = '#f1e05a'
  ctx.font = '11px monospace'
  ctx.fillText('JS', 14, 58)

  ctx.fillStyle = '#e2e8f0'
  ctx.font = '13px monospace'
  ctx.fillText('developer.js', 32, 58)

  ctx.fillStyle = '#64748b'
  ctx.fillText('×', 175, 58)

  /* Inactive tab */
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(200, 36, W - 200, 35)
  ctx.fillStyle = '#64748b'
  ctx.font = '11px monospace'
  ctx.fillText('<>', 214, 58)
  ctx.font = '13px monospace'
  ctx.fillText('package.json', 232, 58)
}

function drawSidebar(ctx) {
  ctx.fillStyle = COLORS.sidebarBg
  ctx.fillRect(0, 71, 220, H - 71 - 28)

  ctx.fillStyle = '#94a3b8'
  ctx.font = '11px monospace'
  ctx.fillText('EXPLORER', 16, 90)

  const items = [
    { name: 'portfolio', indent: 0, icon: '📁' },
    { name: 'src', indent: 1, icon: '📂' },
    { name: 'components', indent: 2, icon: '📂' },
    { name: 'Developer.jsx', indent: 3, icon: '📄', active: true },
    { name: 'Hero.jsx', indent: 3, icon: '📄' },
    { name: 'App.jsx', indent: 3, icon: '📄' },
    { name: 'styles', indent: 2, icon: '📂' },
    { name: 'globals.css', indent: 3, icon: '🎨' },
  ]

  items.forEach((item, i) => {
    const y = 106 + i * 22
    const x = 16 + item.indent * 14

    if (item.active) {
      ctx.fillStyle = 'rgba(59,130,246,0.1)'
      ctx.fillRect(0, y - 12, 220, 22)
      ctx.fillStyle = '#e2e8f0'
    } else {
      ctx.fillStyle = '#64748b'
    }

    ctx.font = '13px monospace'
    ctx.fillText(item.icon, x, y)
    ctx.fillText(item.name, x + 18, y)
  })
}

function drawCode(ctx, visLines, cursorVisible, phase) {
  const codeX = 280
  const lineNumX = 228
  const startY = 86
  const lineH = 22

  /* Line number background */
  ctx.fillStyle = COLORS.lineNumberBg
  ctx.fillRect(220, 71, 60, H - 71 - 28)

  /* Separator */
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(280, 71, 1, H - 71 - 28)

  ctx.font = '14px monospace'

  visLines.forEach((line, i) => {
    const y = startY + i * lineH

    if (y > H - 40) return

    /* Active line highlight */
    if (i === visLines.length - 1) {
      ctx.fillStyle = COLORS.activeLine
      ctx.fillRect(281, y - 14, W - 281 - 80, lineH)
    }

    /* Line number */
    ctx.fillStyle = COLORS.lineNumber
    ctx.textAlign = 'right'
    ctx.fillText(String(i + 1), lineNumX, y)
    ctx.textAlign = 'left'

    /* Tokenized code */
    const tokens = tokenizeLine(line)
    let x = codeX + 12
    for (const tok of tokens) {
      ctx.fillStyle = tok.color
      ctx.fillText(tok.text, x, y)
      x += ctx.measureText(tok.text).width
    }

    /* Blinking cursor */
    if (i === visLines.length - 1 && cursorVisible && phase === 'typing') {
      ctx.fillStyle = COLORS.cursor
      ctx.shadowColor = 'rgba(96,165,250,0.6)'
      ctx.shadowBlur = 6
      ctx.fillRect(x + 2, y - 12, 9, 18)
      ctx.shadowBlur = 0
    }
  })

  /* Status badge */
  const badgeY = H - 60
  const badgeText = phase === 'paused' ? '● Complete' : phase === 'clearing' ? '● Restarting...' : '● Typing...'
  const badgeColor = phase === 'paused' ? '#22c55e' : phase === 'clearing' ? '#f59e0b' : '#60a5fa'
  const badgeBg = phase === 'paused' ? 'rgba(34,197,94,0.12)' : phase === 'clearing' ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)'

  ctx.font = '12px monospace'
  const bw = ctx.measureText(badgeText).width + 24
  roundRect(ctx, W - 80 - bw, badgeY, bw, 26, 6)
  ctx.fillStyle = badgeBg
  ctx.fill()
  ctx.strokeStyle = badgeColor
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = badgeColor
  ctx.fillText(badgeText, W - 80 - bw + 12, badgeY + 17)
}

function drawStatusBar(ctx, phase) {
  ctx.fillStyle = COLORS.statusBar
  ctx.fillRect(0, H - 28, W, 28)

  ctx.fillStyle = '#ffffff'
  ctx.font = '12px monospace'
  ctx.fillText('⎇ main    ✓ 0    ⚠ 0', 12, H - 10)
  ctx.textAlign = 'right'
  ctx.fillText('UTF-8    JavaScript    Spaces: 4', W - 12, H - 10)
  ctx.textAlign = 'left'
}

function drawMinimap(ctx, visLines) {
  const mmX = W - 80
  const mmY = 71
  const mmW = 80
  const mmH = H - 71 - 28

  ctx.fillStyle = 'rgba(15,23,42,0.7)'
  ctx.fillRect(mmX, mmY, mmW, mmH)

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(mmX, mmY, 1, mmH)

  visLines.forEach((line, i) => {
    const y = mmY + 8 + i * 4
    if (y > mmY + mmH - 8) return
    const barW = Math.min(line.length * 1.2, mmW - 12)
    ctx.fillStyle = COLORS.minimapBar
    ctx.fillRect(mmX + 6, y, barW, 2)
  })

  /* Scroll indicator */
  const ratio = Math.min(1, visLines.length / CODE_LINES.length)
  ctx.fillStyle = 'rgba(59,130,246,0.25)'
  ctx.fillRect(mmX + mmW - 4, mmY, 3, mmH * ratio)
}
