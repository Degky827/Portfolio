import { useEffect, useState, useCallback } from 'react'
import About from './sections/About'
import SectionDepth from '../shared/SectionDepth'
import PageNavigationHeader from '../shared/PageNavigationHeader'
import { getAboutContent } from '../../shared/services/aboutService'
import { getHomeContent } from '../../shared/services/homeContentService'
import { useSocketRefresh } from '../../shared/hooks/useSocketRefresh'

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState(null)
  const [homeContent, setHomeContent] = useState(null)

  const fetchContent = useCallback(() => {
    getAboutContent()
      .then((res) => setAboutContent(res.content))
      .catch(() => {})
    getHomeContent()
      .then((res) => setHomeContent(res.content))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  useSocketRefresh('content:updated', fetchContent, { type: 'about' })
  useSocketRefresh('content:updated', fetchContent, { type: 'homepage' })

  return (
    <SectionDepth sectionId="about" className="py-4 sm:py-8">
      <PageNavigationHeader title="About" subtitle="Bio & Background" />
      <About
        content={homeContent?.about}
        hero={homeContent?.hero}
        aboutContent={aboutContent}
      />
    </SectionDepth>
  )
}
