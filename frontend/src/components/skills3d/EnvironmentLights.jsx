import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PURPLE = new THREE.Color('#8b5cf6')
const CYAN = new THREE.Color('#22d3ee')
const INDIGO = new THREE.Color('#6366f1')

export default function EnvironmentLights() {
  const rimLightRef = useRef()
  const accentLight1Ref = useRef()
  const accentLight2Ref = useRef()
  const accentLight3Ref = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (rimLightRef.current) {
      rimLightRef.current.intensity = 1.0 + Math.sin(time * 0.3) * 0.3
    }
    if (accentLight1Ref.current) {
      accentLight1Ref.current.intensity = 0.6 + Math.sin(time * 0.4 + 1.0) * 0.2
    }
    if (accentLight2Ref.current) {
      accentLight2Ref.current.intensity = 0.5 + Math.sin(time * 0.35 + 2.0) * 0.15
    }
    if (accentLight3Ref.current) {
      accentLight3Ref.current.intensity = 0.4 + Math.sin(time * 0.25 + 3.5) * 0.15
    }
  })

  return (
    <group>
      <ambientLight intensity={0.15} color="#c7d2fe" />

      <directionalLight
        position={[5, 8, 6]}
        intensity={0.9}
        color="#818cf8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={25}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      <pointLight
        ref={rimLightRef}
        position={[-5, 3, -3]}
        intensity={1.0}
        color={PURPLE}
        distance={18}
        decay={2}
      />

      <pointLight
        ref={accentLight1Ref}
        position={[5, 2, -2]}
        intensity={0.6}
        color={CYAN}
        distance={15}
        decay={2}
      />

      <pointLight
        ref={accentLight2Ref}
        position={[0, 6, -4]}
        intensity={0.5}
        color={INDIGO}
        distance={12}
        decay={2}
      />

      <pointLight
        ref={accentLight3Ref}
        position={[-3, 1, 3]}
        intensity={0.4}
        color={PURPLE}
        distance={10}
        decay={2}
      />

      <pointLight
        position={[3, -1, 2]}
        intensity={0.25}
        color={CYAN}
        distance={8}
        decay={2}
      />
    </group>
  )
}
