import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * HeroScene - Placeholder 3D scene for the Hero section.
 * Displays a floating distorted sphere with the section label.
 */
export default function HeroScene({ sectionProgress = 0, isActive = false }) {
  const meshRef = useRef()
  const textRef = useRef()

  const color = useMemo(() => new THREE.Color('#6366f1'), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.15
    meshRef.current.rotation.y = t * 0.2
    const scale = isActive ? 1 + sectionProgress * 0.3 : 0.8
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.05)
  })

  return (
    <group>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <Text
        ref={textRef}
        position={[0, -2.2, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        HERO
      </Text>

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, 2, -3]} intensity={0.5} color="#818cf8" />
    </group>
  )
}
