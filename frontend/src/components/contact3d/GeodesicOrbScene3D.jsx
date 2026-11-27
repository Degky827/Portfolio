import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Geodesic Wireframe Lattice Cage + Shiny Chrome Ball Joints
function GeodesicCage({ radius = 1.96 }) {
  const groupRef = useRef()
  // Detail 2 generates the perfect hexagonal/pentagonal geodesic tessellation matching the reference
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(radius, 2), [radius])

  // Extract unique vertices for ball joints
  const vertices = useMemo(() => {
    const pos = geometry.attributes.position
    const list = []
    const seen = new Set()
    for (let i = 0; i < pos.count; i++) {
      const x = Math.round(pos.getX(i) * 100) / 100
      const y = Math.round(pos.getY(i) * 100) / 100
      const z = Math.round(pos.getZ(i) * 100) / 100
      const key = `${x},${y},${z}`
      if (!seen.has(key)) {
        seen.add(key)
        list.push([pos.getX(i), pos.getY(i), pos.getZ(i)])
      }
    }
    return list
  }, [geometry])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12
      groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      {/* Geodesic Wireframe Lattice Struts (Bright Polished Steel) */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          wireframe
          color="#cbd5e1"
          roughness={0.12}
          metalness={0.96}
          wireframeLinewidth={2.5}
        />
      </mesh>

      {/* Chrome Ball Joints at every Vertex */}
      {vertices.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.072, 16, 16]} />
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.98}
            roughness={0.06}
          />
        </mesh>
      ))}
    </group>
  )
}

// Solid Glossy Pearl White Core Sphere
function PearlCoreSphere({ radius = 1.88 }) {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.09
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshPhysicalMaterial
        color="#ffffff"
        roughness={0.18}
        metalness={0.05}
        clearcoat={0.9}
        clearcoatRoughness={0.1}
        reflectivity={0.9}
      />
    </mesh>
  )
}

// Orbiting Thin Chrome Rings with Fixed Orbital Radii
function OrbitingChromeRings() {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.1
      ring1Ref.current.rotation.y = t * 0.06
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.08
      ring2Ref.current.rotation.x = t * 0.07
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = -t * 0.11
    }
  })

  return (
    <>
      {/* Diagonal Elliptical Orbit 1 */}
      <group ref={ring1Ref} rotation={[Math.PI / 3.2, Math.PI / 5, 0]}>
        <mesh>
          <torusGeometry args={[2.55, 0.03, 16, 120]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>

      {/* Opposing Diagonal Orbit 2 */}
      <group ref={ring2Ref} rotation={[-Math.PI / 2.8, -Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[2.65, 0.028, 16, 120]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>

      {/* Equatorial Orbit 3 */}
      <group ref={ring3Ref} rotation={[Math.PI / 10, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.45, 0.026, 16, 120]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </>
  )
}

// Floating Chrome Spheres (Kept within visible camera bounds so they never clip)
function FloatingChromeSpheres() {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      {/* Upper left floating chrome ball */}
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh position={[-2.4, 1.4, 0.6]}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.99} roughness={0.04} />
        </mesh>
      </Float>

      {/* Mid left floating chrome ball */}
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[-1.9, -0.4, 1.1]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.99} roughness={0.04} />
        </mesh>
      </Float>

      {/* Upper right floating chrome ball */}
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh position={[2.3, 1.6, -0.3]}>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.99} roughness={0.04} />
        </mesh>
      </Float>

      {/* Lower right floating chrome ball */}
      <Float speed={2.0} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[2.35, -0.5, 0.7]}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.99} roughness={0.04} />
        </mesh>
      </Float>
    </group>
  )
}

// Tiered Studio Pedestal Base Matching Reference Image
function PedestalStage() {
  return (
    <group position={[0, -2.15, 0]}>
      {/* Top Black Accent Washer */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.05, 64]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Middle Beveled Brushed Metal Disc */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[1.65, 1.7, 0.12, 64]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.12} />
      </mesh>

      {/* Bottom Pure Clay White Stage Platform */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[2.05, 2.15, 0.2, 64]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.35} />
      </mesh>

      {/* Soft Contact Shadow */}
      <mesh position={[0, -0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 64]} />
        <meshBasicMaterial color="#64748b" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export default function GeodesicOrbScene3D({ className = '' }) {
  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0.15, 7.6], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        {/* Studio Studio HDR / Environment Lighting for Crisp Chrome Reflections */}
        <ambientLight intensity={1.1} color="#ffffff" />
        <directionalLight position={[6, 9, 7]} intensity={2.4} color="#ffffff" castShadow />
        <directionalLight position={[-7, 5, 4]} intensity={1.4} color="#f8fafc" />
        <directionalLight position={[0, -3, 5]} intensity={0.9} color="#e2e8f0" />
        <pointLight position={[0, 4, -4]} intensity={1.0} color="#ffffff" />

        {/* Complete Metallic Geodesic Assembly */}
        <group position={[0, 0.3, 0]}>
          <PearlCoreSphere />
          <GeodesicCage />
          <OrbitingChromeRings />
          <FloatingChromeSpheres />
          <PedestalStage />
        </group>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minPolarAngle={Math.PI / 3}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
