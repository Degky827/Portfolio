import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GlobeWireframe({ radius = 2 }) {
  const meshRef = useRef()
  const materialRef = useRef()

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(radius, 4), [radius])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08
      meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.1
    }
    if (materialRef.current) {
      materialRef.current.opacity = 0.35 + Math.sin(t * 0.4) * 0.08
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        wireframe
        color="#06b6d4"
        transparent
        opacity={0.35}
        emissive="#06b6d4"
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

function GlobeCore({ radius = 2 }) {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius - 0.05, 32, 32]} />
      <meshStandardMaterial
        color="#06b6d4"
        transparent
        opacity={0.04}
        emissive="#0891b2"
        emissiveIntensity={0.3}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}

function GlobeGlow({ radius = 2 }) {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1.0 + Math.sin(t * 0.5) * 0.02)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius + 0.15, 32, 32]} />
      <meshBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.06}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

function OrbitingRing({ radius = 2.8, tubeRadius = 0.015, color = '#06b6d4', speed = 0.3, tiltX = 0, tiltZ = 0, opacity = 0.6 }) {
  const meshRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * speed
      meshRef.current.rotation.x = tiltX
      meshRef.current.rotation.z = tiltZ
    }
    if (materialRef.current) {
      materialRef.current.opacity = opacity * (0.7 + Math.sin(t * 0.8 + speed * 5) * 0.3)
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, tubeRadius, 8, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={opacity}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  )
}

function OrbitingRibbon({ radius = 2.5, color = '#8b5cf6', speed = 0.2, tiltX = 0.3, tiltZ = 0.2 }) {
  const meshRef = useRef()
  const materialRef = useRef()

  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.85, 0, Math.PI * 2, false, 0)
    const points = curve.getPoints(100)
    const shape = new THREE.Shape()
    shape.moveTo(-0.008, -0.003)
    shape.lineTo(0.008, -0.003)
    shape.lineTo(0.008, 0.003)
    shape.lineTo(-0.008, 0.003)
    shape.closePath()
    const extrudeSettings = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, p.y, 0)), true),
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [radius])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * speed
      meshRef.current.rotation.x = tiltX + Math.sin(t * 0.1) * 0.05
      meshRef.current.rotation.z = tiltZ
    }
    if (materialRef.current) {
      materialRef.current.opacity = 0.5 + Math.sin(t * 0.6) * 0.15
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

function FloatingDots({ count = 50, radius = 3.5 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.acos(2 * Math.random() - 1),
      r: radius + (Math.random() - 0.5) * 1.2,
      speed: 0.1 + Math.random() * 0.15,
      offset: Math.random() * Math.PI * 2,
      scale: 0.01 + Math.random() * 0.02,
    }))
  }, [count, radius])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!meshRef.current) return

    particles.forEach((p, i) => {
      const angle = t * p.speed + p.offset
      const x = p.r * Math.sin(p.phi + angle * 0.3) * Math.cos(p.theta + angle)
      const y = p.r * Math.sin(p.phi + angle * 0.3) * Math.sin(p.theta + angle)
      const z = p.r * Math.cos(p.phi + angle * 0.3)
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(p.scale * (0.8 + Math.sin(t * 2 + p.offset) * 0.4))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
    </instancedMesh>
  )
}

export default function Globe3D({ isMobile }) {
  return (
    <group>
      <GlobeWireframe radius={isMobile ? 1.6 : 2} />
      <GlobeCore radius={isMobile ? 1.6 : 2} />
      <GlobeGlow radius={isMobile ? 1.6 : 2} />

      <OrbitingRing
        radius={isMobile ? 2.2 : 2.8}
        tubeRadius={0.012}
        color="#06b6d4"
        speed={0.25}
        tiltX={0.4}
        tiltZ={0.1}
        opacity={0.7}
      />
      <OrbitingRing
        radius={isMobile ? 2.0 : 2.6}
        tubeRadius={0.008}
        color="#22d3ee"
        speed={-0.18}
        tiltX={-0.3}
        tiltZ={0.5}
        opacity={0.5}
      />
      <OrbitingRing
        radius={isMobile ? 2.4 : 3.0}
        tubeRadius={0.01}
        color="#8b5cf6"
        speed={0.15}
        tiltX={0.6}
        tiltZ={-0.2}
        opacity={0.45}
      />

      <OrbitingRibbon
        radius={isMobile ? 1.9 : 2.5}
        color="#06b6d4"
        speed={0.12}
        tiltX={0.35}
        tiltZ={0.15}
      />
      <OrbitingRibbon
        radius={isMobile ? 2.1 : 2.7}
        color="#8b5cf6"
        speed={-0.1}
        tiltX={-0.25}
        tiltZ={0.4}
      />

      <FloatingDots key={isMobile ? 'mobile' : 'desktop'} count={isMobile ? 30 : 50} radius={isMobile ? 2.2 : 3.5} />

      <ambientLight intensity={0.1} color="#cffafe" />
      <pointLight position={[5, 3, 4]} intensity={1.0} color="#06b6d4" distance={20} decay={2} />
      <pointLight position={[-4, -2, 3]} intensity={0.4} color="#8b5cf6" distance={15} decay={2} />
      <directionalLight position={[3, 5, 5]} intensity={0.4} color="#67e8f9" />
    </group>
  )
}
