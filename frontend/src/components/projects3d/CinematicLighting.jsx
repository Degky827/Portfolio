import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PURPLE = new THREE.Color('#8b5cf6')
const INDIGO = new THREE.Color('#6366f1')
const LAVENDER = new THREE.Color('#a78bfa')

export default function CinematicLighting({ isMobile }) {
  const keyLightRef = useRef()
  const rimLightRef = useRef()
  const fillLightRef = useRef()
  const accent1Ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (keyLightRef.current) {
      keyLightRef.current.intensity = 0.9 + Math.sin(t * 0.3) * 0.15
      keyLightRef.current.position.x = 4 + Math.sin(t * 0.15) * 0.8
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 0.6 + Math.sin(t * 0.4 + 1) * 0.1
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = 0.35 + Math.sin(t * 0.35 + 2) * 0.08
    }
    if (accent1Ref.current) {
      accent1Ref.current.intensity = 0.45 + Math.sin(t * 0.25 + 0.5) * 0.1
    }
  })

  return (
    <group>
      {/* Ambient base */}
      <ambientLight intensity={0.15} color="#c7d2fe" />

      {/* Key light */}
      <directionalLight
        ref={keyLightRef}
        position={[4, 6, 4]}
        intensity={0.9}
        color="#818cf8"
      />

      {/* Rim light */}
      <pointLight
        ref={rimLightRef}
        position={[-5, 3, -3]}
        intensity={0.6}
        color={PURPLE}
        distance={18}
        decay={2}
      />

      {/* Fill light */}
      <pointLight
        ref={fillLightRef}
        position={[3, 1, 3]}
        intensity={0.35}
        color={LAVENDER}
        distance={14}
        decay={2}
      />

      {/* Accent light */}
      <pointLight
        ref={accent1Ref}
        position={[3, 2, -2]}
        intensity={0.45}
        color={INDIGO}
        distance={15}
        decay={2}
      />
    </group>
  )
}
