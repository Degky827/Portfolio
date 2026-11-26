import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Text } from '@react-three/drei'

// ─── Floating 3D Title: "What am I know ?" ───────────────────
function FloatingTitle3D({ darkMode = true }) {
  const titleRef = useRef()

  useFrame((state) => {
    if (!titleRef.current) return
    const t = state.clock.getElapsedTime()
    titleRef.current.position.y = 4.3 + Math.sin(t * 1.5) * 0.08
  })

  return (
    <group ref={titleRef} position={[0, 4.3, 0]}>
      {/* 3D Floating Title with exact capitalization requested */}
      <Text
        text="What am I know ?"
        fontSize={0.65}
        letterSpacing={0.05}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={darkMode ? '#050B14' : '#E2E8F0'}
      >
        <meshStandardMaterial
          color={darkMode ? '#FFFFFF' : '#0F172A'}
          emissive={darkMode ? '#06B6D4' : '#000000'}
          emissiveIntensity={darkMode ? 0.3 : 0}
          roughness={0.25}
          metalness={0.7}
        />
      </Text>

      {/* Modern under-accent line */}
      <mesh position={[0, -0.48, 0]}>
        <boxGeometry args={[3.6, 0.035, 0.035]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[0, -0.48, 0.03]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  )
}

// ─── 3D Gear Mesh Helper ────────────────────────────────────
function Gear3D({ radius = 0.22, thickness = 0.06, teeth = 8, color = '#06B6D4', speed = 1 }) {
  const gearRef = useRef()

  useFrame((_, delta) => {
    if (gearRef.current) {
      gearRef.current.rotation.z += delta * speed
    }
  })

  return (
    <group ref={gearRef}>
      {/* Central ring & cylinder */}
      <mesh>
        <cylinderGeometry args={[radius, radius, thickness, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[radius * 0.85, thickness * 0.45, 8, 20]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Teeth around perimeter */}
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i * Math.PI * 2) / teeth
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[radius * 0.35, radius * 0.3, thickness]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.4}
              metalness={0.7}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── Left Placard: "API Requests" with >>> Chevrons ─────────
function ApiRequestsPlacard() {
  const chevronsRef = useRef()

  useFrame((state) => {
    if (!chevronsRef.current) return
    const t = (state.clock.getElapsedTime() * 3) % 1
    chevronsRef.current.position.x = 0.3 + t * 0.15
  })

  return (
    <group position={[-4.1, 1.85, 0.2]}>
      {/* White rounded card with soft depth */}
      <mesh castShadow>
        <boxGeometry args={[1.35, 1.35, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>
      {/* Card Border */}
      <mesh position={[0, 0, 0.041]}>
        <ringGeometry args={[0.62, 0.65, 32]} />
        <meshBasicMaterial color="#E2E8F0" />
      </mesh>

      {/* Blue Globe Icon */}
      <group position={[0, 0.22, 0.05]}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#0284C7" metalness={0.2} roughness={0.3} />
        </mesh>
        {/* Globe latitude / longitude rings */}
        <mesh>
          <torusGeometry args={[0.225, 0.015, 8, 24]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.225, 0.015, 8, 24]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Label: API Requests */}
      <Text
        position={[0, -0.22, 0.05]}
        fontSize={0.14}
        color="#0F172A"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.1}
      >
        {'API\nRequests'}
      </Text>

      {/* >>> Animated Chevrons pointing to the pipe */}
      <group ref={chevronsRef} position={[0.78, 0, 0]}>
        <Text
          fontSize={0.26}
          color="#0284C7"
          anchorX="center"
          anchorY="middle"
          letterSpacing={-0.08}
        >
          &gt;&gt;&gt;
        </Text>
      </group>
    </group>
  )
}

// ─── Right Placard: "API Response" with Checkmark ───────────
function ApiResponsePlacard() {
  const chevronsRef = useRef()

  useFrame((state) => {
    if (!chevronsRef.current) return
    const t = (state.clock.getElapsedTime() * 3) % 1
    chevronsRef.current.position.x = -0.78 + t * 0.15
  })

  return (
    <group position={[4.1, 1.85, 0.2]}>
      {/* White rounded card with soft depth */}
      <mesh castShadow>
        <boxGeometry args={[1.35, 1.35, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>

      {/* Green Circle with White Checkmark */}
      <group position={[0, 0.22, 0.05]}>
        <mesh>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#10B981" roughness={0.3} />
        </mesh>
        {/* Checkmark icon in 3D */}
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.3}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          ✓
        </Text>
      </group>

      {/* Label: API Response */}
      <Text
        position={[0, -0.22, 0.05]}
        fontSize={0.14}
        color="#0F172A"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.1}
      >
        {'API\nResponse'}
      </Text>

      {/* >>> Animated Chevrons */}
      <group ref={chevronsRef} position={[-0.78, 0, 0]}>
        <Text
          fontSize={0.26}
          color="#0284C7"
          anchorX="center"
          anchorY="middle"
          letterSpacing={-0.08}
        >
          &gt;&gt;&gt;
        </Text>
      </group>
    </group>
  )
}

// ─── Left Analytics Server Tower ────────────────────────────
function LeftServerTower({ darkMode = true }) {
  const barsRef = useRef()

  useFrame((state) => {
    if (!barsRef.current) return
    const t = state.clock.getElapsedTime()
    barsRef.current.children.forEach((bar, i) => {
      const h = 0.2 + Math.abs(Math.sin(t * 3 + i * 0.8)) * 0.35
      bar.scale.y = h
    })
  })

  return (
    <group position={[-3.25, 0.45, 0.25]}>
      {/* Tower Chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.8, 0.75]} />
        <meshStandardMaterial
          color={darkMode ? '#0F172A' : '#1E293B'}
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Blue LED Edge Trim */}
      <mesh position={[0.44, 0, 0.37]}>
        <boxGeometry args={[0.04, 1.76, 0.03]} />
        <meshStandardMaterial color="#0284C7" emissive="#0284C7" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.44, 0, 0.37]}>
        <boxGeometry args={[0.04, 1.76, 0.03]} />
        <meshStandardMaterial color="#0284C7" emissive="#0284C7" emissiveIntensity={0.8} />
      </mesh>

      {/* Dashboard Screen with Analytics Bars */}
      <mesh position={[0, 0.35, 0.38]}>
        <planeGeometry args={[0.72, 0.75]} />
        <meshStandardMaterial color="#050B14" roughness={0.9} />
      </mesh>

      {/* Animated Analytics Bars */}
      <group ref={barsRef} position={[-0.22, 0.15, 0.39]}>
        {[-0.08, 0.06, 0.2, 0.34, 0.48].map((x, i) => (
          <mesh key={i} position={[x, 0.2, 0]}>
            <planeGeometry args={[0.09, 0.5]} />
            <meshBasicMaterial color={i === 0 ? '#EAB308' : '#0284C7'} />
          </mesh>
        ))}
      </group>

      {/* LED Status Row Dots */}
      {[-0.2, -0.35, -0.5, -0.65].map((y, rowIdx) => (
        <group key={rowIdx} position={[0, y, 0.39]}>
          {[-0.25, -0.1, 0.05, 0.2].map((x, colIdx) => (
            <mesh key={colIdx} position={[x, 0, 0]}>
              <circleGeometry args={[0.025, 8]} />
              <meshBasicMaterial
                color={colIdx === 0 && rowIdx === 0 ? '#EAB308' : '#0284C7'}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Outgoing pipe to central engine */}
      <mesh position={[0.48, 0.3, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

// ─── Right Angled Code Terminal & Piston ────────────────────
function RightTerminalMonitor() {
  return (
    <group position={[3.2, 0.65, 0.35]}>
      {/* Angled Terminal Monitor */}
      <group position={[0, 0.55, 0]} rotation={[-0.15, -0.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.8, 0.08]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.12, 0.72]} />
          <meshStandardMaterial
            color="#050B14"
            emissive="#050B14"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* </> Icon on Screen */}
        <Text
          position={[-0.4, 0.24, 0.05]}
          fontSize={0.12}
          color="#38BDF8"
          anchorX="center"
          anchorY="middle"
        >
          &lt;/&gt;
        </Text>

        {/* Code Lines */}
        {[-0.2, -0.08, 0.04, 0.16].map((y, i) => (
          <mesh key={i} position={[0.05, y, 0.05]}>
            <planeGeometry args={[0.7 - (i % 2) * 0.2, 0.04]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? '#38BDF8' : i % 3 === 1 ? '#C084FC' : '#FB923C'}
            />
          </mesh>
        ))}

        {/* Stand */}
        <mesh position={[0, -0.44, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.15, 12]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} />
        </mesh>
      </group>

      {/* Industrial Piston & Valve Assembly */}
      <group position={[0.05, -0.4, -0.1]}>
        <mesh position={[-0.25, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.6, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.15, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.45, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  )
}

// ─── Central Processing Engine & Transparent Chamber ────────
function CentralProcessingChamber({ darkMode = true }) {
  const chamberGlowRef = useRef()

  useFrame((state) => {
    if (!chamberGlowRef.current) return
    const t = state.clock.getElapsedTime()
    chamberGlowRef.current.material.opacity = 0.25 + Math.sin(t * 2) * 0.08
  })

  return (
    <group position={[0, 1.45, 0]}>
      {/* Cylindrical Glass Chamber Enclosure */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 0.85, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#06B6D4"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.85}
          ior={1.4}
        />
      </mesh>

      {/* Chamber Internal Glow Cylinder */}
      <mesh ref={chamberGlowRef} scale={[0.98, 0.95, 0.98]}>
        <cylinderGeometry args={[1.45, 1.45, 0.8, 32]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top & Bottom Metal Casing Rims */}
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[1.58, 1.58, 0.1, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.46, 0]}>
        <cylinderGeometry args={[1.58, 1.58, 0.1, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* 3 Interlocking Cyan Gears inside the Chamber */}
      <group position={[-0.45, 0.05, 0]}>
        <Gear3D radius={0.26} thickness={0.06} teeth={8} color="#06B6D4" speed={1.2} />
      </group>
      <group position={[0.05, 0.12, 0]}>
        <Gear3D radius={0.34} thickness={0.07} teeth={10} color="#38BDF8" speed={-0.9} />
      </group>
      <group position={[0.55, -0.05, 0]}>
        <Gear3D radius={0.22} thickness={0.06} teeth={7} color="#06B6D4" speed={1.4} />
      </group>

      {/* Dark Plaque Underneath: </> Processing (Application Logic) */}
      <group position={[0, -0.72, 0.65]}>
        <mesh castShadow>
          <boxGeometry args={[2.5, 0.52, 0.1]} />
          <meshStandardMaterial
            color="#0A0E17"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
        {/* Cyan </> Icon */}
        <Text
          position={[-0.85, 0, 0.06]}
          fontSize={0.26}
          color="#06B6D4"
          anchorX="center"
          anchorY="middle"
        >
          &lt;/&gt;
        </Text>
        {/* Processing Text */}
        <Text
          position={[0.2, 0.08, 0.06]}
          fontSize={0.14}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Processing
        </Text>
        <Text
          position={[0.2, -0.1, 0.06]}
          fontSize={0.11}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
        >
          (Application Logic)
        </Text>
      </group>

      {/* Glowing Horizontal Light Bar Beneath the Plaque */}
      <mesh position={[0, -1.02, 0.65]}>
        <boxGeometry args={[2.4, 0.06, 0.04]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={0.9}
        />
      </mesh>
    </group>
  )
}

// ─── Top Arch: "Backend" with Gear Icon ──────────────────────
function TopBackendSign({ darkMode = true }) {
  const gearRef = useRef()

  useFrame((_, delta) => {
    if (gearRef.current) {
      gearRef.current.rotation.z += delta * 0.8
    }
  })

  return (
    <group position={[0, 3.1, 0]}>
      {/* Twin Supporting Columns */}
      <mesh position={[-1.75, -0.65, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.75, -0.65, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Main Signboard Box */}
      <mesh castShadow>
        <boxGeometry args={[3.2, 0.72, 0.16]} />
        <meshStandardMaterial
          color={darkMode ? '#0A0E17' : '#1E293B'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Cyan/Blue Rim Accent */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[3.26, 0.78, 0.14]} />
        <meshStandardMaterial
          color="#0284C7"
          emissive="#0284C7"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 3D Cyan Gear Icon on the Left */}
      <group ref={gearRef} position={[-0.95, 0, 0.1]}>
        <Gear3D radius={0.2} thickness={0.04} teeth={8} color="#0284C7" speed={0.6} />
      </group>

      {/* Bold Crisp White "Backend" Text */}
      <Text
        position={[0.2, 0, 0.1]}
        fontSize={0.34}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
      >
        Backend
      </Text>
    </group>
  )
}

// ─── Heavy Industrial Pipes & Blue Coupler Bands ────────────
function IndustrialPipeManifold() {
  return (
    <group position={[0, 2.3, 0]}>
      {/* Upper Cross Manifold Pipe */}
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 4.4, 20]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Blue Coupler Rings on the Cross Pipe */}
      {[-1.8, -0.9, 0.9, 1.8].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.09, 0.025, 8, 20]} />
          <meshStandardMaterial color="#0284C7" emissive="#0284C7" emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* Left Vertical Drop Pipe */}
      <mesh position={[-2.2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 20]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Right Vertical Drop Pipe */}
      <mesh position={[2.2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 20]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left 90-degree Elbow Connector */}
      <mesh position={[-2.12, 0.38, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Right 90-degree Elbow Connector */}
      <mesh position={[2.12, 0.38, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

// ─── 4 Front Tech Blocks: Node.js, Express, FastAPI, Python ──
function FrontTechModule({ x, logo, title, brandColor, darkMode = true }) {
  const meshRef = useRef()

  return (
    <group ref={meshRef} position={[x, -0.15, 1.25]}>
      {/* Dark Rounded Rectangular Block */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.25, 0.45]} />
        <meshStandardMaterial
          color={darkMode ? '#0F172A' : '#1E293B'}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>
      {/* Front Face with subtle bevel border */}
      <mesh position={[0, 0, 0.23]}>
        <boxGeometry args={[1.14, 1.18, 0.02]} />
        <meshStandardMaterial
          color="#0A0E17"
          roughness={0.3}
        />
      </mesh>

      {/* Custom Brand Logo Representation */}
      <group position={[0, 0.16, 0.25]}>
        {logo === 'node' && (
          <group>
            {/* Green Hexagon Icon */}
            <mesh rotation={[0, 0, Math.PI / 6]}>
              <cylinderGeometry args={[0.26, 0.26, 0.03, 6]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#22C55E" roughness={0.3} emissive="#22C55E" emissiveIntensity={0.4} />
            </mesh>
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.16}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
            >
              JS
            </Text>
          </group>
        )}

        {logo === 'express' && (
          <group>
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.28}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              letterSpacing={-0.02}
            >
              ex
            </Text>
          </group>
        )}

        {logo === 'fastapi' && (
          <group>
            {/* Teal circle with white bolt */}
            <mesh>
              <cylinderGeometry args={[0.26, 0.26, 0.03, 32]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#0284C7" roughness={0.3} emissive="#0284C7" emissiveIntensity={0.5} />
            </mesh>
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.24}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
            >
              ⚡
            </Text>
          </group>
        )}

        {logo === 'python' && (
          <group>
            {/* Yellow & Blue Dual Python Icon */}
            <mesh position={[-0.08, 0.06, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#0284C7" metalness={0.2} roughness={0.3} />
            </mesh>
            <mesh position={[0.08, -0.06, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#EAB308" metalness={0.2} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.018]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
        )}
      </group>

      {/* White Title on Front: Node.js / Express / FastAPI / Python */}
      <Text
        position={[0, -0.32, 0.25]}
        fontSize={0.16}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  )
}

// ─── Platform Base with Orange Perimeter Trim & Placard ─────
function MasterPlatformBase({ darkMode = true }) {
  return (
    <group position={[0, -0.9, 0]}>
      {/* Main Base Block */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[9.4, 0.55, 3.8]} />
        <meshStandardMaterial
          color={darkMode ? '#1E293B' : '#E2E8F0'}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Vibrant Orange Perimeter Trim at bottom */}
      <mesh position={[0, -0.24, 0]}>
        <boxGeometry args={[9.5, 0.09, 3.9]} />
        <meshStandardMaterial
          color="#EA580C"
          emissive="#EA580C"
          emissiveIntensity={0.85}
        />
      </mesh>

      {/* Recessed Horizontal Cyan Light Strip */}
      <mesh position={[0, 0.16, 1.91]}>
        <boxGeometry args={[8.8, 0.045, 0.02]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Center Front Dark Plaque: "Build APIs • Handle Logic • Process Requests" */}
      <group position={[0, -0.04, 1.92]}>
        <mesh>
          <boxGeometry args={[5.2, 0.35, 0.05]} />
          <meshStandardMaterial
            color="#0A0E17"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>

        {/* Text with glowing cyan separator dots */}
        <Text
          position={[-1.4, 0, 0.035]}
          fontSize={0.15}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Build APIs
        </Text>
        <Text
          position={[-0.7, 0, 0.035]}
          fontSize={0.18}
          color="#06B6D4"
          anchorX="center"
          anchorY="middle"
        >
          •
        </Text>
        <Text
          position={[0, 0, 0.035]}
          fontSize={0.15}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Handle Logic
        </Text>
        <Text
          position={[0.7, 0, 0.035]}
          fontSize={0.18}
          color="#06B6D4"
          anchorX="center"
          anchorY="middle"
        >
          •
        </Text>
        <Text
          position={[1.4, 0, 0.035]}
          fontSize={0.15}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Process Requests
        </Text>
      </group>
    </group>
  )
}

// ─── Master Backend 3D Scene ────────────────────────────────
export default function BackendEngine3D({ darkMode = true }) {
  return (
    <>
      <ambientLight intensity={darkMode ? 0.85 : 1.25} />
      {/* Studio Key Light */}
      <directionalLight
        position={[6, 10, 8]}
        intensity={darkMode ? 1.8 : 2.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Left Blue Fill Light */}
      <directionalLight position={[-8, 6, 4]} intensity={0.8} color="#0284C7" />
      {/* Right Warm Backlight */}
      <directionalLight position={[6, 6, -6]} intensity={0.6} color="#F59E0B" />

      {/* Orbit Controls (constrained to front-facing isometric view) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={Math.PI / 3.2}
        maxAzimuthAngle={Math.PI / 5}
        minAzimuthAngle={-Math.PI / 5}
        dampingFactor={0.06}
      />

      {/* 3D Floating Title at Top: "What am I know ?" */}
      <FloatingTitle3D darkMode={darkMode} />

      {/* ── The Master Backend Platform ── */}
      <group position={[0, -0.4, 0]}>
        {/* Top Arch: Backend */}
        <TopBackendSign darkMode={darkMode} />

        {/* Industrial Piping */}
        <IndustrialPipeManifold />

        {/* Left Placard: API Requests */}
        <ApiRequestsPlacard />

        {/* Right Placard: API Response */}
        <ApiResponsePlacard />

        {/* Left Vertical Server Tower */}
        <LeftServerTower darkMode={darkMode} />

        {/* Right Terminal Monitor & Piston */}
        <RightTerminalMonitor />

        {/* Center Transparent Processing Chamber with Interlocking Gears */}
        <CentralProcessingChamber darkMode={darkMode} />

        {/* 4 Front Tech Blocks: Node.js, Express, FastAPI, Python */}
        <FrontTechModule
          x={-2.0}
          logo="node"
          title="Node.js"
          brandColor="#22C55E"
          darkMode={darkMode}
        />
        <FrontTechModule
          x={-0.67}
          logo="express"
          title="Express"
          brandColor="#FFFFFF"
          darkMode={darkMode}
        />
        <FrontTechModule
          x={0.67}
          logo="fastapi"
          title="FastAPI"
          brandColor="#0284C7"
          darkMode={darkMode}
        />
        <FrontTechModule
          x={2.0}
          logo="python"
          title="Python"
          brandColor="#EAB308"
          darkMode={darkMode}
        />

        {/* Master Base Platform with Orange Rim and Bottom Banner */}
        <MasterPlatformBase darkMode={darkMode} />
      </group>

      {/* Soft Ground Shadow Plane */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 14]} />
        <shadowMaterial opacity={darkMode ? 0.35 : 0.15} />
      </mesh>
    </>
  )
}
