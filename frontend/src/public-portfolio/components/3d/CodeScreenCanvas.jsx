import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * CodeScreenCanvas
 *
 * Ultra-high-resolution (1920x1080) Visual Studio Code developer workspace texture:
 * - High pixel density eliminates any blurriness or distortion
 * - Large, legible, syntax-highlighted React code
 * - Crisp integrated Vite development terminal
 * - High anisotropy filtering for crystal-clear legibility at any viewing angle
 */

const W = 1920
const H = 1080

const C = {
  bg: '#0b0f17',
  editorBg: '#0d131c',
  activityBg: '#070b10',
  sidebarBg: '#101520',
  titleBarBg: '#131822',
  tabBarBg: '#0d131c',
  activeTabBg: '#141b27',
  terminalBg: '#080c12',
  statusBarBg: '#6C2BFF',
  statusBarText: '#ffffff',
  lineNum: '#4e5a73',
  activeLineBg: 'rgba(108, 43, 255, 0.12)',
  cursor: '#A855F7',
  border: 'rgba(255, 255, 255, 0.08)',
  text: '#e6edf3',
  keyword: '#ff7b72',      // import, const, return, export
  hook: '#d2a8ff',         // useState
  tag: '#7ee787',          // <div>, <Sidebar>, <h1>
  attr: '#79c0ff',         // className
  component: '#ffa657',    // App, Sidebar
  string: '#a5d6ff',       // "Desalegn", 'react'
  termGreen: '#3fb950',    // Local URL
  termCyan: '#58a6ff',     // Vite banner
  termMuted: '#8b949e',    // helper text
}

export default function CodeScreenCanvas({ screenW = 1.84, screenH = 1.04 }) {
  const { gl } = useThree()
  const canvasRef = useRef(null)
  const textureRef = useRef(null)
  const stateRef = useRef({
    cursorVisible: true,
    cursorBlink: 0,
    elapsed: 0,
  })

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    canvasRef.current = canvas

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = true
    // Enable max anisotropic filtering for sharp text at perspective angles
    const maxAnisotropy = gl?.capabilities?.getMaxAnisotropy?.() || 16
    texture.anisotropy = maxAnisotropy
    textureRef.current = texture

    // Initial render
    const ctx = canvas.getContext('2d')
    renderVSCode(ctx, true)
    texture.needsUpdate = true
  }, [gl])

  useFrame((state, delta) => {
    const s = stateRef.current
    s.cursorBlink += delta
    s.elapsed += delta

    let needRedraw = false
    if (s.cursorBlink >= 0.5) {
      s.cursorBlink = 0
      s.cursorVisible = !s.cursorVisible
      needRedraw = true
    }

    if (needRedraw && canvasRef.current && textureRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      renderVSCode(ctx, s.cursorVisible)
      textureRef.current.needsUpdate = true
    }
  })

  if (!textureRef.current) return null

  return (
    <mesh position={[0, 0, 0.008]}>
      <planeGeometry args={[screenW, screenH]} />
      <meshBasicMaterial
        map={textureRef.current}
        toneMapped={false}
      />
    </mesh>
  )
}

function renderVSCode(ctx, cursorVisible) {
  // Clear canvas
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, W, H)

  // ── 1. Top Window Title Bar (H = 54) ──
  ctx.fillStyle = C.titleBarBg
  ctx.fillRect(0, 0, W, 54)
  ctx.fillStyle = C.border
  ctx.fillRect(0, 53, W, 1)

  // Window traffic dots
  const dots = ['#ff5f56', '#ffbd2e', '#27c93f']
  dots.forEach((color, i) => {
    ctx.beginPath()
    ctx.arc(28 + i * 26, 27, 7, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })

  // Title text
  ctx.fillStyle = '#8b949e'
  ctx.font = '16px "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('App.jsx — Portfolio — Visual Studio Code', W / 2, 33)
  ctx.textAlign = 'left'

  // ── 2. Left Activity Bar (W = 64, H = H - 54 - 40) ──
  const actW = 64
  ctx.fillStyle = C.activityBg
  ctx.fillRect(0, 54, actW, H - 54 - 40)
  ctx.fillStyle = C.border
  ctx.fillRect(actW - 1, 54, 1, H - 54 - 40)

  // Active explorer indicator (purple line)
  ctx.fillStyle = C.statusBarBg
  ctx.fillRect(0, 62, 4, 52)

  // Activity icons
  drawIcon(ctx, 'files', 18, 72, '#ffffff', 1.4)
  drawIcon(ctx, 'search', 18, 140, '#8b949e', 1.4)
  drawIcon(ctx, 'git', 18, 208, '#8b949e', 1.4)
  drawIcon(ctx, 'debug', 18, 276, '#8b949e', 1.4)
  drawIcon(ctx, 'extensions', 18, 344, '#8b949e', 1.4)
  drawIcon(ctx, 'settings', 18, H - 40 - 60, '#8b949e', 1.4)

  // ── 3. Sidebar: Explorer (W = 280) ──
  const sbW = 280
  const sbX = actW
  ctx.fillStyle = C.sidebarBg
  ctx.fillRect(sbX, 54, sbW, H - 54 - 40)
  ctx.fillStyle = C.border
  ctx.fillRect(sbX + sbW - 1, 54, 1, H - 54 - 40)

  // Explorer header
  ctx.fillStyle = '#8b949e'
  ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('EXPLORER', sbX + 22, 84)

  // File tree
  const tree = [
    { name: '▼ src', isDir: true },
    { name: '  ▼ components', isDir: true },
    { name: '      ● App.jsx', active: true },
    { name: '        Hero.jsx' },
    { name: '        Projects.jsx' },
    { name: '        Contact.jsx' },
    { name: '  ▶ styles', isDir: true },
    { name: '    # index.css' },
    { name: '  { } package.json' },
    { name: '  ⚡ vite.config.js' },
  ]

  let treeY = 122
  tree.forEach((item) => {
    if (item.active) {
      ctx.fillStyle = 'rgba(108, 43, 255, 0.28)'
      ctx.fillRect(sbX, treeY - 22, sbW, 34)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 17px "Segoe UI", system-ui, sans-serif'
    } else {
      ctx.fillStyle = item.isDir ? '#8b949e' : '#c9d1d9'
      ctx.font = '17px "Segoe UI", system-ui, sans-serif'
    }
    ctx.fillText(item.name, sbX + 18, treeY)
    treeY += 36
  })

  // ── 4. Editor Area ──
  const edX = sbX + sbW
  const edW = W - edX
  const termH = 320
  const edH = H - 54 - 40 - termH

  // Tab bar
  ctx.fillStyle = C.tabBarBg
  ctx.fillRect(edX, 54, edW, 52)
  ctx.fillStyle = C.border
  ctx.fillRect(edX, 105, edW, 1)

  // Active tab (App.jsx)
  const tabW = 200
  ctx.fillStyle = C.activeTabBg
  ctx.fillRect(edX, 54, tabW, 51)
  ctx.fillStyle = C.statusBarBg
  ctx.fillRect(edX, 54, tabW, 3)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('● App.jsx', edX + 32, 86)

  // Editor background
  ctx.fillStyle = C.editorBg
  ctx.fillRect(edX, 106, edW, edH)

  // Code lines (Large, bold, high-contrast monospace)
  const codeLines = [
    [
      { t: 'import', c: C.keyword },
      { t: ' React, { ', c: C.text },
      { t: 'useState', c: C.hook },
      { t: ' } ', c: C.text },
      { t: 'from', c: C.keyword },
      { t: " 'react'", c: C.string },
      { t: ';', c: C.text },
    ],
    [],
    [
      { t: 'const', c: C.keyword },
      { t: ' App = () => {', c: C.text },
    ],
    [
      { t: '  const', c: C.keyword },
      { t: ' [name, setName] = ', c: C.text },
      { t: 'useState', c: C.hook },
      { t: '(', c: C.text },
      { t: '"Desalegn"', c: C.string },
      { t: ');', c: C.text },
    ],
    [],
    [
      { t: '  return', c: C.keyword },
      { t: ' (', c: C.text },
    ],
    [
      { t: '    <', c: C.text },
      { t: 'div', c: C.tag },
      { t: ' className', c: C.attr },
      { t: '=', c: C.text },
      { t: '"App"', c: C.string },
      { t: '>', c: C.text },
    ],
    [
      { t: '      <', c: C.text },
      { t: 'Sidebar', c: C.component },
      { t: ' />', c: C.text },
    ],
    [
      { t: '      <', c: C.text },
      { t: 'div', c: C.tag },
      { t: ' className', c: C.attr },
      { t: '=', c: C.text },
      { t: '"content"', c: C.string },
      { t: '>', c: C.text },
    ],
    [
      { t: '        <', c: C.text },
      { t: 'h1', c: C.tag },
      { t: '>Hello, Developer!</', c: C.text },
      { t: 'h1', c: C.tag },
      { t: '>', c: C.text },
    ],
    [
      { t: '        <', c: C.text },
      { t: 'p', c: C.tag },
      { t: '>Building clean & scalable apps</', c: C.text },
      { t: 'p', c: C.tag },
      { t: '>', c: C.text },
    ],
    [
      { t: '      </', c: C.text },
      { t: 'div', c: C.tag },
      { t: '>', c: C.text },
    ],
    [
      { t: '    </', c: C.text },
      { t: 'div', c: C.tag },
      { t: '>', c: C.text },
    ],
    [
      { t: '  );', c: C.text },
    ],
    [
      { t: '};', c: C.text },
    ],
    [],
    [
      { t: 'export default', c: C.keyword },
      { t: ' App;', c: C.text },
    ],
  ]

  const lineH = 31
  const startY = 142
  const lineNumW = 56

  codeLines.forEach((tokens, i) => {
    const y = startY + i * lineH

    // Line number
    ctx.fillStyle = C.lineNum
    ctx.font = 'bold 18px "Fira Code", "Cascadia Code", Consolas, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(String(i + 1), edX + lineNumW - 14, y)
    ctx.textAlign = 'left'

    // Active line background for line 4
    if (i === 3) {
      ctx.fillStyle = C.activeLineBg
      ctx.fillRect(edX + lineNumW, y - 22, edW - lineNumW, lineH)
    }

    // Code tokens
    let curX = edX + lineNumW + 16
    tokens.forEach((tok) => {
      ctx.fillStyle = tok.c
      ctx.font = 'bold 19px "Fira Code", "Cascadia Code", Consolas, monospace'
      ctx.fillText(tok.t, curX, y)
      curX += ctx.measureText(tok.t).width
    })

    // Cursor on line 4
    if (i === 3 && cursorVisible) {
      ctx.fillStyle = C.cursor
      ctx.fillRect(curX + 3, y - 21, 3, 26)
    }
  })

  // ── 5. Integrated Terminal Panel (H = termH) ──
  const termY = H - 40 - termH
  ctx.fillStyle = C.terminalBg
  ctx.fillRect(edX, termY, edW, termH)
  ctx.fillStyle = C.border
  ctx.fillRect(edX, termY, edW, 1)

  // Terminal header tabs
  ctx.fillStyle = '#8b949e'
  ctx.font = '16px "Segoe UI", system-ui, sans-serif'
  const termTabs = ['PROBLEMS  0', 'OUTPUT', 'DEBUG CONSOLE', 'TERMINAL']
  let tabX = edX + 28
  termTabs.forEach((tab) => {
    const isAct = tab === 'TERMINAL'
    if (isAct) {
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px "Segoe UI", system-ui, sans-serif'
      ctx.fillText(tab, tabX, termY + 30)
      ctx.fillStyle = C.statusBarBg
      ctx.fillRect(tabX, termY + 40, ctx.measureText(tab).width, 3)
      ctx.fillStyle = '#8b949e'
      ctx.font = '16px "Segoe UI", system-ui, sans-serif'
    } else {
      ctx.fillText(tab, tabX, termY + 30)
    }
    tabX += ctx.measureText(tab).width + 30
  })

  // Terminal output lines
  const termLines = [
    { text: '$ npm run dev', color: '#c9d1d9', bold: true },
    { text: '  VITE v5.4.21  ready in 420 ms', color: C.termCyan, bold: true },
    { text: '  ➜  Local:   http://localhost:5179/', color: C.termGreen, bold: true },
    { text: '  ➜  Network: use --host to expose', color: C.termMuted },
    { text: '  ➜  press h + enter to show help', color: C.termMuted },
  ]

  let tLineY = termY + 84
  termLines.forEach((tl) => {
    ctx.fillStyle = tl.color
    ctx.font = tl.bold
      ? 'bold 18px "Fira Code", "Cascadia Code", Consolas, monospace'
      : '17px "Fira Code", "Cascadia Code", Consolas, monospace'
    ctx.fillText(tl.text, edX + 28, tLineY)
    tLineY += 34
  })

  // ── 6. Bottom Purple Status Bar (H = 40) ──
  ctx.fillStyle = C.statusBarBg
  ctx.fillRect(0, H - 40, W, 40)
  ctx.fillStyle = C.statusBarText
  ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('main*  ✓ 0  ⚠ 0', 24, H - 14)

  ctx.textAlign = 'right'
  ctx.fillText('UTF-8   JavaScript JSX   Prettier', W - 24, H - 14)
  ctx.textAlign = 'left'
}

function drawIcon(ctx, name, x, y, color, scale = 1.0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (name === 'files') {
    ctx.strokeRect(0, 0, 14, 16)
    ctx.beginPath()
    ctx.moveTo(3, 4)
    ctx.lineTo(11, 4)
    ctx.moveTo(3, 8)
    ctx.lineTo(11, 8)
    ctx.stroke()
  } else if (name === 'search') {
    ctx.beginPath()
    ctx.arc(6, 6, 5, 0, Math.PI * 2)
    ctx.moveTo(10, 10)
    ctx.lineTo(15, 15)
    ctx.stroke()
  } else if (name === 'git') {
    ctx.beginPath()
    ctx.arc(8, 4, 2.5, 0, Math.PI * 2)
    ctx.arc(8, 13, 2.5, 0, Math.PI * 2)
    ctx.moveTo(8, 6.5)
    ctx.lineTo(8, 10.5)
    ctx.stroke()
  } else if (name === 'debug') {
    ctx.beginPath()
    ctx.arc(8, 8, 5, 0, Math.PI * 2)
    ctx.stroke()
  } else if (name === 'extensions') {
    ctx.strokeRect(0, 0, 6, 6)
    ctx.strokeRect(8, 0, 6, 6)
    ctx.strokeRect(0, 8, 6, 6)
  } else if (name === 'settings') {
    ctx.beginPath()
    ctx.arc(8, 8, 4, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()
}
