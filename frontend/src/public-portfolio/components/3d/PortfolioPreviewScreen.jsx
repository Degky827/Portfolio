import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * PortfolioPreviewScreen
 *
 * Renders a miniature "video preview" of the portfolio website on the monitor:
 * navbar, hero copy, CTA buttons, a slowly rotating globe, a playback bar and
 * a row of section shortcuts. Drawn with Canvas2D and used as a texture.
 *
 * Virtual resolution: 1280×720
 */

const W = 1280
const H = 720

const C = {
  bg: '#07070f',
  nav: 'rgba(10,10,22,0.85)',
  text: '#f8fafc',
  muted: '#9aa3b5',
  accent: '#6366f1',
  accentSoft: '#818cf8',
  cyan: '#22d3ee',
  panel: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.08)',
  red: '#ef4444',
}

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

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = text.split(' ')
  let line = ''
  let lines = 0
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' '
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, y)
      line = words[i] + ' '
      y += lineHeight
      lines++
      if (lines >= maxLines) return
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, y)
}

function drawBackground(ctx) {
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, W, H)

  const g = ctx.createRadialGradient(W * 0.72, H * 0.42, 40, W * 0.72, H * 0.42, 520)
  g.addColorStop(0, 'rgba(99,102,241,0.28)')
  g.addColorStop(0.5, 'rgba(59,130,246,0.08)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = 'rgba(255,255,255,0.025)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 64) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let y = 0; y < H; y += 64) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }
}

function drawNavbar(ctx, name) {
  ctx.fillStyle = C.nav
  ctx.fillRect(0, 0, W, 64)
  ctx.fillStyle = C.border
  ctx.fillRect(0, 64, W, 1)

  const cx = 52
  const cy = 32
  const ring = ctx.createLinearGradient(cx - 18, cy - 18, cx + 18, cy + 18)
  ring.addColorStop(0, C.accent)
  ring.addColorStop(1, C.cyan)
  ctx.beginPath()
  ctx.arc(cx, cy, 20, 0, Math.PI * 2)
  ctx.fillStyle = ring
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy, 17, 0, Math.PI * 2)
  ctx.fillStyle = '#1e1b4b'
  ctx.fill()
  ctx.fillStyle = C.text
  ctx.font = 'bold 15px "Inter", "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(name.charAt(0).toUpperCase(), cx, cy + 5)
  ctx.textAlign = 'left'

  const links = ['HOME', 'ABOUT', 'SKILLS', 'PROJECTS', 'EXPERIENCE', 'CONTACT']
  ctx.font = 'bold 13px "Inter", "Segoe UI", sans-serif'
  let x = 430
  links.forEach((l, i) => {
    ctx.fillStyle = i === 0 ? C.accentSoft : C.text
    ctx.fillText(l, x, 37)
    const w = ctx.measureText(l).width
    if (i === 0) {
      ctx.fillStyle = C.accentSoft
      ctx.fillRect(x, 44, w, 2)
    }
    x += w + 30
  })

  ;[W - 90, W - 46].forEach((bx) => {
    roundRect(ctx, bx - 16, 16, 32, 32, 8)
    ctx.fillStyle = C.panel
    ctx.fill()
    ctx.strokeStyle = C.border
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(bx, 32, 6, 0, Math.PI * 2)
    ctx.strokeStyle = C.muted
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.lineWidth = 1
  })
}

function drawHeroCopy(ctx, name, badge, introduction) {
  const x = 96
  ctx.fillStyle = C.text
  ctx.font = '900 64px "Inter", "Segoe UI", sans-serif'
  ctx.fillText(name.toUpperCase(), x, 250)

  ctx.fillStyle = C.accentSoft
  ctx.font = 'bold 30px "Inter", "Segoe UI", sans-serif'
  ctx.fillText(badge, x, 298)

  ctx.fillStyle = C.muted
  ctx.font = '17px "Inter", "Segoe UI", sans-serif'
  wrapText(ctx, introduction, x, 342, 420, 26, 3)

  roundRect(ctx, x, 428, 176, 48, 12)
  ctx.fillStyle = C.accent
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px "Inter", "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('View Projects', x + 88, 458)

  roundRect(ctx, x + 196, 428, 176, 48, 12)
  ctx.fillStyle = C.panel
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.stroke()
  ctx.fillStyle = C.text
  ctx.fillText('Get In Touch', x + 196 + 88, 458)
  ctx.textAlign = 'left'
}

function drawGlobe(ctx, t) {
  const cx = W * 0.72
  const cy = 300
  const r = 170

  ctx.save()
  ctx.shadowColor = 'rgba(99,102,241,0.7)'
  ctx.shadowBlur = 70
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  const ocean = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.1, cx, cy, r)
  ocean.addColorStop(0, '#3b4bd8')
  ocean.addColorStop(0.55, '#141a5c')
  ocean.addColorStop(1, '#05061a')
  ctx.fillStyle = ocean
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()

  ctx.strokeStyle = 'rgba(129,140,248,0.28)'
  ctx.lineWidth = 1
  for (let i = -3; i <= 3; i++) {
    const y = cy + (i * r) / 3.6
    const hw = Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)))
    ctx.beginPath()
    ctx.ellipse(cx, y, hw, hw * 0.16, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  for (let i = 0; i < 8; i++) {
    const phase = (t * 0.25 + i / 8) % 1
    const rx = Math.abs(Math.cos(phase * Math.PI)) * r
    ctx.beginPath()
    ctx.ellipse(cx, cy, Math.max(0.5, rx), r, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  const dots = 90
  for (let i = 0; i < dots; i++) {
    const lat = ((i * 37) % 180 - 90) * (Math.PI / 180)
    const lon = ((i * 71) % 360) * (Math.PI / 180) + t * 0.5
    const px = Math.cos(lat) * Math.sin(lon)
    const pz = Math.cos(lat) * Math.cos(lon)
    if (pz < 0) continue
    const py = Math.sin(lat)
    const alpha = 0.35 + pz * 0.65
    ctx.fillStyle = i % 5 === 0 ? `rgba(34,211,238,${alpha})` : `rgba(253,224,71,${alpha * 0.9})`
    ctx.beginPath()
    ctx.arc(cx + px * r * 0.97, cy - py * r * 0.97, 1.6 + pz * 1.6, 0, Math.PI * 2)
    ctx.fill()
  }

  const shade = ctx.createRadialGradient(cx - r * 0.5, cy - r * 0.5, r * 0.2, cx, cy, r)
  shade.addColorStop(0, 'rgba(255,255,255,0.06)')
  shade.addColorStop(0.7, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.55)')
  ctx.fillStyle = shade
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
  ctx.restore()

  ctx.beginPath()
  ctx.arc(cx, cy, r + 1, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(129,140,248,0.55)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.lineWidth = 1

  const badges = [
    { a: -0.9, d: r + 78, glyph: 'code' },
    { a: 0.35, d: r + 70, glyph: 'mobile' },
    { a: 2.4, d: r + 72, glyph: 'cloud' },
  ]
  badges.forEach(({ a, d, glyph }) => {
    const bx = cx + Math.cos(a + t * 0.15) * d
    const by = cy + Math.sin(a + t * 0.15) * d * 0.6
    roundRect(ctx, bx - 18, by - 18, 36, 36, 10)
    ctx.fillStyle = 'rgba(15,15,35,0.9)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(129,140,248,0.6)'
    ctx.stroke()
    ctx.strokeStyle = C.text
    ctx.lineWidth = 2
    ctx.beginPath()
    if (glyph === 'code') {
      ctx.moveTo(bx - 8, by - 5); ctx.lineTo(bx - 12, by); ctx.lineTo(bx - 8, by + 5)
      ctx.moveTo(bx + 8, by - 5); ctx.lineTo(bx + 12, by); ctx.lineTo(bx + 8, by + 5)
      ctx.moveTo(bx + 3, by - 8); ctx.lineTo(bx - 3, by + 8)
    } else if (glyph === 'mobile') {
      ctx.rect(bx - 6, by - 10, 12, 20)
      ctx.moveTo(bx - 2, by + 7); ctx.lineTo(bx + 2, by + 7)
    } else {
      ctx.arc(bx - 4, by + 2, 6, Math.PI * 0.5, Math.PI * 1.5)
      ctx.arc(bx + 1, by - 3, 7, Math.PI, Math.PI * 2)
      ctx.arc(bx + 6, by + 2, 5, Math.PI * 1.5, Math.PI * 0.5)
      ctx.closePath()
    }
    ctx.stroke()
    ctx.lineWidth = 1
  })
}

function drawPlaybackBar(ctx, t) {
  const y = 560
  ctx.fillStyle = 'rgba(0,0,0,0.75)'
  ctx.fillRect(0, y - 26, W, 92)

  const progress = (t / 80) % 1
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.fillRect(0, y - 26, W, 4)
  ctx.fillStyle = C.red
  ctx.fillRect(0, y - 26, W * progress, 4)
  ctx.beginPath()
  ctx.arc(W * progress, y - 24, 7, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = C.text
  ctx.beginPath()
  ctx.moveTo(36, y + 4); ctx.lineTo(36, y + 32); ctx.lineTo(60, y + 18)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(84, y + 4); ctx.lineTo(84, y + 32); ctx.lineTo(104, y + 18)
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(106, y + 4, 4, 28)

  ctx.beginPath()
  ctx.moveTo(140, y + 12); ctx.lineTo(150, y + 12); ctx.lineTo(162, y + 2); ctx.lineTo(162, y + 34); ctx.lineTo(150, y + 24); ctx.lineTo(140, y + 24)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = C.text
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(162, y + 18, 10, -0.7, 0.7)
  ctx.stroke()

  const secs = Math.floor(progress * 80)
  const mm = String(Math.floor(secs / 60)).padStart(1, '0')
  const ss = String(secs % 60).padStart(2, '0')
  ctx.font = '600 15px "Inter", "Segoe UI", sans-serif'
  ctx.fillStyle = C.text
  ctx.fillText(`${mm}:${ss} / 1:20`, 196, y + 24)

  const rightIcons = [W - 180, W - 130, W - 82, W - 36]
  rightIcons.forEach((ix, i) => {
    ctx.strokeStyle = C.text
    ctx.lineWidth = 2
    ctx.beginPath()
    if (i === 0) {
      ctx.rect(ix - 12, y + 8, 18, 14)
      ctx.rect(ix + 2, y + 16, 10, 8)
    } else if (i === 1) {
      ctx.arc(ix, y + 18, 8, 0, Math.PI * 2)
      ctx.moveTo(ix, y + 6); ctx.lineTo(ix, y + 30)
      ctx.moveTo(ix - 12, y + 18); ctx.lineTo(ix + 12, y + 18)
    } else if (i === 2) {
      ctx.rect(ix - 12, y + 8, 24, 20)
    } else {
      ctx.moveTo(ix - 12, y + 12); ctx.lineTo(ix - 12, y + 6); ctx.lineTo(ix - 6, y + 6)
      ctx.moveTo(ix + 6, y + 6); ctx.lineTo(ix + 12, y + 6); ctx.lineTo(ix + 12, y + 12)
      ctx.moveTo(ix + 12, y + 24); ctx.lineTo(ix + 12, y + 30); ctx.lineTo(ix + 6, y + 30)
      ctx.moveTo(ix - 6, y + 30); ctx.lineTo(ix - 12, y + 30); ctx.lineTo(ix - 12, y + 24)
    }
    ctx.stroke()
  })
  ctx.lineWidth = 1
}

function drawSectionTabs(ctx) {
  const tabs = ['ABOUT', 'SKILLS', 'PROJECTS', 'EXPERIENCE', 'CONTACT']
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 626, W, H - 626)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 15px "Inter", "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  tabs.forEach((tab, i) => {
    ctx.fillText(tab, (W / (tabs.length + 1)) * (i + 1), 680)
  })
  ctx.textAlign = 'left'
}

function drawVignette(ctx) {
  const g = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.75)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,0.35)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}

function drawFrame(ctx, t, p) {
  ctx.clearRect(0, 0, W, H)
  drawBackground(ctx)
  drawGlobe(ctx, t)
  drawHeroCopy(ctx, p.name, p.badge, p.introduction)
  drawNavbar(ctx, p.name)
  drawPlaybackBar(ctx, t)
  drawSectionTabs(ctx)
  drawVignette(ctx)
}

export default function PortfolioPreviewScreen({ screenW, screenH, profileData }) {
  const name = profileData?.name || 'Desalegn'
  const badge = profileData?.badge || 'Fullstack Developer'
  const introduction =
    profileData?.introduction ||
    'I build scalable, high-performance web and mobile applications using modern technologies.'

  const propsRef = useRef({ name, badge, introduction })
  propsRef.current = { name, badge, introduction }

  const { canvas, texture } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = W
    cvs.height = H
    const tex = new THREE.CanvasTexture(cvs)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.colorSpace = THREE.SRGBColorSpace
    drawFrame(cvs.getContext('2d'), 0, propsRef.current)
    return { canvas: cvs, texture: tex }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => texture.dispose(), [texture])

  const lastDraw = useRef(0)
  useFrame(({ clock, invalidate }) => {
    const now = clock.getElapsedTime()
    if (now - lastDraw.current < 1 / 12) {
      invalidate()
      return
    }
    lastDraw.current = now
    drawFrame(canvas.getContext('2d'), now, propsRef.current)
    texture.needsUpdate = true
    invalidate()
  })

  return (
    <mesh position={[0, 0, 0.025]}>
      <planeGeometry args={[screenW, screenH]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}
