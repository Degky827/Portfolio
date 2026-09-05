import { useEffect, useState, useCallback } from 'react'
import { lazy, Suspense } from 'react'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Skills from './sections/Skills'
import { getHomeContent } from '../../shared/services/homeContentService'
import { getAboutContent } from '../../shared/services/aboutService'
import { useSocketRefresh } from '../../shared/hooks/useSocketRefresh'

const Projects = lazy(() => import('./sections/Projects'))
const Testimonials = lazy(() => import('./sections/Testimonials'))
const Contact = lazy(() => import('./sections/Contact'))

const spinner = (
  <div className="h-64 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
)

export default function Home() {
  const [content, setContent] = useState(null)
  const [aboutContent, setAboutContent] = useState(null)

  const fetchHomeContent = useCallback(() => {
    getHomeContent()
      .then((res) => setContent(res.content))
      .catch(() => {})
  }, [])

  const fetchAboutContent = useCallback(() => {
    getAboutContent()
      .then((res) => setAboutContent(res.content))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchHomeContent()
    fetchAboutContent()
  }, [fetchHomeContent, fetchAboutContent])

  useSocketRefresh('content:updated', fetchHomeContent, { type: 'homepage' })
  useSocketRefresh('content:updated', fetchAboutContent, { type: 'about' })

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
    <>
      <Hero
        content={content}
        contactButtonText={content?.contactButtonText}
        contactButtonLink={content?.contactButtonLink}
      />
      {aboutContent?.status !== 'inactive' && (
        <About content={content?.about} hero={content?.hero} aboutContent={aboutContent} />
      )}
      <Experience />
      <Skills />
      <Suspense fallback={spinner}>
        <Projects />
      </Suspense>
      <Suspense fallback={spinner}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={spinner}>
        <Contact />
      </Suspense>
    </>
  )
}
