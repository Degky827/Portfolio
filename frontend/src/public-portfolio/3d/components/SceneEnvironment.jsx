import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * SceneEnvironment
 *
 * Shared 3D environment for all scenes: fog, stars, ambient lighting.
 * Keeps the canvas feeling alive with subtle background animation.
 */
export default function SceneEnvironment({ scrollProgress = 0 }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.01
  })

  const fogColor = new THREE.Color('#0a0a1a')

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={[fogColor, 8, 25]} />

      <ambientLight intensity={0.15} />

      <Stars
        radius={50}
        depth={50}
        count={1500}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      <pointLight position={[0, 10, 0]} intensity={0.3} color="#6366f1" />
      <pointLight position={[10, 0, 0]} intensity={0.2} color="#8b5cf6" />
      <pointLight position={[-10, 0, 0]} intensity={0.2} color="#06b6d4" />
    </group>
  )
}
