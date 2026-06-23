import { useState, useEffect, useCallback, useRef } from 'react'
import { getActiveSection, getSectionProgress, PORTFOLIO_SECTIONS } from '../config/portfolioMode'

/**
 * useScrollManager
 *
 * Tracks the HTML page scroll and maps it to 3D section transitions.
 * The 3D canvas stays fixed while HTML spacer elements create scroll height.
 *
 * Returns:
 *   scrollProgress   - Normalized 0-1 progress across the entire page
 *   activeSection    - Index of the currently active section
 *   sectionProgress  - Local 0-1 progress within the active section
 *   sectionId        - String id of the active section
 *   isScrolling      - Whether the user is actively scrolling
 *   scrollToSection  - Programmatic scroll to a section by index
 */
export function useScrollManager(sectionCount = PORTFOLIO_SECTIONS.length) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [sectionProgress, setSectionProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef(null)
  const rafRef = useRef(null)

  const updateScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0

    setScrollProgress(progress)
    const section = getActiveSection(progress)
    setActiveSection(section)
    setSectionProgress(getSectionProgress(progress, section))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateScroll)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [updateScroll])

  const scrollToSection = useCallback((sectionIndex) => {
    const section = PORTFOLIO_SECTIONS[sectionIndex]
    if (!section) return
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const targetScroll = section.scrollStart * docHeight
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }, [])

  return {
    scrollProgress,
    activeSection,
    sectionProgress,
    sectionId: PORTFOLIO_SECTIONS[activeSection]?.id || 'hero',
    isScrolling,
    scrollToSection,
  }
}
