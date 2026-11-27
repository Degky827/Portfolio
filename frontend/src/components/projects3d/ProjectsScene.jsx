import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Stars } from '@react-three/drei'
import FloatingParticles from './FloatingParticles'
import CinematicLighting from './CinematicLighting'
import HolographicLines from './HolographicLines'
import SmoothCamera from './SmoothCamera'
import ProjectsErrorBoundary from './ProjectsErrorBoundary'
import { useIsMobile } from '../../shared/hooks/useSceneHooks'

function SceneEnvironment({ isMobile }) {
  return (
    <>
      <SmoothCamera isMobile={isMobile} />
      <CinematicLighting isMobile={isMobile} />
      <HolographicLines />
      <FloatingParticles key={isMobile ? 'particles-mobile' : 'particles-desktop'} count={isMobile ? 25 : 60} />
      <Stars
        key={isMobile ? 'stars-mobile' : 'stars-desktop'}
        radius={45}
        depth={40}
        count={isMobile ? 120 : 350}
        factor={2}
        saturation={0.2}
        fade
        speed={0.3}
      />
    </>
  )
}

export default function ProjectsScene({ children }) {
  const isMobile = useIsMobile()

  return (
    <div className="relative w-full min-h-screen" style={{ perspective: '1200px' }}>
      {/* 3D Interactive Canvas - transparent, lightweight, non-blocking for silky smooth scroll */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <ProjectsErrorBoundary>
          <Canvas
            camera={{ position: [0, 2, 10], fov: 50, near: 0.1, far: 100 }}
            dpr={isMobile ? [1, 1] : [1, 1.25]}
            gl={{
              antialias: !isMobile,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: false,
            }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <SceneEnvironment isMobile={isMobile} />
              <Preload all />
            </Suspense>
          </Canvas>
        </ProjectsErrorBoundary>
      </div>

      {/* Main Content Container with preserve-3d perspective */}
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
