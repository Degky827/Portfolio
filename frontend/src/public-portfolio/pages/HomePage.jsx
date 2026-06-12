import { useEffect, useState } from 'react'
import { lazy, Suspense } from 'react'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import { getHomeContent } from '../../shared/services/homeContentService'
import { getAboutContent } from '../../shared/services/aboutService'

const Projects = lazy(() => import('./sections/Projects'))
const Contact = lazy(() => import('./sections/Contact'))

const spinner = (
  <div className="h-64 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
)

export default function Home() {
  const [content, setContent] = useState(null)
  const [aboutContent, setAboutContent] = useState(null)

  useEffect(() => {
    getHomeContent()
      .then((res) => setContent(res.content))
      .catch(() => {})
    getAboutContent()
      .then((res) => setAboutContent(res.content))
      .catch(() => {})
  }, [])

  return (
    <>
      <Hero
        content={content?.hero}
        contactButtonText={content?.contactButtonText}
        contactButtonLink={content?.contactButtonLink}
      />
      <About content={content?.about} hero={content?.hero} aboutContent={aboutContent} />
      <Skills />
      <Suspense fallback={spinner}>
        <Projects />
      </Suspense>
      <Suspense fallback={spinner}>
        <Contact />
      </Suspense>
    </>
  )
}
