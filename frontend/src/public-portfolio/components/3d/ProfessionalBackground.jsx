import { useMemo, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 40
const FLOAT_AMPLITUDE = 0.15
const FLOAT_SPEED = 0.3

function ParticleMesh({ position, geometry, color, opacity, metalness, roughness }) {
  return (
    <mesh
      position={position}
      castShadow={false}
      receiveShadow={false}
      geometry={geometry}
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

function GeometricShape({ position, scale, geometry: Geometry, color, opacity, metalness, roughness }) {
  const geometryElement = useMemo(() => {
    const args = Geometry === THREE.BoxGeometry ? [0.5, 0.5, 0.5] : [0.3, 0]
    if (Geometry === THREE.BoxGeometry) return <boxGeometry args={args} />
    if (Geometry === THREE.OctahedronGeometry) return <octahedronGeometry args={args} />
    if (Geometry === THREE.TetrahedronGeometry) return <tetrahedronGeometry args={args} />
    return <icosahedronGeometry args={args} />
  }, [Geometry])

  return (
    <mesh
      position={position}
      scale={scale}
      castShadow={false}
      receiveShadow={false}
    >
      {geometryElement}
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        transparent
        opacity={opacity}
        wireframe={false}
      />
    </mesh>
  )
}

function FloatingRing({ radius = 2, segments = 64, color, opacity }) {
  return (
    <mesh
      rotation={[Math.PI / 2, 0, 0]}
      castShadow={false}
      receiveShadow={false}
    >
      <torusGeometry args={[radius, 0.01, 8, segments]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
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
  const groupRef = useRef()

  const particleData = useMemo(() => {
    const data = []
    const geometries = [
      new THREE.OctahedronGeometry(0.08, 0),
      new THREE.TetrahedronGeometry(0.08, 0),
      new THREE.IcosahedronGeometry(0.06, 0),
      new THREE.BoxGeometry(0.06, 0.06, 0.06),
    ]
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 16
      )
      data.push({
        pos,
        origPos: pos.clone(),
        geometry: geometries[Math.floor(i / (PARTICLE_COUNT / geometries.length))],
        phase: Math.random() * Math.PI * 2,
        amplitude: FLOAT_AMPLITUDE * (0.5 + Math.random() * 0.5),
        speed: FLOAT_SPEED * (0.5 + Math.random() * 0.5),
        rotSpeed: (Math.random() - 0.5) * 0.2,
        rotOffset: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
      })
    }
    return data
  }, [])

  const shapesData = useMemo(() => {
    const positions = [
      new THREE.Vector3(-3, 1.5, -2), new THREE.Vector3(2, -0.5, -3),
      new THREE.Vector3(-2, -1.5, -4), new THREE.Vector3(3.5, 2, -2.5),
      new THREE.Vector3(-4, 0.5, -3.5), new THREE.Vector3(1, 2.5, -4),
    ]
    const geoms = [THREE.OctahedronGeometry, THREE.TetrahedronGeometry, THREE.IcosahedronGeometry, THREE.BoxGeometry, THREE.OctahedronGeometry, THREE.TetrahedronGeometry]
    const scales = [0.5, 0.4, 0.35, 0.3, 0.25, 0.2]
    return positions.map((pos, i) => ({
      pos,
      origPos: pos.clone(),
      geometry: geoms[i],
      scale: scales[i],
      rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15),
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.15 + Math.random() * 0.1,
    }))
  }, [])

  const ringsData = useMemo(() => {
    return [
      { radius: 2.2, segments: 48, rotSpeed: 0.02 + Math.random() * 0.03, pulsePhase: Math.random() * Math.PI * 2 },
      { radius: 3.5, segments: 48, rotSpeed: 0.02 + Math.random() * 0.03, pulsePhase: Math.random() * Math.PI * 2 },
      { radius: 4.8, segments: 48, rotSpeed: 0.02 + Math.random() * 0.03, pulsePhase: Math.random() * Math.PI * 2 },
    ]
  }, [])

  const ringRefs = useRef([])
  const shapeRefs = useRef([])
  const particleRefs = useRef([])

  const pColor = darkMode ? '#6366f1' : '#4f46e5'
  const sColor = darkMode ? '#818cf8' : '#6366f1'
  const pOpacity = darkMode ? 0.18 : 0.08
  const sOpacity = darkMode ? 0.15 : 0.06
  const pMetalness = darkMode ? 0.3 : 0.1
  const sMetalness = darkMode ? 0.4 : 0.2
  const pRoughness = darkMode ? 0.6 : 0.8
  const sRoughness = darkMode ? 0.5 : 0.7
  const ringOpacity = darkMode ? 0.08 : 0.04

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const delta = state.delta

    for (let i = 0; i < particleData.length; i++) {
      const p = particleData[i]
      const mesh = particleRefs.current[i]
      if (!mesh) continue
      const pos = p.pos
      pos.y = p.origPos.y + Math.sin(time * p.speed + p.phase) * p.amplitude
      pos.x = p.origPos.x + Math.cos(time * p.speed * 0.7 + p.phase) * p.amplitude * 0.5
      pos.z = p.origPos.z + Math.sin(time * p.speed * 0.5 + p.phase) * p.amplitude * 0.3
      pos.x = Math.max(-8, Math.min(8, pos.x))
      pos.y = Math.max(-5, Math.min(5, pos.y))
      pos.z = Math.max(-8, Math.min(8, pos.z))
      mesh.position.copy(pos)
      mesh.rotation.x += p.rotSpeed * delta * p.rotOffset.x
      mesh.rotation.y += p.rotSpeed * delta * 0.7 * p.rotOffset.y
      mesh.rotation.z += p.rotSpeed * delta * 0.3 * p.rotOffset.z
    }

    for (let i = 0; i < shapesData.length; i++) {
      const s = shapesData[i]
      const mesh = shapeRefs.current[i]
      if (!mesh) continue
      mesh.rotation.x += s.rotSpeed.x * delta
      mesh.rotation.y += s.rotSpeed.y * delta
      mesh.rotation.z += s.rotSpeed.z * delta
      mesh.position.y = s.origPos.y + Math.sin(time * s.floatSpeed + s.floatPhase) * 0.12
    }

    for (let i = 0; i < ringsData.length; i++) {
      const r = ringsData[i]
      const mesh = ringRefs.current[i]
      if (!mesh) continue
      mesh.rotation.y += r.rotSpeed * delta
      mesh.rotation.x += r.rotSpeed * 0.5 * delta
      const pulse = 1 + Math.sin(time * 0.5 + r.pulsePhase) * 0.05
      mesh.scale.setScalar(pulse)
    }
  })

  if (isMobile) {
    return (
      <group ref={groupRef}>
        <AmbientOrbs darkMode={darkMode} />
        <FloatingRing radius={1.8} segments={32} color={pColor} opacity={ringOpacity} />
        <FloatingRing radius={2.5} segments={32} color={pColor} opacity={ringOpacity} />
      </group>
    )
  }

  const setRingRef = useCallback((i) => (el) => { ringRefs.current[i] = el }, [])
  const setShapeRef = useCallback((i) => (el) => { shapeRefs.current[i] = el }, [])
  const setParticleRef = useCallback((i) => (el) => { particleRefs.current[i] = el }, [])

  return (
    <group ref={groupRef}>
      <AmbientOrbs darkMode={darkMode} />

      {ringsData.map((r, i) => (
        <group key={`ring-${i}`} ref={setRingRef(i)}>
          <FloatingRing
            radius={r.radius}
            segments={r.segments}
            color={pColor}
            opacity={ringOpacity}
          />
        </group>
      ))}

      {shapesData.map((s, i) => (
        <group key={`shape-${i}`} ref={setShapeRef(i)}>
          <GeometricShape
            position={s.pos}
            scale={s.scale}
            geometry={s.geometry}
            color={sColor}
            opacity={sOpacity}
            metalness={sMetalness}
            roughness={sRoughness}
          />
        </group>
      ))}

      {particleData.map((p, i) => (
        <group key={`particle-${i}`} ref={setParticleRef(i)}>
          <ParticleMesh
            position={p.pos}
            geometry={p.geometry}
            color={pColor}
            opacity={pOpacity}
            metalness={pMetalness}
            roughness={pRoughness}
          />
        </group>
      ))}
    </group>
  )
}