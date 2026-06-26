import { lazy, Suspense } from 'react'
import { PORTFOLIO_SECTIONS } from '../config/portfolioMode'

const HeroScene = lazy(() => import('../scenes/HeroScene'))
const SkillsScene = lazy(() => import('../scenes/SkillsScene'))
const ProjectsScene = lazy(() => import('../scenes/ProjectsScene'))
const ContactScene = lazy(() => import('../scenes/ContactScene'))
const FooterScene = lazy(() => import('../scenes/FooterScene'))

/**
 * About section is now a standalone 2D cyberpunk page.
 * The 3D scroll portfolio shows a blank/transition for the about slot.
 */
const AboutFallback = () => null

const SCENE_COMPONENTS = {
  hero: HeroScene,
  about: AboutFallback,
  skills: SkillsScene,
  projects: ProjectsScene,
  contact: ContactScene,
  footer: FooterScene,
}

const sceneFallback = null

/**
 * SceneRouter
 *
 * Renders the correct 3D scene based on the active section index.
 * Uses React.lazy for code-splitting each scene.
 * Preloads adjacent scenes for smoother transitions.
 */
export default function SceneRouter({ activeSection, sectionProgress, scrollProgress }) {
  const section = PORTFOLIO_SECTIONS[activeSection]
  if (!section) return null

  const SceneComponent = SCENE_COMPONENTS[section.id]
  if (!SceneComponent) return null

  return (
    <Suspense fallback={sceneFallback}>
      <SceneComponent
        sectionProgress={sectionProgress}
        scrollProgress={scrollProgress}
        isActive={true}
      />
    </Suspense>
  )
}

/**
 * Preloads all scene chunks for smoother transitions.
 * Call this once after the canvas is mounted.
 */
export function preloadAllScenes() {
  Object.values(SCENE_COMPONENTS).forEach((Component) => {
    if (typeof Component.preload === 'function') {
      Component.preload()
    }
  })
}
