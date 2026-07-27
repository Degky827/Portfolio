import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Stars } from '@react-three/drei'
import * as THREE from 'three'
import FloatingParticles from './FloatingParticles'
import EnvironmentLights from './EnvironmentLights'
import SkillsBackground from './SkillsBackground'
import SkillsErrorBoundary from './SkillsErrorBoundary'
import { useIsMobile, useDarkModeScene } from '../../shared/hooks/useSceneHooks'

function MouseParallaxCamera({ isMobile }) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (isMobile) return
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  useFrame((state, delta) => {
    if (isMobile) return

    const speed = 2
    target.current.x = THREE.MathUtils.lerp(target.current.x, mouse.current.x * 0.5, delta * speed)
    target.current.y = THREE.MathUtils.lerp(target.current.y, mouse.current.y * 0.3, delta * speed)

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.current.x, delta * speed)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2 + target.current.y, delta * speed)
    camera.lookAt(0, 1, 0)
  })

  return null
}

function LensFlare() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    const scale = 1 + Math.sin(time * 2) * 0.1
    meshRef.current.scale.set(scale, scale, 1)
    meshRef.current.material.opacity = 0.15 + Math.sin(time * 1.5) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[3, 4, -4]}>
      <circleGeometry args={[0.8, 16]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function NeonGlow() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.material.opacity = 0.1 + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 3, -6]}>
      <ringGeometry args={[2, 4, 32]} />
      <meshBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function GlassReflections({ isMobile }) {
  if (isMobile) return null

  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial
        color="#8b5cf6"
        wireframe
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function SkillsScene({ children }) {
  const isMobile = useIsMobile()
  const darkMode = useDarkModeScene()
  const particleCount = isMobile ? 40 : 100
  const bgColor = darkMode ? '#070B14' : '#ffffff'
  const fogColor = darkMode ? '#070B14' : '#ffffff'

  return (
    <div className="relative w-full min-h-screen" style={{ perspective: '1200px' }}>
      <div className="fixed inset-0 z-0">
        <SkillsErrorBoundary>
          <Canvas
            camera={{ position: [0, 2, 10], fov: 50, near: 0.1, far: 100 }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}
            gl={{
              antialias: !isMobile,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
            }}
            style={{ background: bgColor }}
          >
            <Suspense fallback={null}>
              <MouseParallaxCamera isMobile={isMobile} />

              <fog attach="fog" args={[fogColor, 8, 25]} />

              <SkillsBackground />
              <EnvironmentLights />
              <FloatingParticles count={particleCount} />

              {!isMobile && (
                <>
                  <LensFlare />
                  <NeonGlow />
                  <GlassReflections isMobile={isMobile} />
                </>
              )}

              <Stars
                radius={50}
                depth={50}
                count={isMobile ? 200 : 800}
                factor={2}
                saturation={0}
                fade
                speed={0.5}
              />

              <Preload all />
            </Suspense>
          </Canvas>
        </SkillsErrorBoundary>
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
