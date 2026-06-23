import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Dodecahedron } from '@react-three/drei'
import * as THREE from 'three'

/**
 * FooterScene - Placeholder 3D scene for the Footer ending.
 * Displays a floating dodecahedron with the section label.
 */
export default function FooterScene({ sectionProgress = 0, isActive = false }) {
  const meshRef = useRef()

  const color = useMemo(() => new THREE.Color('#ec4899'), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.15
    meshRef.current.rotation.y = t * 0.25
    const targetScale = isActive ? 1 + sectionProgress * 0.15 : 0.8
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    )
  })

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        <Dodecahedron
          ref={meshRef}
          args={[1]}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.6}
          />
        </Dodecahedron>
      </Float>

      <Text
        position={[0, -2.2, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        FOOTER
      </Text>

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[0, 3, -3]} intensity={0.5} color="#f472b6" />
    </group>
  )
}
