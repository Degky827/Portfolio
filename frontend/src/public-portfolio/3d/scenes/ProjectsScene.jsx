import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'

/**
 * ProjectsScene - Placeholder 3D scene for the Projects section.
 * Displays a floating icosahedron with the section label.
 */
export default function ProjectsScene({ sectionProgress = 0, isActive = false }) {
  const meshRef = useRef()

  const color = useMemo(() => new THREE.Color('#f59e0b'), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.25
    meshRef.current.rotation.y = t * 0.15
    const targetScale = isActive ? 1 + sectionProgress * 0.2 : 0.8
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    )
  })

  return (
    <group>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
        <Icosahedron
          ref={meshRef}
          args={[1, 1]}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.6}
            wireframe
          />
        </Icosahedron>
      </Float>

      <Text
        position={[0, -2.2, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        PROJECTS
      </Text>

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[3, 2, -3]} intensity={0.5} color="#fbbf24" />
    </group>
  )
}
