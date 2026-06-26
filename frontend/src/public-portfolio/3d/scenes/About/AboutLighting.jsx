import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * AboutLighting
 *
 * Lab-style lighting rig for the About scene.
 * Key light, rim lights, fill lights, with subtle animation.
 */
export default function AboutLighting() {
  const keyLightRef = useRef()
  const rimLeftRef = useRef()
  const rimRightRef = useRef()

  const colors = useMemo(() => ({
    purple: new THREE.Color('#8b5cf6'),
    cyan: new THREE.Color('#22d3ee'),
    indigo: new THREE.Color('#6366f1'),
    violet: new THREE.Color('#a78bfa'),
    warm: new THREE.Color('#818cf8'),
  }), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (keyLightRef.current) {
      keyLightRef.current.position.x = 3 + Math.sin(t * 0.3) * 0.5
      keyLightRef.current.position.z = 4 + Math.cos(t * 0.3) * 0.3
    }
    if (rimLeftRef.current) {
      rimLeftRef.current.intensity = 1.0 + Math.sin(t * 0.7) * 0.3
    }
    if (rimRightRef.current) {
      rimRightRef.current.intensity = 0.8 + Math.sin(t * 0.5 + 1) * 0.2
    }
  })

  return (
    <group>
      {/* Ambient fill - very low for dramatic shadows */}
      <ambientLight intensity={0.06} color="#c7d2fe" />

      {/* Key light - warm indigo from above-front */}
      <directionalLight
        ref={keyLightRef}
        position={[3, 5, 4]}
        intensity={0.7}
        color={colors.warm}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* Rim light - left purple */}
      <pointLight
        ref={rimLeftRef}
        position={[-6, 3, -2]}
        intensity={1.0}
        color={colors.purple}
        distance={18}
        decay={2}
      />

      {/* Rim light - right cyan */}
      <pointLight
        ref={rimRightRef}
        position={[6, 2, -1]}
        intensity={0.8}
        color={colors.cyan}
        distance={15}
        decay={2}
      />

      {/* Fill light - violet from behind */}
      <pointLight
        position={[0, 3, -6]}
        intensity={0.5}
        color={colors.violet}
        distance={12}
        decay={2}
      />

      {/* Bottom accent - indigo uplight */}
      <pointLight
        position={[0, 0.5, 2]}
        intensity={0.4}
        color={colors.indigo}
        distance={8}
        decay={2}
      />

      {/* Back wall wash - subtle purple */}
      <pointLight
        position={[0, 2, -4.5]}
        intensity={0.3}
        color={colors.purple}
        distance={10}
        decay={2}
      />

      {/* Floor bounce - very subtle */}
      <pointLight
        position={[0, -0.5, 0]}
        intensity={0.15}
        color={colors.violet}
        distance={6}
        decay={2}
      />
    </group>
  )
}
