import { useRef, useEffect, useMemo, useCallback, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * PortfolioDashboardScreen
 *
 * A modern developer dashboard rendered via Canvas2D on the monitor.
 * Shows: profile photo, name, title, stats, skills, social links, CTA buttons.
 * Styled like a modern OS / developer workspace.
 *
 * Virtual resolution: 1280×720
 */

const W = 1280
const H = 720

const COLORS = {
  bg: '#0c0c1d',
  sidebarBg: '#10102a',
  sidebarActive: 'rgba(99,102,241,0.15)',
  cardBg: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.08)',
  titleBar: '#12122a',
  statusBar: '#6366f1',
  text: '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  accent: '#6366f1',
  cyan: '#22d3ee',
  green: '#4ec9b0',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  pink: '#ec4899',
  skillBar: '#6366f1',
  skillBarBg: 'rgba(255,255,255,0.06)',
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

function drawTitleBar(ctx) {
  ctx.fillStyle = COLORS.titleBar
  ctx.fillRect(0, 0, W, 38)

  const dots = ['#ef4444', '#f59e0b', '#22c55e']
  dots.forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(20 + i * 22, 19, 6, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill()
  })

  ctx.fillStyle = COLORS.textSecondary
  ctx.font = '12px "Inter", "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Developer Dashboard', W / 2, 23)
  ctx.textAlign = 'left'
}

function drawSidebar(ctx, profilePhotoLoaded) {
  ctx.fillStyle = COLORS.sidebarBg
  ctx.fillRect(0, 38, 60, H - 38 - 28)

  const icons = [
    { emoji: '🏠', y: 68, active: true },
    { emoji: '👤', y: 118 },
    { emoji: '📊', y: 168 },
    { emoji: '💼', y: 218 },
    { emoji: '⚙️', y: 268 },
  ]

  icons.forEach(({ emoji, y, active }) => {
    if (active) {
      roundRect(ctx, 6, y - 16, 48, 32, 8)
      ctx.fillStyle = COLORS.sidebarActive
      ctx.fill()
    }
    ctx.font = '18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(emoji, 30, y + 6)
    ctx.textAlign = 'left'
  })
}

function drawProfileSection(ctx, profilePhotoUrl, name, badge) {
  const startX = 80
  const startY = 58

  // Profile photo circle
  const photoX = startX + 30
  const photoY = startY + 45
  const photoR = 38

  // Gradient ring
  const gradient = ctx.createLinearGradient(photoX - photoR, photoY - photoR, photoX + photoR, photoY + photoR)
  gradient.addColorStop(0, '#6366f1')
  gradient.addColorStop(0.5, '#22d3ee')
  gradient.addColorStop(1, '#8b5cf6')

  ctx.beginPath()
  ctx.arc(photoX, photoY, photoR + 3, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Photo background
  ctx.beginPath()
  ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a3e'
  ctx.fill()

  // Initials if no photo
  ctx.fillStyle = COLORS.accent
  ctx.font = 'bold 28px "Inter", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('DA', photoX, photoY + 10)
  ctx.textAlign = 'left'

  // Online indicator
  ctx.beginPath()
  ctx.arc(photoX + photoR - 4, photoY + photoR - 4, 8, 0, Math.PI * 2)
  ctx.fillStyle = COLORS.green
  ctx.fill()
  ctx.beginPath()
  ctx.arc(photoX + photoR - 4, photoY + photoR - 4, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#0c0c1d'
  ctx.fill()

  // Name
  const textX = startX + 90
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px "Inter", "Segoe UI", sans-serif'
  ctx.fillText(name || 'Desalegn Abreha', textX, startY + 32)

  // Title
  ctx.fillStyle = COLORS.accent
  ctx.font = '600 15px "Inter", sans-serif'
  ctx.fillText('Full Stack Developer', textX, startY + 54)

  // Subtitle
  ctx.fillStyle = COLORS.textMuted
  ctx.font = '13px "Inter", sans-serif'
  ctx.fillText('Software Engineering Student', textX, startY + 74)

  // Status badge
  const badgeX = textX
  const badgeY = startY + 88
  roundRect(ctx, badgeX, badgeY, 140, 22, 11)
  ctx.fillStyle = 'rgba(78,201,176,0.12)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(78,201,176,0.3)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(badgeX + 12, badgeY + 11, 4, 0, Math.PI * 2)
  ctx.fillStyle = COLORS.green
  ctx.fill()

  ctx.fillStyle = COLORS.green
  ctx.font = '600 11px "JetBrains Mono", monospace'
  ctx.fillText('Available for hire', badgeX + 22, badgeY + 15)
}

function drawStatsCards(ctx, stats) {
  const startX = 80
  const y = 195
  const cardW = 155
  const cardH = 72
  const gap = 16

  const defaultStats = [
    { label: 'CERTIFICATIONS', value: '3+', color: COLORS.accent },
    { label: 'PROJECTS', value: '15+', color: COLORS.green },
    { label: 'TECHNOLOGIES', value: '30+', color: COLORS.orange },
    { label: 'CLIENTS', value: '10+', color: COLORS.pink },
  ]

  const s = stats?.length > 0 ? stats : defaultStats

  s.slice(0, 4).forEach((stat, i) => {
    const x = startX + i * (cardW + gap)

    roundRect(ctx, x, y, cardW, cardH, 10)
    ctx.fillStyle = COLORS.cardBg
    ctx.fill()
    ctx.strokeStyle = COLORS.cardBorder
    ctx.lineWidth = 1
    ctx.stroke()

    // Color accent bar
    roundRect(ctx, x, y, 4, cardH, 2)
    ctx.fillStyle = stat.color || COLORS.accent
    ctx.fill()

    // Value
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 26px "Inter", sans-serif'
    ctx.fillText(stat.value || '0', x + 16, y + 36)

    // Label
    ctx.fillStyle = COLORS.textMuted
    ctx.font = '600 9px "JetBrains Mono", monospace'
    ctx.fillText(stat.label || '', x + 16, y + 54)
  })
}

function drawSkillsSection(ctx, skills, animProgress) {
  const x = 80
  const y = 290
  const barMaxW = 440
  const barH = 8
  const rowH = 40

  // Section title
  ctx.fillStyle = COLORS.textMuted
  ctx.font = '600 10px "JetBrains Mono", monospace'
  ctx.textAlign = 'left'
  ctx.fillText('─── CORE SKILLS ───', x, y)

  const defaultSkills = [
    { name: 'React', level: 92, color: '#61dafb', icon: '⚛' },
    { name: 'Node.js', level: 85, color: '#68a063', icon: '⬢' },
    { name: 'Three.js', level: 78, color: '#8b5cf6', icon: '△' },
    { name: 'Flutter', level: 70, color: '#02569b', icon: '◆' },
  ]

  const s = skills?.length > 0 ? skills : defaultSkills

  s.slice(0, 4).forEach((skill, i) => {
    const sy = y + 20 + i * rowH
    const progress = Math.min(1, animProgress)
    const barW = (skill.level / 100) * barMaxW * progress

    // Skill name
    ctx.fillStyle = COLORS.text
    ctx.font = '13px "JetBrains Mono", monospace'
    ctx.fillText(`${skill.icon || '●'} ${skill.name}`, x, sy + 12)

    // Percentage
    ctx.fillStyle = COLORS.textMuted
    ctx.font = '12px "JetBrains Mono", monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.round(skill.level * progress)}%`, x + barMaxW + 60, sy + 12)
    ctx.textAlign = 'left'

    // Bar background
    roundRect(ctx, x, sy + 20, barMaxW, barH, 4)
    ctx.fillStyle = COLORS.skillBarBg
    ctx.fill()

    // Bar fill
    if (barW > 0) {
      roundRect(ctx, x, sy + 20, barW, barH, 4)
      ctx.fillStyle = skill.color || COLORS.skillBar
      ctx.fill()

      // Glow
      ctx.shadowColor = skill.color || COLORS.skillBar
      ctx.shadowBlur = 8
      ctx.fillRect(x + barW - 2, sy + 20, 2, barH)
      ctx.shadowBlur = 0
    }
  })
}

function drawSocialDock(ctx, socialLinks, ctaButtons) {
  const y = 480
  const x = 80

  // Divider
  const divGrad = ctx.createLinearGradient(x, y, x + 300, y)
  divGrad.addColorStop(0, 'transparent')
  divGrad.addColorStop(0.5, 'rgba(99,102,241,0.3)')
  divGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = divGrad
  ctx.fillRect(x, y, 300, 1)

  // Social links label
  ctx.fillStyle = COLORS.textMuted
  ctx.font = '600 10px "JetBrains Mono", monospace'
  ctx.fillText('CONNECT', x, y + 22)

  const socialIcons = [
    { name: 'GitHub', icon: 'GH', color: '#d4d4d4' },
    { name: 'LinkedIn', icon: 'LI', color: '#0077b5' },
    { name: 'Twitter', icon: 'TW', color: '#1da1f2' },
  ]

  socialIcons.forEach((social, i) => {
    const bx = x + i * 48
    const by = y + 34

    roundRect(ctx, bx, by, 40, 40, 10)
    ctx.fillStyle = COLORS.cardBg
    ctx.fill()
    ctx.strokeStyle = COLORS.cardBorder
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = social.color
    ctx.font = 'bold 12px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText(social.icon, bx + 20, by + 25)
    ctx.textAlign = 'left'

    ctx.fillStyle = COLORS.textMuted
    ctx.font = '9px "Inter", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(social.name, bx + 20, by + 54)
    ctx.textAlign = 'left'
  })

  // CTA Buttons
  const ctaY = y + 100
  ctx.fillStyle = COLORS.textMuted
  ctx.font = '600 10px "JetBrains Mono", monospace'
  ctx.fillText('ACTIONS', x, ctaY)

  const buttons = [
    { text: '→ Contact Me', color: COLORS.accent, bg: 'rgba(99,102,241,0.15)' },
    { text: '◇ View Projects', color: COLORS.cyan, bg: 'rgba(34,211,238,0.1)' },
  ]

  buttons.forEach((btn, i) => {
    const bx = x + i * 160
    const by = ctaY + 14

    roundRect(ctx, bx, by, 148, 36, 8)
    ctx.fillStyle = btn.bg
    ctx.fill()
    ctx.strokeStyle = `${btn.color}44`
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = btn.color
    ctx.font = '600 12px "Inter", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(btn.text, bx + 74, by + 23)
    ctx.textAlign = 'left'
  })
}

function drawDescription(ctx, introduction) {
  const x = 540
  const y = 58
  const maxW = 680

  if (!introduction) return

  // Truncate and word-wrap
  const words = introduction.replace(/<[^>]*>/g, '').split(' ')
  let line = ''
  let lineY = y
  const lineHeight = 20
  let lineCount = 0

  ctx.fillStyle = COLORS.textSecondary
  ctx.font = '13px "Inter", sans-serif'

  for (const word of words) {
    const test = line + (line ? ' ' : '') + word
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, lineY)
      line = word
      lineY += lineHeight
      lineCount++
      if (lineCount >= 4) break
    } else {
      line = test
    }
  }
  if (lineCount < 4 && line) {
    ctx.fillText(line, x, lineY)
  }
}

function drawWelcomePanel(ctx) {
  const x = 540
  const y = 110
  const panelW = 680
  const panelH = 150

  roundRect(ctx, x, y, panelW, panelH, 12)
  ctx.fillStyle = COLORS.cardBg
  ctx.fill()
  ctx.strokeStyle = COLORS.cardBorder
  ctx.lineWidth = 1
  ctx.stroke()

  // Welcome text
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 20px "Inter", sans-serif'
  ctx.fillText("Hi, I'm Desalegn", x + 24, y + 36)

  ctx.fillStyle = COLORS.accent
  ctx.font = '600 14px "Inter", sans-serif'
  ctx.fillText('Full Stack Developer', x + 24, y + 58)

  ctx.fillStyle = COLORS.textSecondary
  ctx.font = '13px "Inter", sans-serif'
  const desc = 'I build modern, scalable, and secure web applications with cutting-edge technologies.'
  ctx.fillText(desc, x + 24, y + 82)

  // Mini tech tags
  const tags = ['React', 'Node.js', 'Three.js', 'Flutter', 'MongoDB']
  tags.forEach((tag, i) => {
    const tx = x + 24 + i * 80
    const ty = y + 104

    roundRect(ctx, tx, ty, 72, 24, 6)
    ctx.fillStyle = 'rgba(99,102,241,0.1)'
    ctx.fill()

    ctx.fillStyle = COLORS.accent
    ctx.font = '11px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText(tag, tx + 36, ty + 16)
    ctx.textAlign = 'left'
  })
}

function drawStatusBar(ctx, phase) {
  ctx.fillStyle = COLORS.statusBar
  ctx.fillRect(0, H - 28, W, 28)

  ctx.fillStyle = '#ffffff'
  ctx.font = '12px "Inter", monospace'
  ctx.fillText('⬟ main    ✓ 0    ⚠ 0', 12, H - 10)

  ctx.textAlign = 'right'
  ctx.fillText('UTF-8    JavaScript    Developer Dashboard', W - 12, H - 10)
  ctx.textAlign = 'left'

  // Status dot
  ctx.beginPath()
  ctx.arc(W - 280, H - 14, 4, 0, Math.PI * 2)
  ctx.fillStyle = COLORS.green
  ctx.fill()
}

function drawScanlines(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.015)'
  for (let y = 0; y < H; y += 3) {
    ctx.fillRect(0, y, W, 1)
  }
}

function drawVignette(ctx) {
  const gradient = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.6)
  gradient.addColorStop(0, 'transparent')
  gradient.addColorStop(1, 'rgba(0,0,0,0.35)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, W, H)
}

export default function PortfolioDashboardScreen({ screenW = 2.48, screenH = 1.38, profileData }) {
  const canvasRef = useRef(null)
  const textureRef = useRef(null)
  const animRef = useRef({ skillProgress: 0, started: false, startTime: 0 })

  const name = profileData?.name || 'Desalegn Abreha'
  const badge = profileData?.badge || 'Full Stack Developer'
  const stats = profileData?.stats
  const skills = profileData?.skills
  const socialLinks = profileData?.socialLinks
  const ctaButtons = profileData?.ctaButtons
  const introduction = profileData?.introduction
  const profilePhotoUrl = profileData?.profilePhotoUrl

  useEffect(() => {
    const cvs = document.createElement('canvas')
    cvs.width = W
    cvs.height = H
    canvasRef.current = cvs

    const texture = new THREE.CanvasTexture(cvs)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    textureRef.current = texture

    const ctx = cvs.getContext('2d')
    fullDraw(ctx)
    texNeedsUpdateRef.current = true
    animRef.current = { skillProgress: 0, started: true, startTime: performance.now() }

    return () => {
      texture.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const texNeedsUpdateRef = useRef(false)
  const propsRef = useRef({ name, badge, stats, skills, socialLinks, ctaButtons, introduction, profilePhotoUrl })
  propsRef.current = { name, badge, stats, skills, socialLinks, ctaButtons, introduction, profilePhotoUrl }

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    fullDraw(ctx)
    texNeedsUpdateRef.current = true
  }, [name, badge, stats, skills, socialLinks, ctaButtons, introduction, profilePhotoUrl])

  useFrame(() => {
    const tex = textureRef.current
    const cvs = canvasRef.current
    if (!tex || !cvs) return

    const p = propsRef.current
    const elapsed = (performance.now() - animRef.current.startTime) / 1000
    const newProgress = Math.min(1, elapsed / 1.5)
    const progressChanged = Math.abs(newProgress - animRef.current.skillProgress) > 0.005

    if (!progressChanged && !texNeedsUpdateRef.current) return

    animRef.current.skillProgress = newProgress

    if (progressChanged || texNeedsUpdateRef.current) {
      const ctx = cvs.getContext('2d')
      drawFrame(ctx, newProgress, p)
      tex.needsUpdate = true
      texNeedsUpdateRef.current = false
    }
  })

  const drawFrame = useCallback((ctx, skillProgress, p) => {
    ctx.clearRect(0, 0, W, H)

    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, 0, W, H)

    const bgGrad = ctx.createRadialGradient(W * 0.3, H * 0.3, 0, W * 0.3, H * 0.3, W * 0.5)
    bgGrad.addColorStop(0, 'rgba(99,102,241,0.04)')
    bgGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)

    drawTitleBar(ctx)
    drawSidebar(ctx)
    drawProfileSection(ctx, p.profilePhotoUrl, p.name, p.badge)
    drawStatsCards(ctx, p.stats)
    drawDescription(ctx, p.introduction)
    drawWelcomePanel(ctx)
    drawSkillsSection(ctx, p.skills, skillProgress)
    drawSocialDock(ctx, p.socialLinks, p.ctaButtons)
    drawStatusBar(ctx)
    drawScanlines(ctx)
    drawVignette(ctx)
  }, [])

  const fullDraw = useCallback((ctx) => {
    drawFrame(ctx, 0, propsRef.current)
  }, [drawFrame])

  const material = useMemo(() => {
    const tex = textureRef.current
    if (!tex) return null
    return new THREE.MeshBasicMaterial({
      map: tex,
      toneMapped: false,
    })
  }, [])

  useEffect(() => {
    return () => {
      if (material && material.map) material.map.dispose()
      if (material) material.dispose()
    }
  }, [material])

  if (!textureRef.current || !material) return null

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
