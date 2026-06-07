import { lazy, Suspense } from 'react'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'

const Projects = lazy(() => import('../components/sections/Projects'))
const Contact = lazy(() => import('../components/sections/Contact'))

const spinner = (
  <div className="h-64 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
)

export default function Home() {
  return (
    <>
      <Hero />
      <About />
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
