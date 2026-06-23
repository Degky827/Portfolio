import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Torus } from '@react-three/drei'
import * as THREE from 'three'

/**
 * SkillsScene - Placeholder 3D scene for the Skills section.
 * Displays a floating torus with the section label.
 */
export default function SkillsScene({ sectionProgress = 0, isActive = false }) {
  const meshRef = useRef()

  const color = useMemo(() => new THREE.Color('#06b6d4'), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.3
    meshRef.current.rotation.y = t * 0.2
    const targetScale = isActive ? 1 + sectionProgress * 0.25 : 0.8
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    )
  })

  return (
    <group>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1}>
        <Torus
          ref={meshRef}
          args={[0.8, 0.3, 32, 64]}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.2}
            metalness={0.8}
          />
        </Torus>
      </Float>

      <Text
        position={[0, -2.2, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SKILLS
      </Text>

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, 2, 3]} intensity={0.5} color="#22d3ee" />
    </group>
  )
}
