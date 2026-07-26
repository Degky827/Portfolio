import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import Globe3D from './Globe3D'
import ContactErrorBoundary from './ContactErrorBoundary'
import { useIsMobile } from '../../shared/hooks/useSceneHooks'

function GlobeCamera({ isMobile }) {
  const { camera } = useThree()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (isMobile) {
      camera.position.x = Math.sin(t * 0.08) * 0.2
      camera.position.y = 0.5 + Math.sin(t * 0.06) * 0.15
      camera.position.z = 6
    } else {
      camera.position.x = Math.sin(t * 0.06) * 0.3
      camera.position.y = 0.8 + Math.sin(t * 0.05) * 0.15
      camera.position.z = 6.5
    }
    camera.lookAt(0, 0, 0)
  })

  return null
}

function GlobeLighting({ isMobile }) {
  const keyRef = useRef()
  const rimRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (keyRef.current) {
      keyRef.current.intensity = 1.0 + Math.sin(t * 0.3) * 0.15
    }
    if (rimRef.current) {
      rimRef.current.intensity = 0.5 + Math.sin(t * 0.4 + 1) * 0.1
    }
  })

  return (
    <>
      <ambientLight intensity={0.08} color="#cffafe" />
      <directionalLight ref={keyRef} position={[4, 6, 5]} intensity={1.0} color="#22d3ee" />
      <pointLight ref={rimRef} position={[-5, 3, -4]} intensity={0.5} color="#8b5cf6" distance={20} decay={2} />
      <pointLight position={[3, -2, 4]} intensity={0.3} color="#06b6d4" distance={15} decay={2} />
      <pointLight position={[0, 4, -3]} intensity={0.25} color="#22d3ee" distance={12} decay={2} />
      {!isMobile && (
        <pointLight position={[0, -3, 0]} intensity={0.1} color="#8b5cf6" distance={10} decay={2} />
      )}
    </>
  )
}

function GlobePostProcessing({ isMobile }) {
  return (
    <EffectComposer multisampling={isMobile ? 0 : 2}>
      <Bloom
        intensity={isMobile ? 0.5 : 0.9}
        luminanceThreshold={isMobile ? 0.3 : 0.15}
        luminanceSmoothing={isMobile ? 1.5 : 1.0}
        mipmapBlur
        radius={isMobile ? 0.3 : 0.6}
      />
      <Vignette
        offset={0.3}
        darkness={isMobile ? 0.35 : 0.65}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}

function GlobeSceneContent({ isMobile }) {
  return (
    <>
      <GlobeCamera isMobile={isMobile} />
      <fog attach="fog" args={['#06061a', 8, 25]} />
      <GlobeLighting isMobile={isMobile} />
      <Globe3D isMobile={isMobile} />
      <Stars
        radius={40}
        depth={40}
        count={isMobile ? 150 : 800}
        factor={2.5}
        saturation={0.15}
        fade
        speed={0.3}
      />
      <GlobePostProcessing isMobile={isMobile} />
    </>
  )
}

export default function GlobeScene() {
  const isMobile = useIsMobile()
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[350px] sm:min-h-[400px] md:min-h-[480px]">
      <ContactErrorBoundary>
        <Canvas
          camera={{ position: [0, 0.8, 6.5], fov: 45, near: 0.1, far: 100 }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            toneMapping: 4,
            toneMappingExposure: 1.15,
          }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            {isVisible && <GlobeSceneContent isMobile={isMobile} />}
            <Preload all />
          </Suspense>
        </Canvas>
      </ContactErrorBoundary>

      {/* Subtle gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,6,26,0.4) 100%)',
        }}
      />
    </div>
  )
}
