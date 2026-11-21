import { useEffect, useState, useCallback } from 'react'
import Hero from './sections/Hero'
import SectionDepth from '../shared/SectionDepth'
import { getHomeContent } from '../../shared/services/homeContentService'
import { useSocketRefresh } from '../../shared/hooks/useSocketRefresh'

export default function HomePage() {
  const [content, setContent] = useState(null)

  const fetchHomeContent = useCallback(() => {
    getHomeContent()
      .then((res) => setContent(res.content))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchHomeContent()
  }, [fetchHomeContent])

  useSocketRefresh('content:updated', fetchHomeContent, { type: 'homepage' })

  // Apply appearance CSS variables
  useEffect(() => {
    const ap = content?.appearance
    if (!ap) return
    const root = document.documentElement
    if (ap.textColor) root.style.setProperty('--text-primary', ap.textColor)
    if (ap.backgroundColor) root.style.setProperty('--bg-primary', ap.backgroundColor)
    if (ap.surfaceColor) root.style.setProperty('--surface', ap.surfaceColor)
    if (ap.mutedTextColor) root.style.setProperty('--text-secondary', ap.mutedTextColor)
    if (ap.backgroundImage) {
      root.style.setProperty('--bg-image', `url(${ap.backgroundImage})`)
      root.style.setProperty('--bg-position', ap.backgroundPosition || 'center')
    }
    if (ap.backgroundOverlay) root.style.setProperty('--bg-overlay', ap.backgroundOverlay)
    if (ap.backgroundOpacity != null) root.style.setProperty('--bg-opacity', ap.backgroundOpacity)
    return () => {
      ;['--text-primary', '--bg-primary', '--surface', '--text-secondary', '--bg-image', '--bg-position', '--bg-overlay', '--bg-opacity'].forEach((v) => root.style.removeProperty(v))
    }
  }, [content?.appearance])

  return (
    <SectionDepth sectionId="hero">
      <Hero
        content={content}
        contactButtonText={content?.contactButtonText}
        contactButtonLink={content?.contactButtonLink}
      />
    </SectionDepth>
  )
}
