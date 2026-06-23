import { Suspense, useEffect, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollManager } from './hooks/useScrollManager'
import { PORTFOLIO_SECTIONS } from './config/portfolioMode'
import SceneRouter, { preloadAllScenes } from './components/SceneRouter'
import SceneEnvironment from './components/SceneEnvironment'
import ScrollIndicator from './components/ScrollIndicator'

const SCROLL_HEIGHT_MULTIPLIER = 6

/**
 * ThreeDPortfolio
 *
 * Main entry point for the 3D scrollable portfolio.
 * Architecture:
 *   - HTML document scrolls normally (accessibility, mobile, SEO)
 *   - A fixed Canvas renders 3D content that responds to scroll
 *   - HTML spacer divs create scroll height
 *   - useScrollManager maps scroll position to 3D scene transitions
 */
export default function ThreeDPortfolio() {
  const {
    scrollProgress,
    activeSection,
    sectionProgress,
    sectionId,
    isScrolling,
    scrollToSection,
  } = useScrollManager()

  const canvasRef = useRef()
  const hasPreloaded = useRef(false)

  useEffect(() => {
    if (!hasPreloaded.current) {
      hasPreloaded.current = true
      const timer = setTimeout(() => preloadAllScenes(), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNavigate = useCallback(
    (sectionIndex) => {
      scrollToSection(sectionIndex)
    },
    [scrollToSection]
  )

  return (
    <div className="relative w-full bg-[#0a0a1a]">
      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          shadows
          style={{ background: '#0a0a1a' }}
        >
          <color attach="background" args={['#0a0a1a']} />

          <SceneEnvironment scrollProgress={scrollProgress} />

          <Suspense fallback={null}>
            <SceneRouter
              activeSection={activeSection}
              sectionProgress={sectionProgress}
            />
          </Suspense>

          <Preload all />
        </Canvas>
      </div>

      {/* Scroll Indicator Navigation */}
      <ScrollIndicator
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Section Label Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sectionId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/70 text-sm font-medium border border-white/10">
            {PORTFOLIO_SECTIONS[activeSection]?.label || ''}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Scroll Spacer - Creates real scroll height */}
      <div
        className="relative z-10 pointer-events-none"
        style={{ height: `${PORTFOLIO_SECTIONS.length * SCROLL_HEIGHT_MULTIPLIER * 100}vh` }}
      >
        {PORTFOLIO_SECTIONS.map((section, index) => (
          <div
            key={section.id}
            id={`3d-section-${section.id}`}
            className="w-full"
            style={{ height: `${SCROLL_HEIGHT_MULTIPLIER * 100}vh` }}
          />
        ))}
      </div>

      {/* Top gradient fade */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#0a0a1a] to-transparent z-40 pointer-events-none" />

      {/* Bottom gradient fade */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a1a] to-transparent z-40 pointer-events-none" />
    </div>
  )
}
