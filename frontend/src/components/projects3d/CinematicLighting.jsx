import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TEAL = new THREE.Color('#06b6d4')
const PURPLE = new THREE.Color('#8b5cf6')
const INDIGO = new THREE.Color('#6366f1')
const CYAN = new THREE.Color('#22d3ee')
const WARM = new THREE.Color('#f59e0b')

export default function CinematicLighting({ isMobile }) {
  const keyLightRef = useRef()
  const rimLightRef = useRef()
  const fillLightRef = useRef()
  const accent1Ref = useRef()
  const accent2Ref = useRef()
  const spotRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (keyLightRef.current) {
      keyLightRef.current.intensity = 1.2 + Math.sin(t * 0.3) * 0.2
      keyLightRef.current.position.x = 5 + Math.sin(t * 0.15) * 1
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 0.8 + Math.sin(t * 0.4 + 1) * 0.15
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = 0.4 + Math.sin(t * 0.35 + 2) * 0.1
    }
    if (accent1Ref.current) {
      accent1Ref.current.intensity = 0.6 + Math.sin(t * 0.25 + 0.5) * 0.2
      accent1Ref.current.position.x = 4 + Math.cos(t * 0.2) * 2
      accent1Ref.current.position.z = -2 + Math.sin(t * 0.15) * 2
    }
    if (accent2Ref.current) {
      accent2Ref.current.intensity = 0.5 + Math.sin(t * 0.3 + 3) * 0.15
      accent2Ref.current.position.x = -4 + Math.sin(t * 0.18) * 2
    }
    if (spotRef.current) {
      spotRef.current.intensity = 1.5 + Math.sin(t * 0.2) * 0.3
    }
  })

  return (
    <group>
      {/* Ambient base */}
      <ambientLight intensity={0.12} color="#c7d2fe" />

      {/* Key light - main illumination */}
      <directionalLight
        ref={keyLightRef}
        position={[5, 8, 5]}
        intensity={1.2}
        color="#818cf8"
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Rim light - edge definition */}
      <pointLight
        ref={rimLightRef}
        position={[-6, 4, -4]}
        intensity={0.8}
        color={PURPLE}
        distance={20}
        decay={2}
      />

      {/* Fill light - shadow softening */}
      <pointLight
        ref={fillLightRef}
        position={[4, 1, 4]}
        intensity={0.4}
        color={CYAN}
        distance={15}
        decay={2}
      />

      {/* Accent lights - color pops */}
      <pointLight
        ref={accent1Ref}
        position={[4, 3, -2]}
        intensity={0.6}
        color={TEAL}
        distance={18}
        decay={2}
      />

      <pointLight
        ref={accent2Ref}
        position={[-4, 2, -3]}
        intensity={0.5}
        color={INDIGO}
        distance={16}
        decay={2}
      />

      {/* Top spot - dramatic overhead */}
      <spotLight
        ref={spotRef}
        position={[0, 12, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#a5b4fc"
        distance={25}
        decay={2}
        castShadow={!isMobile}
      />

      {/* Warm accent for depth */}
      {!isMobile && (
        <pointLight
          position={[0, -1, 5]}
          intensity={0.2}
          color={WARM}
          distance={10}
          decay={2}
        />
      )}

      {/* Bottom fill for under-lighting effect */}
      <pointLight
        position={[0, -3, 0]}
        intensity={0.15}
        color={PURPLE}
        distance={12}
        decay={2}
      />
    </group>
  )
}
