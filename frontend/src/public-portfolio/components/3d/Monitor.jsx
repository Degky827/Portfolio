import { useRef, useMemo, lazy, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MonitorScreen = lazy(() => import('./MonitorScreen'))

/**
 * Monitor
 *
 * Ultra-wide monitor with VS Code screen, glowing bezel accents,
 * and glass glow effect.
 */
export default function Monitor({ position = [0, 0, 0] }) {
  const screenRef = useRef()
  const glassRef = useRef()
  const purpleColor = useMemo(() => new THREE.Color('#8b5cf6'), [])
  const glowColor = useMemo(() => new THREE.Color('#6366f1'), [])
  const cyanColor = useMemo(() => new THREE.Color('#22d3ee'), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.3 + Math.sin(t * 0.5) * 0.1
    }
    if (glassRef.current) {
      glassRef.current.material.opacity = 0.08 + Math.sin(t * 0.3) * 0.02
    }
  })

  return (
    <group position={position}>
      {/* Monitor stand base */}
      <mesh position={[0, 0.78, 0.1]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.03, 32]} />
        <meshStandardMaterial
          color="#0f0a2a"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Monitor stand neck */}
      <mesh position={[0, 1.0, 0.1]} castShadow>
        <boxGeometry args={[0.06, 0.44, 0.06]} />
        <meshStandardMaterial
          color="#0f0a2a"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Stand neck glow accent */}
      <mesh position={[0, 1.0, 0.13]}>
        <boxGeometry args={[0.02, 0.4, 0.01]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Monitor body - back panel */}
      <mesh position={[0, 1.35, -0.05]} castShadow>
        <boxGeometry args={[2.6, 1.5, 0.06]} />
        <meshStandardMaterial
          color="#0a0520"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Monitor screen - dark base */}
      <mesh ref={screenRef} position={[0, 1.35, 0.01]}>
        <planeGeometry args={[2.4, 1.35]} />
        <meshStandardMaterial
          color="#0a0520"
          emissive={glowColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* VS Code Screen Content */}
      <Suspense fallback={null}>
        <MonitorScreen />
      </Suspense>

      {/* Glass overlay - CSS glass effect in 3D */}
      <mesh ref={glassRef} position={[0, 1.35, 0.018]}>
        <planeGeometry args={[2.38, 1.33]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          roughness={0}
          metalness={0.3}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Screen edge reflection - top */}
      <mesh position={[0, 2.02, 0.016]}>
        <planeGeometry args={[2.3, 0.08]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          roughness={0}
        />
      </mesh>

      {/* Screen soft glow - emitted light effect */}
      <pointLight
        position={[0, 1.35, 0.8]}
        intensity={0.15}
        color={glowColor}
        distance={3}
      />

      {/* Bezel glow - top */}
      <mesh position={[0, 2.11, 0.01]}>
        <boxGeometry args={[2.62, 0.02, 0.02]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Bezel glow - bottom */}
      <mesh position={[0, 0.59, 0.01]}>
        <boxGeometry args={[2.62, 0.02, 0.02]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Bezel glow - left */}
      <mesh position={[-1.31, 1.35, 0.01]}>
        <boxGeometry args={[0.02, 1.52, 0.02]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Bezel glow - right */}
      <mesh position={[1.31, 1.35, 0.01]}>
        <boxGeometry args={[0.02, 1.52, 0.02]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Power indicator LED */}
      <mesh position={[0, 0.62, 0.02]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color={cyanColor}
          emissive={cyanColor}
          emissiveIntensity={3}
        />
      </mesh>
    </group>
  )
}
