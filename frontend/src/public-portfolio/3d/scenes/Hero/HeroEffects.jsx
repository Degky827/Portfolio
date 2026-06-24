import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * HeroEffects
 *
 * Visual effects for the Hero scene:
 * - Floating geometric shapes in the background
 * - Animated grid lines
 * - Glow planes
 * All respond to scroll for parallax depth.
 */
export default function HeroEffects({ sectionProgress = 0, mouseRef }) {
  const groupRef = useRef()
  const shapesRef = useRef([])

  const shapes = useMemo(() => {
    const arr = []
    for (let i = 0; i < 12; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8 - 4,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.2 + 0.05,
        offset: Math.random() * Math.PI * 2,
        type: ['box', 'tetra', 'octa'][Math.floor(Math.random() * 3)],
      })
    }
    return arr
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const scrollOffset = sectionProgress * 2
    const mx = mouseRef?.current?.x || 0

    shapesRef.current.forEach((mesh, i) => {
      if (!mesh) return
      const s = shapes[i]
      mesh.position.y = s.position[1] + Math.sin(t * s.speed + s.offset) * 0.8 - scrollOffset
      mesh.position.x = s.position[0] + mx * 0.2
      mesh.rotation.x = t * s.speed * 0.5
      mesh.rotation.z = t * s.speed * 0.3
    })
  })

  const indigo = useMemo(() => new THREE.Color('#6366f1'), [])
  const cyan = useMemo(() => new THREE.Color('#22d3ee'), [])

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => { shapesRef.current[i] = el }}
          position={s.position}
          rotation={s.rotation}
          scale={s.scale}
        >
          {s.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
          {s.type === 'tetra' && <tetrahedronGeometry args={[1, 0]} />}
          {s.type === 'octa' && <octahedronGeometry args={[1, 0]} />}
          <meshStandardMaterial
            color={i % 2 === 0 ? indigo : cyan}
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}

      {/* Ground glow plane */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.03} />
      </mesh>
    </group>
  )
}
