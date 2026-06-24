import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * HeroParticles
 *
 * Floating particles that create depth and atmosphere.
 * Responds to scroll with parallax movement.
 */

const PARTICLE_COUNT_DESKTOP = 300
const PARTICLE_COUNT_MOBILE = 80

export default function HeroParticles({ sectionProgress = 0, particleCount = PARTICLE_COUNT_DESKTOP }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const count = particleCount || PARTICLE_COUNT_DESKTOP
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
        scale: Math.random() * 0.03 + 0.01,
        speed: Math.random() * 0.3 + 0.1,
        offset: Math.random() * Math.PI * 2,
        brightness: Math.random(),
      })
    }
    return arr
  }, [particleCount])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    const scrollOffset = sectionProgress * 3

    particles.forEach((p, i) => {
      const y = p.y + Math.sin(t * p.speed + p.offset) * 0.5 - scrollOffset
      const x = p.x + Math.cos(t * p.speed * 0.5 + p.offset) * 0.3

      dummy.position.set(x, y, p.z)
      dummy.scale.setScalar(p.scale * (0.8 + Math.sin(t + p.offset) * 0.2))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const color = useMemo(() => new THREE.Color('#6366f1'), [])

  return (
    <instancedMesh ref={meshRef} args={[null, null, particles.length]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  )
}
