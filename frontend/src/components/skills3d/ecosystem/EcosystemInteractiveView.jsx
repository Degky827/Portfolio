import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import EcosystemScene3D from './EcosystemScene3D'
import { useDarkModeScene } from '../../../shared/hooks/useSceneHooks'

export default function EcosystemInteractiveView() {
  const darkMode = useDarkModeScene()

  return (
    <div
      className="w-full relative transition-colors duration-300 overflow-hidden bg-transparent"
      style={{
        height: '750px',
        maxHeight: '800px',
      }}
    >
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: [0, 8.8, 12.8], fov: 46 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMappingExposure: 1.15,
            alpha: true,
          }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <EcosystemScene3D darkMode={darkMode} />
        </Canvas>
      </Suspense>
    </div>
  )
}
