/**
 * Portfolio Mode Configuration
 *
 * Controls whether the public portfolio renders in 2D or 3D mode.
 * Currently hardcoded to "2D". Will later be connected to admin panel
 * and database settings.
 *
 * Supported modes:
 *   "2D" - Default HTML/CSS scrollable portfolio (current)
 *   "3D" - Three.js canvas-based scrollable portfolio
 */

export const PORTFOLIO_MODES = {
  TWO_D: '2D',
  THREE_D: '3D',
}

export const portfolioMode = {
  mode: PORTFOLIO_MODES.TWO_D,
}

/**
 * Section definitions shared between 2D and 3D modes.
 * Each section maps scroll progress (0-1) to a scene.
 */
export const PORTFOLIO_SECTIONS = [
  { id: 'hero', label: 'Hero', scrollStart: 0, scrollEnd: 0.18 },
  { id: 'about', label: 'About', scrollStart: 0.18, scrollEnd: 0.36 },
  { id: 'skills', label: 'Skills', scrollStart: 0.36, scrollEnd: 0.54 },
  { id: 'projects', label: 'Projects', scrollStart: 0.54, scrollEnd: 0.72 },
  { id: 'contact', label: 'Contact', scrollStart: 0.72, scrollEnd: 0.88 },
  { id: 'footer', label: 'Footer', scrollStart: 0.88, scrollEnd: 1.0 },
]

/**
 * Returns the active section index for a given scroll progress (0-1).
 */
export function getActiveSection(scrollProgress) {
  for (let i = PORTFOLIO_SECTIONS.length - 1; i >= 0; i--) {
    if (scrollProgress >= PORTFOLIO_SECTIONS[i].scrollStart) {
      return i
    }
  }
  return 0
}

/**
 * Returns the local progress (0-1) within the active section.
 */
export function getSectionProgress(scrollProgress, sectionIndex) {
  const section = PORTFOLIO_SECTIONS[sectionIndex]
  if (!section) return 0
  const range = section.scrollEnd - section.scrollStart
  if (range <= 0) return 0
  return Math.min(1, Math.max(0, (scrollProgress - section.scrollStart) / range))
}
