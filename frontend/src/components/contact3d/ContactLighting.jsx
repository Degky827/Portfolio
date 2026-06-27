import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CYAN = new THREE.Color('#06b6d4')
const CYAN_LIGHT = new THREE.Color('#22d3ee')
const CYAN_DIM = new THREE.Color('#0891b2')

export default function ContactLighting({ isMobile }) {
  const keyLightRef = useRef()
  const rimLightRef = useRef()
  const accent1Ref = useRef()
  const accent2Ref = useRef()
  const spotRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (keyLightRef.current) {
      keyLightRef.current.intensity = 1.0 + Math.sin(t * 0.3) * 0.15
      keyLightRef.current.position.x = 5 + Math.sin(t * 0.15) * 1.5
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 0.7 + Math.sin(t * 0.4 + 1) * 0.12
    }
    if (accent1Ref.current) {
      accent1Ref.current.intensity = 0.5 + Math.sin(t * 0.25 + 0.5) * 0.15
      accent1Ref.current.position.x = 4 + Math.cos(t * 0.2) * 2
      accent1Ref.current.position.z = -3 + Math.sin(t * 0.15) * 2
    }
    if (accent2Ref.current) {
      accent2Ref.current.intensity = 0.4 + Math.sin(t * 0.3 + 3) * 0.12
      accent2Ref.current.position.x = -4 + Math.sin(t * 0.18) * 2
    }
    if (spotRef.current) {
      spotRef.current.intensity = 1.2 + Math.sin(t * 0.2) * 0.2
    }
  })

  return (
    <group>
      <ambientLight intensity={0.1} color="#cffafe" />

      <directionalLight
        ref={keyLightRef}
        position={[5, 8, 5]}
        intensity={1.0}
        color="#22d3ee"
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

      <pointLight
        ref={rimLightRef}
        position={[-6, 4, -4]}
        intensity={0.7}
        color={CYAN_LIGHT}
        distance={20}
        decay={2}
      />

      <pointLight
        ref={accent1Ref}
        position={[4, 3, -3]}
        intensity={0.5}
        color={CYAN}
        distance={18}
        decay={2}
      />

      <pointLight
        ref={accent2Ref}
        position={[-4, 2, -4]}
        intensity={0.4}
        color={CYAN_DIM}
        distance={16}
        decay={2}
      />

      <spotLight
        ref={spotRef}
        position={[0, 12, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.2}
        color="#67e8f9"
        distance={25}
        decay={2}
        castShadow={!isMobile}
      />

      {!isMobile && (
        <pointLight
          position={[0, -1, 5]}
          intensity={0.15}
          color={CYAN}
          distance={10}
          decay={2}
        />
      )}

      <pointLight
        position={[0, -3, 0]}
        intensity={0.12}
        color={CYAN_DIM}
        distance={12}
        decay={2}
      />
    </group>
  )
}
