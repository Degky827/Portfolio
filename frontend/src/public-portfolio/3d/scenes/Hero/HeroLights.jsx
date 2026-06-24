import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * HeroLights
 *
 * Dedicated lighting rig for the Hero scene.
 * Creates depth, rim lighting, and cinematic feel.
 */
export default function HeroLights({ sectionProgress = 0 }) {
  const keyLightRef = useRef()
  const rimLightRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (keyLightRef.current) {
      keyLightRef.current.position.x = Math.sin(t * 0.3) * 2 + 3
      keyLightRef.current.position.y = Math.cos(t * 0.2) * 1 + 4
    }
    if (rimLightRef.current) {
      rimLightRef.current.position.x = Math.cos(t * 0.4) * 2 - 3
      rimLightRef.current.position.z = Math.sin(t * 0.3) * 2 - 2
    }
  })

  const fadeOut = useMemo(() => Math.max(0, 1 - sectionProgress * 2), [sectionProgress])

  return (
    <group>
      {/* Ambient fill */}
      <ambientLight intensity={0.12} color="#c7d2fe" />

      {/* Key light - warm indigo */}
      <directionalLight
        ref={keyLightRef}
        position={[3, 4, 5]}
        intensity={1.2 * fadeOut}
        color="#818cf8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      {/* Rim light - cyan accent */}
      <pointLight
        ref={rimLightRef}
        position={[-3, 2, -2]}
        intensity={0.8 * fadeOut}
        color="#22d3ee"
        distance={15}
      />

      {/* Fill light - soft violet */}
      <pointLight
        position={[0, -2, 4]}
        intensity={0.3 * fadeOut}
        color="#a78bfa"
        distance={12}
      />

      {/* Bottom accent - teal glow */}
      <pointLight
        position={[0, -3, 0]}
        intensity={0.4 * fadeOut}
        color="#14b8a6"
        distance={10}
      />
    </group>
  )
}
