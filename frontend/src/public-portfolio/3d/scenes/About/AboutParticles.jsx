import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 120

/**
 * AboutParticles
 *
 * Ambient floating dust/light particles for the lab atmosphere.
 * Uses InstancedMesh for performance.
 */
export default function AboutParticles() {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const theta = Math.random() * Math.PI * 2
      const radius = 1 + Math.random() * 5
      return {
        x: Math.cos(theta) * radius,
        y: Math.random() * 5.5,
        z: Math.sin(theta) * radius - 1,
        scale: 0.01 + Math.random() * 0.025,
        speed: 0.1 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        brightness: 0.3 + Math.random() * 0.7,
        drift: (Math.random() - 0.5) * 0.2,
      }
    })
  }, [])

  const color = useMemo(() => new THREE.Color('#8b5cf6'), [])
  const cyanColor = useMemo(() => new THREE.Color('#22d3ee'), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]
      const floatY = Math.sin(t * p.speed + p.offset) * 0.4
      const driftX = Math.sin(t * p.speed * 0.5 + p.offset) * p.drift

      dummy.position.set(
        p.x + driftX,
        p.y + floatY,
        p.z
      )

      const flicker = p.brightness + Math.sin(t * 2 + p.offset) * 0.15
      dummy.scale.setScalar(p.scale * flicker)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.6}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}
