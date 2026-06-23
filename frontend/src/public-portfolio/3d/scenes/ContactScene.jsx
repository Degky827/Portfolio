import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Octahedron } from '@react-three/drei'
import * as THREE from 'three'

/**
 * ContactScene - Placeholder 3D scene for the Contact section.
 * Displays a floating octahedron with the section label.
 */
export default function ContactScene({ sectionProgress = 0, isActive = false }) {
  const meshRef = useRef()

  const color = useMemo(() => new THREE.Color('#10b981'), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.2
    meshRef.current.rotation.y = t * 0.3
    const targetScale = isActive ? 1 + sectionProgress * 0.2 : 0.8
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    )
  })

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <Octahedron
          ref={meshRef}
          args={[1]}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.2}
            metalness={0.7}
          />
        </Octahedron>
      </Float>

      <Text
        position={[0, -2.2, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        CONTACT
      </Text>

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color="#34d399" />
    </group>
  )
}
