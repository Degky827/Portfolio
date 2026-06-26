import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Stars } from '@react-three/drei'
import FloatingParticles from './FloatingParticles'
import ContactLighting from './ContactLighting'
import ContactEnvironment from './ContactEnvironment'
import ContactErrorBoundary from './ContactErrorBoundary'
import SmoothCamera from '../projects3d/SmoothCamera'
import PostProcessing from '../projects3d/PostProcessing'

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

      <fog attach="fog" args={['#06061a', 6, 30]} />

      <ContactLighting isMobile={isMobile} />
      <ContactEnvironment />
      <FloatingParticles count={isMobile ? 50 : 150} />

      <Stars
        radius={45}
        depth={45}
        count={isMobile ? 200 : 1200}
        factor={2.5}
        saturation={0.1}
        fade
        speed={0.3}
      />

      <PostProcessing isMobile={isMobile} />
    </>
  )
}

export default function ContactScene({ children }) {
  const isMobile = useIsMobile()

  return (
    <div className="relative w-full" style={{ perspective: '1200px' }}>
      <div className="fixed inset-0 z-0">
        <ContactErrorBoundary>
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
            style={{ background: '#06061a' }}
          >
            <Suspense fallback={null}>
              <SceneEnvironment isMobile={isMobile} />
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
