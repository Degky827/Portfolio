import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Stars } from '@react-three/drei'
import FloatingParticles from './FloatingParticles'
import CinematicLighting from './CinematicLighting'
import HolographicLines from './HolographicLines'
import CinematicLensFlare from './CinematicLensFlare'
import SmoothCamera from './SmoothCamera'
import PostProcessing from './PostProcessing'
import ProjectsErrorBoundary from './ProjectsErrorBoundary'
import { useIsMobile, useDarkModeScene } from '../../shared/hooks/useSceneHooks'

function SceneEnvironment({ isMobile, fogColor }) {
  return (
    <>
      <SmoothCamera isMobile={isMobile} />

      <fog attach="fog" args={[fogColor, 6, 28]} />

      <CinematicLighting isMobile={isMobile} />
      <HolographicLines />
      <FloatingParticles key={isMobile ? 'particles-mobile' : 'particles-desktop'} count={isMobile ? 30 : 80} />
      <CinematicLensFlare isMobile={isMobile} />

      <Stars
        key={isMobile ? 'stars-mobile' : 'stars-desktop'}
        radius={40}
        depth={40}
        count={isMobile ? 150 : 600}
        factor={2.5}
        saturation={0.1}
        fade
        speed={0.4}
      />

      <PostProcessing isMobile={isMobile} />
    </>
  )
}

export default function ProjectsScene({ children }) {
  const isMobile = useIsMobile()
  const darkMode = useDarkModeScene()
  const bgColor = darkMode ? '#070B14' : '#ffffff'
  const fogColor = darkMode ? '#070B14' : '#ffffff'

  return (
    <div className="relative w-full min-h-screen" style={{ perspective: '1200px' }}>
      <div className="fixed inset-0 z-0">
        <ProjectsErrorBoundary>
          <Canvas
            camera={{ position: [0, 2, 10], fov: 50, near: 0.1, far: 100 }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}
            gl={{
              antialias: !isMobile,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
              toneMapping: 4,
              toneMappingExposure: 1.1,
            }}
            style={{ background: bgColor }}
          >
            <Suspense fallback={null}>
              <SceneEnvironment isMobile={isMobile} fogColor={fogColor} />
              <Preload all />
            </Suspense>
          </Canvas>
        </ProjectsErrorBoundary>
      </div>

      <div
        className="relative z-10"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
