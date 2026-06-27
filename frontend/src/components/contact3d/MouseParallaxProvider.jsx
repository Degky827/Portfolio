import { createContext, useContext, useRef, useEffect, useCallback, useState } from 'react'

const MouseParallaxContext = createContext(null)

const LERP_FACTOR = 0.08

function lerp(start, end, factor) {
  return start + (end - start) * factor
}

export function MouseParallaxProvider({ children, enabled = true }) {
  const mouse = useRef({ rawX: 0, rawY: 0, x: 0, y: 0 })
  const rafId = useRef(null)
  const listenersRef = useRef(new Set())
  const isActiveRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const update = useCallback(() => {
    const m = mouse.current
    m.x = lerp(m.x, m.rawX, LERP_FACTOR)
    m.y = lerp(m.y, m.rawY, LERP_FACTOR)

    listenersRef.current.forEach((fn) => fn(m.x, m.y))

    if (isActiveRef.current) {
      rafId.current = requestAnimationFrame(update)
    }
  }, [])

  useEffect(() => {
    if (!enabled || isMobile) return

    const handleMouseMove = (e) => {
      mouse.current.rawX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.rawY = -(e.clientY / window.innerHeight) * 2 + 1

      if (!isActiveRef.current) {
        isActiveRef.current = true
        rafId.current = requestAnimationFrame(update)
      }
    }

    const handleMouseLeave = () => {
      mouse.current.rawX = 0
      mouse.current.rawY = 0
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      isActiveRef.current = false
    }
  }, [enabled, isMobile, update])

  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn)
    return () => listenersRef.current.delete(fn)
  }, [])

  const getTransforms = useCallback((intensity = 1) => {
    const m = mouse.current
    if (isMobile) return { rotateX: 0, rotateY: 0, translateZ: 0 }
    return {
      rotateX: m.y * -5 * intensity,
      rotateY: m.x * 5 * intensity,
      translateZ: Math.abs(m.x * m.y) * 10 * intensity,
    }
  }, [isMobile])

  return (
    <MouseParallaxContext.Provider value={{ subscribe, getTransforms, mouse, isMobile }}>
      {children}
    </MouseParallaxContext.Provider>
  )
}

export function useMouseParallaxSubscribe(callback, deps = []) {
  const ctx = useContext(MouseParallaxContext)
  useEffect(() => {
    if (!ctx) return
    return ctx.subscribe(callback)
  }, [ctx, ...deps])
}

export function useMouseParallaxTransforms(intensity = 1) {
  const ctx = useContext(MouseParallaxContext)
  if (!ctx) return { rotateX: 0, rotateY: 0, translateZ: 0 }
  return ctx.getTransforms(intensity)
}

export function useMouseParallaxContext() {
  return useContext(MouseParallaxContext)
}
