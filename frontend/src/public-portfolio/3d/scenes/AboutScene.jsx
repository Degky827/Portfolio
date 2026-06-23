import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * AboutScene - Placeholder 3D scene for the About section.
 * Displays a rotating rounded box with the section label.
 */
export default function AboutScene({ sectionProgress = 0, isActive = false }) {
  const meshRef = useRef()

  const color = useMemo(() => new THREE.Color('#8b5cf6'), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.2
    meshRef.current.rotation.z = t * 0.15
    const targetScale = isActive ? 1 + sectionProgress * 0.2 : 0.8
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    )
  })

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <RoundedBox
          ref={meshRef}
          args={[1.5, 1.5, 1.5]}
          radius={0.15}
          smoothness={4}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.7}
          />
        </RoundedBox>
      </Float>

      <Text
        position={[0, -2.2, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        ABOUT
      </Text>

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[3, -2, 3]} intensity={0.5} color="#a78bfa" />
    </group>
  )
}
