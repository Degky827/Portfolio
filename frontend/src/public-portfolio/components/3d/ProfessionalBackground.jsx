import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 60
const FLOAT_AMPLITUDE = 0.15
const FLOAT_SPEED = 0.3

function Particle({ darkMode, index, total, initialPosition, initialVelocity }) {
  const ref = useRef()
  const phase = useRef(Math.random() * Math.PI * 2)
  const amplitude = useRef(FLOAT_AMPLITUDE * (0.5 + Math.random() * 0.5))
  const speed = useRef(FLOAT_SPEED * (0.5 + Math.random() * 0.5))
  const rotationSpeed = useRef((Math.random() - 0.5) * 0.2)

  const color = darkMode
    ? new THREE.Color('#6366f1')
    : new THREE.Color('#3b82f6')

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.getElapsedTime()

    const pos = initialPosition.current
    const vel = initialVelocity.current

    pos.y += Math.sin(time * speed.current + phase.current) * amplitude.current
    pos.x += Math.cos(time * speed.current * 0.7 + phase.current) * amplitude.current * 0.5
    pos.z += Math.sin(time * speed.current * 0.5 + phase.current) * amplitude.current * 0.3

    ref.current.rotation.x += rotationSpeed.current * state.delta
    ref.current.rotation.y += rotationSpeed.current * state.delta * 0.7
    ref.current.rotation.z += rotationSpeed.current * state.delta * 0.3

    pos.x = Math.max(-8, Math.min(8, pos.x))
    pos.y = Math.max(-5, Math.min(5, pos.y))
    pos.z = Math.max(-8, Math.min(8, pos.z))
  })

  const geometries = useMemo(() => [
    new THREE.OctahedronGeometry(0.08, 0),
    new THREE.TetrahedronGeometry(0.08, 0),
    new THREE.IcosahedronGeometry(0.06, 0),
    new THREE.BoxGeometry(0.06, 0.06, 0.06),
  ], [])

  const selectedGeometry = geometries[Math.floor(index / (total / geometries.length))]

  return (
    <mesh
      ref={ref}
      position={initialPosition.current}
      castShadow={false}
      receiveShadow={false}
      geometry={selectedGeometry}
    >
      <meshStandardMaterial
        color={color}
        metalness={darkMode ? 0.3 : 0.1}
        roughness={darkMode ? 0.6 : 0.8}
        transparent
        opacity={darkMode ? 0.4 : 0.25}
      />
    </mesh>
  )
}

function GeometricShape({ darkMode, position, geometry: Geometry, scale = 1 }) {
  const ref = useRef()
  const rotationSpeed = useRef({
    x: (Math.random() - 0.5) * 0.15,
    y: (Math.random() - 0.5) * 0.15,
    z: (Math.random() - 0.5) * 0.15,
  })
  const floatPhase = useRef(Math.random() * Math.PI * 2)
  const floatSpeed = useRef(0.15 + Math.random() * 0.1)

  const color = darkMode
    ? new THREE.Color('#818cf8')
    : new THREE.Color('#6366f1')

  const geometryElement = useMemo(() => {
    const args = Geometry === THREE.BoxGeometry ? [0.5, 0.5, 0.5] : [0.3, 0]
    if (Geometry === THREE.BoxGeometry) return <boxGeometry args={args} />
    if (Geometry === THREE.OctahedronGeometry) return <octahedronGeometry args={args} />
    if (Geometry === THREE.TetrahedronGeometry) return <tetrahedronGeometry args={args} />
    return <icosahedronGeometry args={args} />
  }, [Geometry])

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.getElapsedTime()

    ref.current.rotation.x += rotationSpeed.current.x * state.delta
    ref.current.rotation.y += rotationSpeed.current.y * state.delta
    ref.current.rotation.z += rotationSpeed.current.z * state.delta

    const floatOffset = Math.sin(time * floatSpeed.current + floatPhase.current) * 0.12
    ref.current.position.y = position.y + floatOffset
  })

  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale}
      castShadow={false}
      receiveShadow={false}
    >
      {geometryElement}
      <meshStandardMaterial
        color={color}
        metalness={darkMode ? 0.4 : 0.2}
        roughness={darkMode ? 0.5 : 0.7}
        transparent
        opacity={darkMode ? 0.35 : 0.2}
        wireframe={false}
      />
    </mesh>
  )
}

function FloatingRing({ darkMode, radius = 2, segments = 64 }) {
  const ref = useRef()
  const rotationSpeed = useRef(0.02 + Math.random() * 0.03)
  const pulsePhase = useRef(Math.random() * Math.PI * 2)

  const color = darkMode
    ? new THREE.Color('#6366f1')
    : new THREE.Color('#3b82f6')

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.getElapsedTime()

    ref.current.rotation.y += rotationSpeed.current * state.delta
    ref.current.rotation.x += rotationSpeed.current * 0.5 * state.delta

    const pulse = 1 + Math.sin(time * 0.5 + pulsePhase.current) * 0.05
    ref.current.scale.setScalar(pulse)
  })

  return (
    <mesh
      ref={ref}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow={false}
      receiveShadow={false}
    >
      <torusGeometry args={[radius, 0.01, 8, segments]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={darkMode ? 0.15 : 0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function AmbientOrbs({ darkMode }) {
  const orbs = useMemo(() => [
    { position: [-4, 2, -3], radius: 1.5, opacity: darkMode ? 0.08 : 0.04 },
    { position: [3, -1, -4], radius: 1.2, opacity: darkMode ? 0.06 : 0.03 },
    { position: [0, 3, -5], radius: 2, opacity: darkMode ? 0.05 : 0.02 },
  ], [darkMode])

  return (
    <group>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position} castShadow={false} receiveShadow={false}>
          <sphereGeometry args={[orb.radius, 32, 32]} />
          <meshBasicMaterial
            color={darkMode ? '#818cf8' : '#6366f1'}
            transparent
            opacity={orb.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ProfessionalBackground({ darkMode, isMobile }) {
  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      index: i,
      total: PARTICLE_COUNT,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 16
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ),
    })), [])

  const shapes = useMemo(() => [
    { position: new THREE.Vector3(-3, 1.5, -2), geometry: THREE.OctahedronGeometry, scale: 0.5 },
    { position: new THREE.Vector3(2, -0.5, -3), geometry: THREE.TetrahedronGeometry, scale: 0.4 },
    { position: new THREE.Vector3(-2, -1.5, -4), geometry: THREE.IcosahedronGeometry, scale: 0.35 },
    { position: new THREE.Vector3(3.5, 2, -2.5), geometry: THREE.BoxGeometry, scale: 0.3 },
    { position: new THREE.Vector3(-4, 0.5, -3.5), geometry: THREE.OctahedronGeometry, scale: 0.25 },
    { position: new THREE.Vector3(1, 2.5, -4), geometry: THREE.TetrahedronGeometry, scale: 0.2 },
  ], [])

  if (isMobile) {
    return (
      <group>
        <AmbientOrbs darkMode={darkMode} />
        <FloatingRing darkMode={darkMode} radius={1.8} segments={32} />
        <FloatingRing darkMode={darkMode} radius={2.5} segments={32} />
      </group>
    )
  }

  return (
    <group>
      <AmbientOrbs darkMode={darkMode} />

      <FloatingRing darkMode={darkMode} radius={2.2} segments={48} />
      <FloatingRing darkMode={darkMode} radius={3.5} segments={48} />
      <FloatingRing darkMode={darkMode} radius={4.8} segments={48} />

      {shapes.map((shape, i) => (
        <GeometricShape
          key={i}
          darkMode={darkMode}
          position={shape.position}
          geometry={shape.geometry}
          scale={shape.scale}
        />
      ))}

      {particles.map((p) => (
        <Particle
          key={p.index}
          darkMode={darkMode}
          index={p.index}
          total={p.total}
          initialPosition={p.position}
          initialVelocity={p.velocity}
        />
      ))}
    </group>
  )
}