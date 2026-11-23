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
  bg: '#0a0d14',
  editorBg: '#0c1018',
  activityBg: '#07090f',
  sidebarBg: '#0f141f',
  titleBarBg: '#121722',
  tabBarBg: '#0c1018',
  activeTabBg: '#151c2a',
  statusBarBg: '#5B21B6',     // Deep royal purple/violet matching Target Reference Image
  statusBarText: '#ffffff',
  lineNum: '#4b5568',
  activeLineBg: 'rgba(0, 163, 255, 0.14)',
  cursor: '#00A3FF',
  border: 'rgba(255, 255, 255, 0.08)',
  text: '#e2e8f0',
  keyword: '#f43f5e',         // import, export, default, function, return (vibrant rose/coral)
  component: '#fbbf24',       // React, BrowserRouter, App (warm amber-yellow)
  tag: '#4ade80',             // <div>, <h1> (mint green)
  attr: '#38bdf8',            // className (sky cyan)
  string: '#93c5fd',          // 'react', "app" (pastel sky blue)
  white: '#ffffff',
}

export default function CodeScreenCanvas({ screenW = 1.72, screenH = 0.95 }) {
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

  // Window traffic dots (macOS style)
  const dots = ['#ff5f56', '#ffbd2e', '#27c93f']
  dots.forEach((color, i) => {
    ctx.beginPath()
    ctx.arc(28 + i * 26, 27, 7, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })

  // Title text
  ctx.fillStyle = '#94a3b8'
  ctx.font = '16px "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('App.jsx — Portfolio — Visual Studio Code', W / 2, 33)
  ctx.textAlign = 'left'

  // ── 2. Left Activity Bar (W = 64) ──
  const actW = 64
  ctx.fillStyle = C.activityBg
  ctx.fillRect(0, 54, actW, H - 54 - 42)
  ctx.fillStyle = C.border
  ctx.fillRect(actW - 1, 54, 1, H - 54 - 42)

  // Active indicator (cyan accent line)
  ctx.fillStyle = '#00A3FF'
  ctx.fillRect(0, 62, 4, 52)

  // Activity icons
  drawIcon(ctx, 'files', 18, 72, '#ffffff', 1.4)
  drawIcon(ctx, 'search', 18, 140, '#64748b', 1.4)
  drawIcon(ctx, 'git', 18, 208, '#64748b', 1.4)
  drawIcon(ctx, 'debug', 18, 276, '#64748b', 1.4)
  drawIcon(ctx, 'extensions', 18, 344, '#64748b', 1.4)
  drawIcon(ctx, 'settings', 18, H - 42 - 60, '#64748b', 1.4)

  // ── 3. Sidebar: Explorer (W = 310) ──
  const sbW = 310
  const sbX = actW
  ctx.fillStyle = C.sidebarBg
  ctx.fillRect(sbX, 54, sbW, H - 54 - 42)
  ctx.fillStyle = C.border
  ctx.fillRect(sbX + sbW - 1, 54, 1, H - 54 - 42)

  // Explorer header
  ctx.fillStyle = '#94a3b8'
  ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('EXPLORER', sbX + 22, 86)

  // File tree matching Target Reference Image
  const tree = [
    { name: '▼ src', isDir: true, indent: 0 },
    { name: '▶ components', isDir: true, indent: 1 },
    { name: '  pages', isDir: false, indent: 1 },
    { name: '  routes', isDir: false, indent: 1 },
    { name: '  assets', isDir: false, indent: 1 },
    { name: '  styles', isDir: false, indent: 1 },
    { name: '⚛ App.jsx', isDir: false, active: true, indent: 1 },
    { name: '⚛ main.jsx', isDir: false, indent: 1 },
  ]

  let treeY = 126
  tree.forEach((item) => {
    const xPos = sbX + 20 + item.indent * 18
    if (item.active) {
      ctx.fillStyle = 'rgba(0, 163, 255, 0.25)'
      ctx.fillRect(sbX, treeY - 24, sbW, 36)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px "Segoe UI", system-ui, sans-serif'
    } else {
      ctx.fillStyle = item.isDir ? '#94a3b8' : '#cbd5e1'
      ctx.font = '17px "Segoe UI", system-ui, sans-serif'
    }
    ctx.fillText(item.name, xPos, treeY)
    treeY += 38
  })

  // ── 4. Full-Height Code Editor Area (NO Terminal Panel matching Target Reference) ──
  const edX = sbX + sbW
  const edW = W - edX
  const edH = H - 54 - 42 // Full height down to status bar

  // Tab bar
  ctx.fillStyle = C.tabBarBg
  ctx.fillRect(edX, 54, edW, 52)
  ctx.fillStyle = C.border
  ctx.fillRect(edX, 105, edW, 1)

  // Active tab (App.jsx)
  const tabW = 220
  ctx.fillStyle = C.activeTabBg
  ctx.fillRect(edX, 54, tabW, 51)
  ctx.fillStyle = '#00A3FF'
  ctx.fillRect(edX, 54, tabW, 3) // Glowing cyan top tab border
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 17px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('⚛  App.jsx', edX + 32, 86)
  ctx.fillStyle = '#94a3b8'
  ctx.font = '15px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('✕', edX + tabW - 28, 85)

  // Editor background
  ctx.fillStyle = C.editorBg
  ctx.fillRect(edX, 106, edW, edH)

  // Code lines matching Target Reference Image
  const codeLines = [
    [
      { t: 'import', c: C.keyword },
      { t: ' React ', c: C.component },
      { t: 'from', c: C.keyword },
      { t: " 'react'", c: C.string },
      { t: ';', c: C.text },
    ],
    [
      { t: 'import', c: C.keyword },
      { t: ' { ', c: C.text },
      { t: 'BrowserRouter', c: C.component },
      { t: ' } ', c: C.text },
      { t: 'from', c: C.keyword },
      { t: " 'react-router-dom'", c: C.string },
      { t: ';', c: C.text },
    ],
    [],
    [
      { t: 'export', c: C.keyword },
      { t: ' default', c: C.keyword },
      { t: ' function', c: C.keyword },
      { t: ' App', c: C.component },
      { t: '() {', c: C.text },
    ],
    [
      { t: '  return', c: C.keyword },
      { t: ' (', c: C.text },
    ],
    [
      { t: '    <', c: C.text },
      { t: 'BrowserRouter', c: C.tag },
      { t: '>', c: C.text },
    ],
    [
      { t: '      <', c: C.text },
      { t: 'div', c: C.tag },
      { t: ' className', c: C.attr },
      { t: '=', c: C.text },
      { t: '"app"', c: C.string },
      { t: '>', c: C.text },
    ],
    [
      { t: '        <', c: C.text },
      { t: 'h1', c: C.tag },
      { t: '>', c: C.text },
      { t: 'Welcome to My Portfolio', c: C.white },
      { t: '</', c: C.text },
      { t: 'h1', c: C.tag },
      { t: '>', c: C.text },
    ],
    [
      { t: '      </', c: C.text },
      { t: 'div', c: C.tag },
      { t: '>', c: C.text },
    ],
    [
      { t: '    </', c: C.text },
      { t: 'BrowserRouter', c: C.tag },
      { t: '>', c: C.text },
    ],
    [
      { t: '  );', c: C.text },
    ],
    [
      { t: '};', c: C.text },
    ],
    [],
    [],
    [],
    [],
    [],
    [],
  ]

  // Large, spacious code layout across full height
  const lineH = 46
  const startY = 160
  const lineNumW = 68

  // Draw 18 clean line numbers
  for (let ln = 1; ln <= 18; ln++) {
    const y = startY + (ln - 1) * lineH
    ctx.fillStyle = C.lineNum
    ctx.font = 'bold 22px "Fira Code", "Cascadia Code", Consolas, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(String(ln), edX + lineNumW - 16, y)
    ctx.textAlign = 'left'
  }

  codeLines.forEach((tokens, i) => {
    const y = startY + i * lineH

    // Active line highlight for line 4
    if (i === 3) {
      ctx.fillStyle = C.activeLineBg
      ctx.fillRect(edX + lineNumW, y - 30, edW - lineNumW, lineH)
    }

    // Code tokens
    let curX = edX + lineNumW + 20
    tokens.forEach((tok) => {
      ctx.fillStyle = tok.c
      ctx.font = 'bold 24px "Fira Code", "Cascadia Code", Consolas, monospace'
      ctx.fillText(tok.t, curX, y)
      curX += ctx.measureText(tok.t).width
    })

    // Blinking cursor on line 4
    if (i === 3 && cursorVisible) {
      ctx.fillStyle = C.cursor
      ctx.fillRect(curX + 4, y - 28, 4, 34)
    }
  })

  // ── 5. Bottom Deep Purple Status Bar (H = 42) matching Target Reference ──
  ctx.fillStyle = C.statusBarBg
  ctx.fillRect(0, H - 42, W, 42)
  ctx.fillStyle = C.statusBarText
  ctx.font = 'bold 17px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('{ }  main*   ✓ 0   ⚠ 0', 24, H - 15)

  ctx.textAlign = 'right'
  ctx.fillText('Ln 8, Col 32   Spaces: 2   UTF-8   LF   React', W - 28, H - 15)
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
