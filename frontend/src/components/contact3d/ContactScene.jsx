import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Stars } from '@react-three/drei'
import FloatingParticles from './FloatingParticles'
import ContactLighting from './ContactLighting'
import ContactEnvironment from './ContactEnvironment'
import ContactErrorBoundary from './ContactErrorBoundary'
import SmoothCamera from '../projects3d/SmoothCamera'
import PostProcessing from '../projects3d/PostProcessing'
import { useIsMobile, useDarkModeScene } from '../../shared/hooks/useSceneHooks'

function SceneEnvironment({ isMobile, darkMode }) {
  const fogColor = darkMode ? '#06061a' : '#f0f9ff'
  return (
    <>
      <SmoothCamera isMobile={isMobile} />

      <fog attach="fog" args={[fogColor, 5, 28]} />

      <ContactLighting isMobile={isMobile} darkMode={darkMode} />
      <ContactEnvironment isMobile={isMobile} />
      <FloatingParticles key={isMobile ? 'mobile' : 'desktop'} count={isMobile ? 30 : 120} darkMode={darkMode} />

      <Stars
        key={isMobile ? 'mobile' : 'desktop'}
        radius={45}
        depth={45}
        count={isMobile ? 100 : 1000}
        factor={2.5}
        saturation={0.15}
        fade
        speed={0.4}
      />

      <PostProcessing isMobile={isMobile} quality="high" />
    </>
  )
}

export default function ContactScene({ children }) {
  const isMobile = useIsMobile()
  const darkMode = useDarkModeScene()
  const bgColor = darkMode ? '#06061a' : '#f0f9ff'

  return (
    <div className="relative w-full" style={{ perspective: '1200px' }}>
      <div className="fixed inset-0 z-0">
        <ContactErrorBoundary>
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
              toneMappingExposure: darkMode ? 1.15 : 1.3,
            }}
            style={{ background: bgColor }}
          >
            <Suspense fallback={null}>
              <SceneEnvironment isMobile={isMobile} darkMode={darkMode} />
              <Preload all />
            </Suspense>
          </Canvas>
        </ContactErrorBoundary>
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
