import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * MonitorScreen
 *
 * Realistic VS Code dark theme screen rendered as a canvas texture.
 * Features: sidebar, tabs, code editor, status bar, build badge,
 * blinking cursor, auto-scrolling code, and glass glow effect.
 */

const VSCODE_COLORS = {
  bg: '#1e1e1e',
  sidebar: '#252526',
  activityBar: '#333333',
  titleBar: '#3c3c3c',
  editor: '#1e1e1e',
  tabActive: '#1e1e1e',
  tabInactive: '#2d2d2d',
  tabBorder: '#252526',
  statusBar: '#007acc',
  lineNumber: '#858585',
  cursor: '#aeafad',
  selection: '#264f78',
  scrollBar: '#424242',
  border: '#3c3c3c',
  text: '#d4d4d4',
  textDim: '#808080',
  accent: '#007acc',
  green: '#4ec9b0',
  blue: '#569cd6',
  purple: '#c586c0',
  yellow: '#dcdcaa',
  orange: '#ce9178',
  red: '#f44747',
  cyan: '#9cdcfe',
  white: '#d4d4d4',
}

const SAMPLE_CODE = [
  { text: 'import', color: VSCODE_COLORS.purple },
  { text: ' React', color: VSCODE_COLORS.white },
  { text: ' from', color: VSCODE_COLORS.purple },
  { text: " 'react'", color: VSCODE_COLORS.orange },
  { text: ';', color: VSCODE_COLORS.white },
  { text: '\n', color: '' },
  { text: 'import', color: VSCODE_COLORS.purple },
  { text: ' { Canvas }', color: VSCODE_COLORS.white },
  { text: ' from', color: VSCODE_COLORS.purple },
  { text: " '@react-three/fiber'", color: VSCODE_COLORS.orange },
  { text: ';', color: VSCODE_COLORS.white },
  { text: '\n', color: '' },
  { text: 'import', color: VSCODE_COLORS.purple },
  { text: ' { OrbitControls, Float }', color: VSCODE_COLORS.white },
  { text: ' from', color: VSCODE_COLORS.purple },
  { text: " '@react-three/drei'", color: VSCODE_COLORS.orange },
  { text: ';', color: VSCODE_COLORS.white },
  { text: '\n\n', color: '' },
  { text: 'export default function', color: VSCODE_COLORS.blue },
  { text: ' WorkspaceScene', color: VSCODE_COLORS.yellow },
  { text: '() {', color: VSCODE_COLORS.white },
  { text: '\n  ', color: '' },
  { text: 'return', color: VSCODE_COLORS.purple },
  { text: ' (', color: VSCODE_COLORS.white },
  { text: '\n    <', color: VSCODE_COLORS.white },
  { text: 'Canvas', color: VSCODE_COLORS.green },
  { text: '\n      ', color: '' },
  { text: 'camera', color: VSCODE_COLORS.cyan },
  { text: '={{ ', color: VSCODE_COLORS.white },
  { text: 'position', color: VSCODE_COLORS.cyan },
  { text: ': [', color: VSCODE_COLORS.white },
  { text: '0', color: VSCODE_COLORS.yellow },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '2', color: VSCODE_COLORS.yellow },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '5', color: VSCODE_COLORS.yellow },
  { text: '] }}', color: VSCODE_COLORS.white },
  { text: '\n      ', color: '' },
  { text: 'shadows', color: VSCODE_COLORS.cyan },
  { text: '\n    >', color: VSCODE_COLORS.white },
  { text: '\n      <', color: VSCODE_COLORS.white },
  { text: 'color', color: VSCODE_COLORS.green },
  { text: ' ', color: '' },
  { text: 'attach', color: VSCODE_COLORS.cyan },
  { text: '=', color: VSCODE_COLORS.white },
  { text: '"background"', color: VSCODE_COLORS.orange },
  { text: ' ', color: '' },
  { text: 'args', color: VSCODE_COLORS.cyan },
  { text: '={[', color: VSCODE_COLORS.white },
  { text: "'#0a0a1a'", color: VSCODE_COLORS.orange },
  { text: ']}', color: VSCODE_COLORS.white },
  { text: ' />', color: VSCODE_COLORS.white },
  { text: '\n      <', color: VSCODE_COLORS.white },
  { text: 'fog', color: VSCODE_COLORS.green },
  { text: ' ', color: '' },
  { text: 'attach', color: VSCODE_COLORS.cyan },
  { text: '=', color: VSCODE_COLORS.white },
  { text: '"fog"', color: VSCODE_COLORS.orange },
  { text: ' ', color: '' },
  { text: 'args', color: VSCODE_COLORS.cyan },
  { text: '={[', color: VSCODE_COLORS.white },
  { text: "'#0a0a1a'", color: VSCODE_COLORS.orange },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '6', color: VSCODE_COLORS.yellow },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '18', color: VSCODE_COLORS.yellow },
  { text: ']}', color: VSCODE_COLORS.white },
  { text: ' />', color: VSCODE_COLORS.white },
  { text: '\n      <', color: VSCODE_COLORS.white },
  { text: 'Desk', color: VSCODE_COLORS.green },
  { text: ' ', color: '' },
  { text: 'position', color: VSCODE_COLORS.cyan },
  { text: '={[', color: VSCODE_COLORS.white },
  { text: '0', color: VSCODE_COLORS.yellow },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '0', color: VSCODE_COLORS.yellow },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '0', color: VSCODE_COLORS.yellow },
  { text: ']}', color: VSCODE_COLORS.white },
  { text: ' />', color: VSCODE_COLORS.white },
  { text: '\n      <', color: VSCODE_COLORS.white },
  { text: 'Monitor', color: VSCODE_COLORS.green },
  { text: ' ', color: '' },
  { text: 'position', color: VSCODE_COLORS.cyan },
  { text: '={[', color: VSCODE_COLORS.white },
  { text: '0', color: VSCODE_COLORS.yellow },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '0', color: VSCODE_COLORS.yellow },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '-0.3', color: VSCODE_COLORS.yellow },
  { text: ']}', color: VSCODE_COLORS.white },
  { text: ' />', color: VSCODE_COLORS.white },
  { text: '\n      <', color: VSCODE_COLORS.white },
  { text: 'Keyboard', color: VSCODE_COLORS.green },
  { text: ' ', color: '' },
  { text: 'position', color: VSCODE_COLORS.cyan },
  { text: '={[', color: VSCODE_COLORS.white },
  { text: '0', color: VSCODE_COLORS.yellow },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '0', color: VSCODE_COLORS.yellow },
  { text: ', ', color: VSCODE_COLORS.white },
  { text: '0.25', color: VSCODE_COLORS.yellow },
  { text: ']}', color: VSCODE_COLORS.white },
  { text: ' />', color: VSCODE_COLORS.white },
  { text: '\n    </', color: VSCODE_COLORS.white },
  { text: 'Canvas', color: VSCODE_COLORS.green },
  { text: '>', color: VSCODE_COLORS.white },
  { text: '\n  );', color: VSCODE_COLORS.white },
  { text: '\n}', color: VSCODE_COLORS.white },
]

const FILE_EXPLORER = [
  { name: 'src/', indent: 0, isDir: true, isOpen: true },
  { name: 'components/', indent: 1, isDir: true, isOpen: true },
  { name: '3d/', indent: 2, isDir: true, isOpen: true },
  { name: 'Desk.jsx', indent: 3, isDir: false, icon: '⚛' },
  { name: 'Monitor.jsx', indent: 3, isDir: false, icon: '⚛' },
  { name: 'Keyboard.jsx', indent: 3, isDir: false, icon: '⚛' },
  { name: 'PC.jsx', indent: 3, isDir: false, icon: '⚛' },
  { name: 'Speaker.jsx', indent: 3, isDir: false, icon: '⚛' },
  { name: 'WorkspaceScene.jsx', indent: 3, isDir: false, icon: '⚛', active: true },
  { name: 'hooks/', indent: 2, isDir: true, isOpen: false },
  { name: 'scenes/', indent: 2, isDir: true, isOpen: false },
  { name: 'layout/', indent: 1, isDir: true, isOpen: false },
  { name: 'pages/', indent: 1, isDir: true, isOpen: false },
  { name: 'public/', indent: 0, isDir: true, isOpen: false },
  { name: 'package.json', indent: 0, isDir: false },
  { name: 'vite.config.js', indent: 0, isDir: false },
]

const TABS = [
  { name: 'WorkspaceScene.jsx', active: true, modified: false },
  { name: 'Monitor.jsx', active: false, modified: true },
  { name: 'Desk.jsx', active: false, modified: false },
]

export default function MonitorScreen() {
  const canvasRef = useRef(null)
  const textureRef = useRef(null)
  const scrollOffset = useRef(0)
  const cursorBlink = useRef(true)
  const [tick, setTick] = useState(0)

  const width = 1024
  const height = 640

  const drawScreen = useMemo(() => {
    return (ctx, time) => {
      const w = width
      const h = height
      const scale = 1

      ctx.clearRect(0, 0, w, h)

      // === ACTIVITY BAR (left-most) ===
      ctx.fillStyle = VSCODE_COLORS.activityBar
      ctx.fillRect(0, 0, 32 * scale, h)

      // Activity bar icons
      const icons = ['☰', '🔍', '⑂', '▶', '⊞']
      ctx.font = `${14 * scale}px sans-serif`
      ctx.textAlign = 'center'
      icons.forEach((icon, i) => {
        const y = 40 + i * 48
        if (i === 0) {
          ctx.fillStyle = VSCODE_COLORS.white
          ctx.fillRect(0, (y - 18) * scale, 2 * scale, 36 * scale)
        }
        ctx.fillStyle = i === 0 ? VSCODE_COLORS.white : VSCODE_COLORS.textDim
        ctx.fillText(icon, 16 * scale, y * scale)
      })

      // === SIDEBAR ===
      const sidebarX = 32 * scale
      const sidebarW = 180 * scale
      ctx.fillStyle = VSCODE_COLORS.sidebar
      ctx.fillRect(sidebarX, 0, sidebarW, h)

      // Sidebar header
      ctx.fillStyle = VSCODE_COLORS.textDim
      ctx.font = `bold ${11 * scale}px monospace`
      ctx.textAlign = 'left'
      ctx.fillText('EXPLORER', sidebarX + 10 * scale, 20 * scale)

      // File tree
      ctx.font = `${11 * scale}px monospace`
      FILE_EXPLORER.forEach((item, i) => {
        const y = 40 + i * 20
        const x = sidebarX + 10 + item.indent * 14
        const isAbove = y < 0 || y > h / scale
        if (isAbove) return

        if (item.active) {
          ctx.fillStyle = VSCODE_COLORS.selection
          ctx.fillRect(sidebarX, (y - 12) * scale, sidebarW, 18 * scale)
        }

        ctx.fillStyle = item.active ? VSCODE_COLORS.white : VSCODE_COLORS.text
        ctx.textAlign = 'left'

        let prefix = ''
        if (item.isDir) {
          prefix = item.isOpen ? '▾ ' : '▸ '
        } else {
          prefix = '  '
        }

        ctx.fillText(prefix + (item.name || ''), x * scale, y * scale)
      })

      // Sidebar resize border
      ctx.fillStyle = VSCODE_COLORS.border
      ctx.fillRect(sidebarX + sidebarW - 1, 0, 1, h)

      // === EDITOR AREA ===
      const editorX = (32 + 180) * scale
      const editorW = w - editorX
      const titleBarH = 30 * scale
      const tabBarH = 32 * scale
      const statusBarH = 22 * scale
      const editorH = h - titleBarH - tabBarH - statusBarH

      // Title bar
      ctx.fillStyle = VSCODE_COLORS.titleBar
      ctx.fillRect(editorX, 0, editorW, titleBarH)

      // Window controls (dots)
      const dotColors = ['#f44747', '#dcdcaa', '#4ec9b0']
      dotColors.forEach((color, i) => {
        ctx.beginPath()
        ctx.arc(editorX + 14 + i * 18, titleBarH / 2, 5, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })

      // Tab bar
      ctx.fillStyle = VSCODE_COLORS.tabInactive
      ctx.fillRect(editorX, titleBarH, editorW, tabBarH)

      let tabX = editorX
      TABS.forEach((tab) => {
        const tabW = tab.name.length * 7 + 40
        ctx.fillStyle = tab.active ? VSCODE_COLORS.tabActive : VSCODE_COLORS.tabInactive
        ctx.fillRect(tabX, titleBarH, tabW, tabBarH)

        // Tab text
        ctx.fillStyle = tab.active ? VSCODE_COLORS.white : VSCODE_COLORS.textDim
        ctx.font = `${11 * scale}px monospace`
        ctx.textAlign = 'left'
        ctx.fillText(
          (tab.modified ? '● ' : '') + tab.name,
          tabX + 12,
          titleBarH + 20
        )

        // Active tab bottom border
        if (tab.active) {
          ctx.fillStyle = VSCODE_COLORS.accent
          ctx.fillRect(tabX, titleBarH + tabBarH - 2, tabW, 2)
        }

        // Tab separator
        ctx.fillStyle = VSCODE_COLORS.border
        ctx.fillRect(tabX + tabW - 1, titleBarH, 1, tabBarH)

        tabX += tabW
      })

      // Editor background
      ctx.fillStyle = VSCODE_COLORS.editor
      ctx.fillRect(editorX, titleBarH + tabBarH, editorW, editorH)

      // === CODE EDITOR ===
      const codeStartY = titleBarH + tabBarH + 8
      const lineHeight = 18
      const gutterW = 45 * scale
      const codeX = editorX + gutterW + 10

      // Auto scroll animation
      scrollOffset.current = (time * 0.3) % (SAMPLE_CODE.length * lineHeight)

      // Line numbers
      ctx.font = `${11 * scale}px monospace`
      ctx.textAlign = 'right'
      const totalLines = 35
      for (let i = 0; i < totalLines; i++) {
        const lineY = codeStartY + i * lineHeight - scrollOffset.current % lineHeight
        if (lineY < titleBarH + tabBarH || lineY > h - statusBarH) continue

        ctx.fillStyle = VSCODE_COLORS.lineNumber
        ctx.fillText(String(i + 1), editorX + gutterW - 5, lineY + 10)
      }

      // Code content
      ctx.textAlign = 'left'
      let charX = codeX
      let lineY = codeStartY - scrollOffset.current % lineHeight
      let lineNum = 0

      // Draw code with syntax highlighting
      const drawLine = (lineTokens, y) => {
        let x = codeX
        lineTokens.forEach((token) => {
          if (token.text === '\n') return
          ctx.fillStyle = token.color || VSCODE_COLORS.text
          ctx.fillText(token.text, x, y + 10)
          x += ctx.measureText(token.text).width
        })
      }

      // Group tokens by line
      let currentLine = []
      let lineIdx = 0
      for (const token of SAMPLE_CODE) {
        if (token.text === '\n') {
          const y = codeStartY + lineIdx * lineHeight - scrollOffset.current % lineHeight
          if (y > titleBarH + tabBarH && y < h - statusBarH) {
            drawLine(currentLine, y)
          }
          currentLine = []
          lineIdx++
          if (lineIdx > totalLines) break
        } else {
          currentLine.push(token)
        }
      }
      if (currentLine.length > 0 && lineIdx <= totalLines) {
        const y = codeStartY + lineIdx * lineHeight - scrollOffset.current % lineHeight
        if (y > titleBarH + tabBarH && y < h - statusBarH) {
          drawLine(currentLine, y)
        }
      }

      // === BLINKING CURSOR ===
      cursorBlink.current = Math.sin(time * 3) > 0
      if (cursorBlink.current) {
        const cursorLineY = codeStartY + 8 * lineHeight - scrollOffset.current % lineHeight
        if (cursorLineY > titleBarH + tabBarH && cursorLineY < h - statusBarH) {
          ctx.fillStyle = VSCODE_COLORS.cursor
          ctx.fillRect(codeX + 120, cursorLineY, 2, lineHeight - 4)
        }
      }

      // === SCROLLBAR ===
      ctx.fillStyle = VSCODE_COLORS.scrollBar
      ctx.fillRect(w - 10 * scale, titleBarH + tabBarH, 6 * scale, editorH)
      const scrollThumbH = 40 * scale
      const scrollPos = ((time * 20) % (editorH - scrollThumbH))
      ctx.fillStyle = '#666'
      ctx.fillRect(w - 10 * scale, titleBarH + tabBarH + scrollPos, 6 * scale, scrollThumbH)

      // === STATUS BAR ===
      ctx.fillStyle = VSCODE_COLORS.statusBar
      ctx.fillRect(0, h - statusBarH, w, statusBarH)

      // Status bar items
      ctx.font = `${10 * scale}px monospace`
      ctx.textAlign = 'left'
      ctx.fillStyle = VSCODE_COLORS.white

      // Left items
      const branchIcon = '⑂ '
      ctx.fillText(branchIcon + 'main', 8, h - statusBarH + 15)
      ctx.fillText('✓ 0  ⚠ 0', 110, h - statusBarH + 15)
      ctx.fillText('● Prettier', 190, h - statusBarH + 15)

      // Right items
      ctx.textAlign = 'right'
      ctx.fillText('Ln 35, Col 1', w - 200, h - statusBarH + 15)
      ctx.fillText('Spaces: 2', w - 120, h - statusBarH + 15)
      ctx.fillText('UTF-8', w - 65, h - statusBarH + 15)
      ctx.fillText('JavaScript JSX', w - 8, h - statusBarH + 15)

      // === BUILD SUCCESS BADGE ===
      const badgeX = editorX + editorW - 160
      const badgeY = titleBarH + tabBarH + 10
      const badgeW = 150
      const badgeH = 28

      // Badge background with glass effect
      ctx.fillStyle = 'rgba(78, 201, 176, 0.15)'
      ctx.strokeStyle = 'rgba(78, 201, 176, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6)
      ctx.fill()
      ctx.stroke()

      // Badge text
      ctx.fillStyle = '#4ec9b0'
      ctx.font = `bold ${11 * scale}px monospace`
      ctx.textAlign = 'left'
      ctx.fillText('✓ Build Success', badgeX + 10, badgeY + 18)

      // Timestamp
      ctx.fillStyle = 'rgba(78, 201, 176, 0.6)'
      ctx.font = `${9 * scale}px monospace`
      ctx.fillText('2.3s', badgeX + badgeW - 28, badgeY + 18)

      // === MINIMAP ===
      const minimapW = 60 * scale
      const minimapX = w - minimapW - 12 * scale
      ctx.fillStyle = 'rgba(30, 30, 30, 0.8)'
      ctx.fillRect(minimapX, titleBarH + tabBarH, minimapW, editorH)

      // Minimap code representation
      for (let i = 0; i < 80; i++) {
        const y = titleBarH + tabBarH + 4 + i * 3
        if (y > h - statusBarH - 4) break
        const lineW = 10 + Math.random() * 40
        ctx.fillStyle = `rgba(100, 100, 140, ${0.2 + Math.random() * 0.3})`
        ctx.fillRect(minimapX + 4, y, lineW, 2)
      }

      // Minimap viewport indicator
      ctx.fillStyle = 'rgba(100, 100, 140, 0.15)'
      ctx.fillRect(minimapX, titleBarH + tabBarH + 20, minimapW, 60)

      return ctx.getImageData(0, 0, w, h)
    }
  }, [])

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    textureRef.current = texture

    let animId
    const animate = (time) => {
      drawScreen(ctx, time / 1000)
      texture.needsUpdate = true
      setTick((t) => t + 1)
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      texture.dispose()
    }
  }, [drawScreen])

  return (
    <mesh position={[0, 1.35, 0.015]}>
      <planeGeometry args={[2.35, 1.32]} />
      <meshBasicMaterial map={textureRef.current} toneMapped={false} />
    </mesh>
  )
}
