import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import FloatingParticles from './FloatingParticles'
import EnvironmentLights from './EnvironmentLights'
import SkillsBackground from './SkillsBackground'
import SkillsErrorBoundary from './SkillsErrorBoundary'

export default function SkillsScene({ children }) {
  return (
    <SkillsErrorBoundary>
      <div className="relative w-full min-h-screen" style={{ perspective: '1200px' }}>
        <div className="fixed inset-0 z-0">
          <Canvas
            camera={{ position: [0, 2, 10], fov: 50, near: 0.1, far: 100 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            style={{ background: '#070B14' }}
          >
            <Suspense fallback={null}>
              <SkillsBackground />
              <EnvironmentLights />
              <FloatingParticles />
              <Preload all />
            </Suspense>
          </Canvas>
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
    </SkillsErrorBoundary>
  )
}
