import { useEffect, useRef } from 'react'

const RADIAL_POINTS = [
  { color: '#06B6D4', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
  { color: '#7C3AED', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' },
  { color: '#0D9488', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
  { color: '#F59E0B', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>' },
  { color: '#E11D48', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' },
  { color: '#4F46E5', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>' },
  { color: '#0284C7', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
  { color: '#059669', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' },
]

const CENTER_COLOR = '#2563EB'
const ICON_COUNT = RADIAL_POINTS.length
const ANGLES = Array.from({ length: ICON_COUNT }, (_, i) => (i * 360) / ICON_COUNT)
const RADIUS = 80
const MAX_EFFECTS = 3

const INTERACTIVE_SELECTOR =
  'a[href], button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]), [data-cursor-interactive="true"], canvas'

function getAccentColor() {
  if (typeof document === 'undefined') return '#6366f1'
  return document.documentElement.classList.contains('dark') ? '#818cf8' : '#4f46e5'
}

function isDarkMode() {
  if (typeof document === 'undefined') return true
  return document.documentElement.classList.contains('dark')
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export default function CursorSystem() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouseRef = useRef({ x: -100, y: -100 })
  const dotPos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)
  const hoverRef = useRef(false)
  const layerRef = useRef(null)
  const effectsRef = useRef([])
  const isDesktopRef = useRef(false)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)')
    isDesktopRef.current = mql.matches

    const rmq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = rmq.matches

    const onMqlChange = () => { isDesktopRef.current = mql.matches }
    const onRmqChange = () => { reducedMotionRef.current = rmq.matches }

    mql.addEventListener('change', onMqlChange)
    rmq.addEventListener('change', onRmqChange)

    if (!mql.matches) return

    document.documentElement.classList.add('custom-cursor-active')

    const handlePointerMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handlePointerOver = (e) => {
      if (e.target.closest && e.target.closest(INTERACTIVE_SELECTOR)) {
        hoverRef.current = true
      }
    }

    const handlePointerOut = (e) => {
      if (e.target.closest && e.target.closest(INTERACTIVE_SELECTOR)) {
        hoverRef.current = false
      }
    }

    const animate = () => {
      const dot = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const isHover = hoverRef.current
      const noMotion = reducedMotionRef.current

      dotPos.current.x = mx
      dotPos.current.y = my

      if (noMotion) {
        ringPos.current.x = mx
        ringPos.current.y = my
      } else {
        ringPos.current.x += (mx - ringPos.current.x) * 0.12
        ringPos.current.y += (my - ringPos.current.y) * 0.12
      }

      const dotScale = isHover ? ' scale(0.7)' : ''
      const ringScale = isHover ? ' scale(1.3)' : ''

      dot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)${dotScale}`
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)${ringScale}`

      rafRef.current = requestAnimationFrame(animate)
    }

    const handleClick = (e) => {
      if (!isDesktopRef.current) return
      if (reducedMotionRef.current) return

      if (e.target.closest && e.target.closest(INTERACTIVE_SELECTOR)) return

      const layer = layerRef.current
      if (!layer) return

      while (effectsRef.current.length >= MAX_EFFECTS) {
        const oldest = effectsRef.current.shift()
        if (oldest && oldest.parentNode) oldest.parentNode.removeChild(oldest)
      }

      const cx = e.clientX
      const cy = e.clientY
      const dark = isDarkMode()

      const container = document.createElement('div')
      container.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:0;height:0;pointer-events:none;z-index:99998;`

      const centerDot = document.createElement('div')
      centerDot.style.cssText = `position:absolute;width:10px;height:10px;background:${CENTER_COLOR};border-radius:50%;transform:translate(-50%,-50%) scale(0);transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 0 6px ${CENTER_COLOR}40;`
      container.appendChild(centerDot)

      const clickRing = document.createElement('div')
      clickRing.style.cssText = `position:absolute;width:36px;height:36px;border:1.5px solid ${CENTER_COLOR};border-radius:50%;transform:translate(-50%,-50%) scale(0);opacity:0.6;transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s ease;`
      container.appendChild(clickRing)

      const iconElements = ANGLES.map((angle, i) => {
        const point = RADIAL_POINTS[i]
        const pointRgb = hexToRgb(point.color)
        const bgLight = '#FFFFFF'
        const bgDark = '#111827'
        const bg = dark ? bgDark : bgLight

        const wrapper = document.createElement('div')
        wrapper.style.cssText = `position:absolute;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:${bg};border:1.5px solid ${point.color};border-radius:50%;color:${point.color};transform:translate(-50%,-50%) scale(0) rotate(0deg);opacity:0;transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1),opacity 0.35s ease;box-shadow:0 2px 8px rgba(${pointRgb},0.15);`
        wrapper.innerHTML = point.icon
        container.appendChild(wrapper)
        return wrapper
      })

      layer.appendChild(container)
      effectsRef.current.push(container)

      requestAnimationFrame(() => {
        centerDot.style.transform = 'translate(-50%,-50%) scale(1)'
        clickRing.style.transform = 'translate(-50%,-50%) scale(1.1)'

        setTimeout(() => {
          clickRing.style.transform = 'translate(-50%,-50%) scale(0.9)'
        }, 150)

        iconElements.forEach((el, idx) => {
          const rad = (ANGLES[idx] * Math.PI) / 180
          const tx = Math.cos(rad) * RADIUS
          const ty = Math.sin(rad) * RADIUS

          requestAnimationFrame(() => {
            el.style.transform = `translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(1) rotate(${ANGLES[idx] * 0.3}deg)`
            el.style.opacity = '1'
          })
        })
      })

      setTimeout(() => {
        centerDot.style.transform = 'translate(-50%,-50%) scale(0)'
        centerDot.style.opacity = '0'
        clickRing.style.transform = 'translate(-50%,-50%) scale(1.5)'
        clickRing.style.opacity = '0'

        iconElements.forEach((el) => {
          el.style.transform = 'translate(-50%,-50%) scale(0)'
          el.style.opacity = '0'
        })
      }, 800)

      setTimeout(() => {
        if (container.parentNode) container.parentNode.removeChild(container)
        effectsRef.current = effectsRef.current.filter((e) => e !== container)
      }, 1200)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerover', handlePointerOver, { passive: true })
    document.addEventListener('pointerout', handlePointerOut, { passive: true })
    window.addEventListener('click', handleClick, { passive: true })

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      mql.removeEventListener('change', onMqlChange)
      rmq.removeEventListener('change', onRmqChange)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
      window.removeEventListener('click', handleClick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#6366f1',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1.5px solid #6366f1',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />
      <div
        ref={layerRef}
        className="cursor-click-layer"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 99997,
          overflow: 'hidden',
        }}
      />
    </>
  )
}
