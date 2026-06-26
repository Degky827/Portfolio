import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Stars } from '@react-three/drei'
import FloatingParticles from './FloatingParticles'
import CinematicLighting from './CinematicLighting'
import HolographicLines from './HolographicLines'
import CinematicLensFlare from './CinematicLensFlare'
import SmoothCamera from './SmoothCamera'
import PostProcessing from './PostProcessing'
import ProjectsErrorBoundary from './ProjectsErrorBoundary'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function SceneEnvironment({ isMobile }) {
  return (
    <>
      <SmoothCamera isMobile={isMobile} />

      <fog attach="fog" args={['#070B14', 6, 28]} />

      <CinematicLighting isMobile={isMobile} />
      <HolographicLines />
      <FloatingParticles count={isMobile ? 60 : 180} />
      <CinematicLensFlare isMobile={isMobile} />

      <Stars
        radius={40}
        depth={40}
        count={isMobile ? 300 : 1500}
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

  return (
    <div className="relative w-full min-h-screen" style={{ perspective: '1200px' }}>
      <div className="fixed inset-0 z-0">
        <ProjectsErrorBoundary>
          <Canvas
            camera={{ position: [0, 2, 10], fov: 50, near: 0.1, far: 100 }}
            dpr={isMobile ? [1, 1] : [1, 2]}
            gl={{
              antialias: !isMobile,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
              toneMapping: 4,
              toneMappingExposure: 1.1,
            }}
            style={{ background: '#070B14' }}
          >
            <Suspense fallback={null}>
              <SceneEnvironment isMobile={isMobile} />
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
