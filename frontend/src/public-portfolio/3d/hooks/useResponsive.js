import { useState, useEffect } from 'react'

/**
 * useResponsive
 *
 * Detects viewport size for 3D scene optimization.
 * Returns breakpoint and scaled values for camera, particles, text.
 */
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState('desktop')

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setBreakpoint('mobile')
      else if (w < 1024) setBreakpoint('tablet')
      else setBreakpoint('desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const isMobile = breakpoint === 'mobile'
  const isTablet = breakpoint === 'tablet'
  const isDesktop = breakpoint === 'desktop'

  const particleCount = isMobile ? 80 : isTablet ? 150 : 300
  const textScale = isMobile ? 0.55 : isTablet ? 0.75 : 1
  const cameraZ = isMobile ? 6 : isTablet ? 5.5 : 5
  const modelScale = isMobile ? 0.7 : isTablet ? 0.85 : 1

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    particleCount,
    textScale,
    cameraZ,
    modelScale,
  }
}
