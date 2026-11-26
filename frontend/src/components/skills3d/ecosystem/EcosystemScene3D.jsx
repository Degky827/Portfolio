import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Text } from '@react-three/drei'
import { ExactTechIcon3D } from './ExactTechIcon'

// ─── 3D Spline Curves for Heavy Physical Cables ─────────────
const CABLE_CONFIGS = [
  {
    id: 'database',
    color: '#2563EB',
    points: [
      new THREE.Vector3(-3.0, 0.14, -2.5),
      new THREE.Vector3(-2.4, 0.14, -1.8),
      new THREE.Vector3(-1.7, 0.14, -1.2),
      new THREE.Vector3(-1.15, 0.14, -0.75),
    ],
  },
  {
    id: 'backend',
    color: '#EA580C',
    // Plugs cleanly into the front-left orange trim of the Backend base
    points: [
      new THREE.Vector3(3.0, 0.14, -2.5),
      new THREE.Vector3(2.4, 0.14, -1.8),
      new THREE.Vector3(1.7, 0.14, -1.2),
      new THREE.Vector3(1.15, 0.14, -0.75),
    ],
  },
  {
    id: 'frontend',
    color: '#9333EA',
    points: [
      new THREE.Vector3(-3.0, 0.14, 2.5),
      new THREE.Vector3(-2.4, 0.14, 1.8),
      new THREE.Vector3(-1.7, 0.14, 1.2),
      new THREE.Vector3(-1.15, 0.14, 0.75),
    ],
  },
  {
    id: 'tools',
    color: '#10B981',
    points: [
      new THREE.Vector3(3.0, 0.14, 2.5),
      new THREE.Vector3(2.4, 0.14, 1.8),
      new THREE.Vector3(1.7, 0.14, 1.2),
      new THREE.Vector3(1.15, 0.14, 0.75),
    ],
  },
]

function PhysicalCable({ curve, color }) {
  const tubeGeometry = useMemo(
    () => new THREE.TubeGeometry(curve, 32, 0.08, 12, false),
    [curve],
  )
  const pulseRef = useRef()

  useFrame((state) => {
    if (!pulseRef.current) return
    const t = (state.clock.getElapsedTime() * 0.4) % 1
    const pt = curve.getPoint(t)
    pulseRef.current.position.copy(pt)
  })

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={curve.getPoint(0)}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={curve.getPoint(1)}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  )
}

// ─── True 3D Extruded Large Black Title: "What am I know ?" (Matches About Page) ───
function createFloatingTitleTextures(title = 'What am I know ?', darkMode = true) {
  if (typeof document === 'undefined') return { frontMap: null, depthMap: null }

  // 1. Front face texture with bold solid black matching the About page
  const frontCanvas = document.createElement('canvas')
  frontCanvas.width = 2048
  frontCanvas.height = 256
  const fCtx = frontCanvas.getContext('2d')
  if (!fCtx) return { frontMap: null, depthMap: null }

  fCtx.clearRect(0, 0, 2048, 256)
  fCtx.font = '900 170px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  fCtx.textAlign = 'center'
  fCtx.textBaseline = 'middle'

  // Solid rich black/slate like About page 3D extruded header
  fCtx.fillStyle = '#0F172A'
  fCtx.fillText(title, 1024, 128)

  // Crisp subtle edge definition
  fCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
  fCtx.lineWidth = 3
  fCtx.strokeText(title, 1024, 128)

  const frontMap = new THREE.CanvasTexture(frontCanvas)
  frontMap.colorSpace = THREE.SRGBColorSpace
  frontMap.generateMipmaps = true
  frontMap.minFilter = THREE.LinearMipmapLinearFilter

  // 2. Extrusion depth slice texture (slate/charcoal for 3D sides)
  const depthCanvas = document.createElement('canvas')
  depthCanvas.width = 2048
  depthCanvas.height = 256
  const dCtx = depthCanvas.getContext('2d')
  if (!dCtx) return { frontMap, depthMap: null }

  dCtx.clearRect(0, 0, 2048, 256)
  dCtx.font = '900 170px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  dCtx.textAlign = 'center'
  dCtx.textBaseline = 'middle'
  dCtx.fillStyle = '#1E293B'
  dCtx.fillText(title, 1024, 128)
  dCtx.strokeStyle = '#020617'
  dCtx.lineWidth = 4
  dCtx.strokeText(title, 1024, 128)

  const depthMap = new THREE.CanvasTexture(depthCanvas)
  depthMap.colorSpace = THREE.SRGBColorSpace
  depthMap.generateMipmaps = true

  return { frontMap, depthMap }
}

function FloatingTitle3D({ darkMode = true }) {
  const titleRef = useRef()
  const { frontMap, depthMap } = useMemo(
    () => createFloatingTitleTextures('What am I know ?', darkMode),
    [darkMode],
  )

  useFrame(({ camera }) => {
    if (titleRef.current) {
      // Smoothly billboard around Y axis to face orbiting camera with zero up/down bobbing
      titleRef.current.rotation.y = Math.atan2(camera.position.x, camera.position.z)
    }
  })

  // 8 extrusion depth slices giving the letters physical 3D thickness when rotated
  const depthSlices = useMemo(
    () => [
      { z: -0.07, opacity: 0.95 },
      { z: -0.05, opacity: 0.90 },
      { z: -0.03, opacity: 0.85 },
      { z: -0.01, opacity: 0.80 },
      { z: 0.01, opacity: 0.75 },
      { z: 0.03, opacity: 0.70 },
      { z: 0.05, opacity: 0.65 },
    ],
    [],
  )

  return (
    <group ref={titleRef} position={[0, 5.2, -1.8]}>
      {/* 3D Extrusion Depth Slices (Rendered behind to show physical 3D sides) */}
      {depthMap &&
        depthSlices.map((slice, i) => (
          <mesh key={`title-depth-${i}`} position={[0, 0, slice.z]}>
            <planeGeometry args={[7.2, 0.9]} />
            <meshBasicMaterial
              map={depthMap}
              transparent
              opacity={slice.opacity}
              depthWrite={false}
            />
          </mesh>
        ))}

      {/* Crisp Front Face with Black Finish like About Page */}
      {frontMap && (
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[7.2, 0.9]} />
          <meshBasicMaterial map={frontMap} transparent opacity={1.0} />
        </mesh>
      )}

      {/* Modern Charcoal Accent Bar with Diamond Center matching About Page */}
      <mesh position={[0, -0.52, 0]}>
        <boxGeometry args={[4.8, 0.04, 0.04]} />
        <meshStandardMaterial
          color="#36454F"
          emissive="#36454F"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0, -0.52, 0.03]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.12, 0.12, 0.04]} />
        <meshStandardMaterial
          color="#36454F"
          emissive="#36454F"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  )
}

// ─── Potted Plant Helper ────────────────────────────────────
function PottedPlant({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.04, 16]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * 0.08,
            0.36 + (i % 2) * 0.05,
            Math.sin(angle) * 0.08,
          ]}
          rotation={[0.3, angle, 0.2]}
        >
          <coneGeometry args={[0.09, 0.22, 5]} />
          <meshStandardMaterial color="#22C55E" roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Central 3D Developer Character & Dais ──────────────────
// Matches the user's uploaded developer reference image with 100% fidelity:
// • High-resolution, exact cutout of the developer sitting cross-legged on the futuristic cyber dais
// • Cyan glowing perimeter ring and ground contact pulse
// • Smooth camera-facing billboard alignment so the developer always looks pristine from any orbit angle
// • Physical cable terminal collars connecting all 4 ecosystem conduits seamlessly
function CentralDeveloper({ darkMode = true, daisRef, manRef }) {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const loader = new THREE.TextureLoader()
    const tex = loader.load('/central-developer.png')
    tex.colorSpace = THREE.SRGBColorSpace
    tex.generateMipmaps = true
    tex.minFilter = THREE.LinearMipmapLinearFilter
    return tex
  }, [])

  useFrame((state) => {
    // Smooth camera-facing billboard tracking so character always faces the viewer
    if (manRef?.current) {
      const cam = state.camera
      manRef.current.rotation.y = Math.atan2(cam.position.x, cam.position.z)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. 3D Dais Ground Base & Contact Shadow (Rises first) ── */}
      <group ref={daisRef} position={[0, 0, 0]}>
        {/* Soft Contact Shadow beneath Dais */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.72, 48]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.45} />
        </mesh>

        {/* Cyber Blue Ground Glow Halo */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.50, 1.88, 48]} />
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={darkMode ? 0.75 : 0.45}
          />
        </mesh>

        {/* Titanium Ground Collar Disk */}
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <cylinderGeometry args={[1.58, 1.70, 0.08, 48]} />
          <meshStandardMaterial
            color={darkMode ? '#0F172A' : '#1E293B'}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        {/* Cyan Light Rim on Base */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[1.62, 1.62, 0.025, 48]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={1.4}
          />
        </mesh>

        {/* 4 Cable Terminal Collars (where Database, Backend, Frontend, Tools plug in) */}
        {[
          { pos: [-1.15, 0.14, -0.75], color: '#3B82F6' },
          { pos: [1.15, 0.14, -0.75], color: '#EA580C' },
          { pos: [-1.15, 0.14, 0.75], color: '#9333EA' },
          { pos: [1.15, 0.14, 0.75], color: '#10B981' },
        ].map((port, i) => (
          <group key={i} position={port.pos}>
            <mesh>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh>
              <torusGeometry args={[0.14, 0.03, 8, 16]} />
              <meshStandardMaterial
                color={port.color}
                emissive={port.color}
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        ))}

        {/* Cyan Glow PointLight illuminating Dais and Cables */}
        <pointLight
          position={[0, 0.5, 0]}
          color="#00E5FF"
          intensity={1.5}
          distance={4.5}
          decay={2}
        />
      </group>

      {/* ── 2. The Exact High-Detail Developer (Comes down and sits stably without up/down bobbing) ── */}
      {texture && (
        <group ref={manRef} position={[0, 1.28, 0]}>
          <mesh castShadow>
            <planeGeometry args={[3.8, 2.53]} />
            <meshStandardMaterial
              map={texture}
              transparent
              alphaTest={0.03}
              roughness={0.35}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}

// ─── Environment 1: Exact High-Detail Database Platform (Top-Left) ───
// Faithfully matches the uploaded digital storage reference image with:
// • Top [ 🗄️ Database ] sign with 3D stacked database cylinder discs & electric cyan border
// • Polished chrome pipe scaffolding with 4 curved blue feeder pipes entering each silo
// • 4 Heavy vertical storage silos: PostgreSQL (elephant), MongoDB (leaf), MySQL (dolphin), Supabase (lightning)
// • Left station: "Data Ingestion" card + Database Activity monitor with chart & checklist (Data Stored, Indexed, Available)
// • Right station: "Data Retrieval" card + 3D Backup & Sync cloud with security shield atop server blade rack
// • Potted tropical plants on both sides
// • Base platform with glowing blue trim and front plaque: Scalable Storage • High Availability • Fast Query • Cloud Ready
function DatabasePlatformDetailed({ darkMode = true }) {
  const chevronsLeftRef = useRef()
  const chevronsRightRef = useRef()
  const chartBarsRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (chevronsLeftRef.current) {
      chevronsLeftRef.current.position.x = 0.78 + ((t * 2.8) % 1) * 0.15
    }
    if (chevronsRightRef.current) {
      chevronsRightRef.current.position.x = -0.78 + ((t * 2.8) % 1) * 0.15
    }
    if (chartBarsRef.current) {
      chartBarsRef.current.children.forEach((bar, i) => {
        bar.scale.y = 0.25 + Math.abs(Math.sin(t * 3.2 + i * 0.75)) * 0.5
      })
    }
  })

  return (
    <group position={[-4.6, 0, -3.2]} scale={[0.42, 0.42, 0.42]}>
      {/* ── 1. Top Industrial Sign: [ 🗄️ Database ] ── */}
      <group position={[0, 4.45, 0]}>
        {/* Signboard casing */}
        <mesh castShadow>
          <boxGeometry args={[3.6, 0.82, 0.18]} />
          <meshStandardMaterial
            color={darkMode ? '#0A0E17' : '#1E293B'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Glowing Electric Cyan Border Trim */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[3.68, 0.9, 0.16]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* 3D Stacked Database Disc Cylinders on Left */}
        <group position={[-1.1, 0, 0.11]}>
          {[0.1, -0.01, -0.12].map((y, i) => (
            <group key={i} position={[0, y, 0]}>
              <mesh>
                <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial
                  color="#00D2FF"
                  emissive="#00D2FF"
                  emissiveIntensity={0.7}
                  metalness={0.6}
                  roughness={0.25}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.22, 0.015, 8, 24]} />
                <meshStandardMaterial color="#FFFFFF" metalness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
        {/* Bold White Text: Database */}
        <Text
          position={[0.22, 0, 0.11]}
          fontSize={0.38}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          Database
        </Text>
        {/* Mounting posts into overhead chrome pipe arch */}
        <mesh position={[-1.3, -0.52, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[1.3, -0.52, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ── 2. Chrome Pipe Framework & Blue Curved Silo Feeder Tubes ── */}
      <group position={[0, 0, 0]}>
        {/* Main Overhead Horizontal Chrome Pipe */}
        <mesh position={[0, 3.9, -0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 4.6, 24]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
        {/* Overhead cyan pipe collar rings */}
        {[-2.0, -1.3, 0, 1.3, 2.0].map((x, i) => (
          <mesh key={i} position={[x, 3.9, -0.1]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.13, 0.035, 8, 20]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
        ))}

        {/* Left Vertical Down-Pipe with Elbow */}
        <mesh position={[-2.3, 3.0, -0.1]}>
          <cylinderGeometry args={[0.11, 0.11, 1.8, 24]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
        <mesh position={[-2.3, 3.9, -0.1]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Right Vertical Down-Pipe with Elbow */}
        <mesh position={[2.3, 3.0, -0.1]}>
          <cylinderGeometry args={[0.11, 0.11, 1.8, 24]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
        <mesh position={[2.3, 3.9, -0.1]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* 4 Blue Feeder Pipes curving down from Overhead Pipe into the 4 Silos */}
        {[-2.15, -0.72, 0.72, 2.15].map((x, i) => (
          <group key={i} position={[x, 3.25, 0]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.55, 16]} />
              <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0, 0.52, 0]}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <torusGeometry args={[0.1, 0.025, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Left Feeder Pipe to Data Ingestion card */}
        <mesh position={[-3.2, 2.75, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>

        {/* Right Feeder Pipe to Data Retrieval card */}
        <mesh position={[3.2, 2.75, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
      </group>

      {/* ── 3. Left Placard: Data Ingestion ── */}
      <group position={[-4.1, 2.75, 0.2]} rotation={[-0.15, 0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.35, 1.35, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.4, 1.4, 0.06]} />
          <meshStandardMaterial color="#0284C7" />
        </mesh>
        <Text
          position={[0, 0.42, 0.05]}
          fontSize={0.20}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Data Ingestion
        </Text>
        {/* 3 Icons: Document, Grid, Waves */}
        <group position={[0, 0.02, 0.05]}>
          {/* Document */}
          <mesh position={[-0.38, 0, 0]}>
            <boxGeometry args={[0.22, 0.28, 0.02]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* Grid */}
          <group position={[0, 0, 0]}>
            {[-0.06, 0.06].map((x, xi) =>
              [-0.06, 0.06].map((y, yi) => (
                <mesh key={`${xi}-${yi}`} position={[x, y, 0]}>
                  <boxGeometry args={[0.09, 0.09, 0.02]} />
                  <meshStandardMaterial color="#0284C7" />
                </mesh>
              )),
            )}
          </group>
          {/* Signal Waves */}
          <group position={[0.38, 0, 0]}>
            {[0.08, 0.14].map((r, i) => (
              <mesh key={i} position={[-0.05, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <torusGeometry args={[r, 0.015, 8, 16, Math.PI / 2]} />
                <meshStandardMaterial color="#0284C7" />
              </mesh>
            ))}
          </group>
        </group>
        {/* Animated chevrons >>> */}
        <group ref={chevronsLeftRef} position={[0.78, 0, 0]}>
          <Text
            fontSize={0.28}
            color="#00D2FF"
            anchorX="center"
            anchorY="middle"
            letterSpacing={-0.08}
          >
            &gt;&gt;&gt;
          </Text>
        </group>
      </group>

      {/* ── 4. Right Placard: Data Retrieval ── */}
      <group position={[4.1, 2.75, 0.2]} rotation={[-0.15, -0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.35, 1.35, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.4, 1.4, 0.06]} />
          <meshStandardMaterial color="#0284C7" />
        </mesh>
        <Text
          position={[0, 0.42, 0.05]}
          fontSize={0.20}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Data Retrieval
        </Text>
        {/* 3 Icons: Rising chart, Search glass, Document */}
        <group position={[0, 0.02, 0.05]}>
          {/* Rising chart */}
          <group position={[-0.38, -0.05, 0]}>
            {[0.04, 0.08, 0.12].map((h, i) => (
              <mesh key={i} position={[(i - 1) * 0.07, h / 2, 0]}>
                <boxGeometry args={[0.05, h, 0.02]} />
                <meshStandardMaterial color="#0284C7" />
              </mesh>
            ))}
          </group>
          {/* Search glass */}
          <group position={[0, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.1, 0.02, 8, 18]} />
              <meshStandardMaterial color="#0284C7" />
            </mesh>
            <mesh position={[0.08, -0.08, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
              <meshStandardMaterial color="#0284C7" />
            </mesh>
          </group>
          {/* Document */}
          <mesh position={[0.38, 0, 0]}>
            <boxGeometry args={[0.22, 0.28, 0.02]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
        </group>
        {/* Animated chevrons >>> */}
        <group ref={chevronsRightRef} position={[-0.78, 0, 0]}>
          <Text
            fontSize={0.28}
            color="#00D2FF"
            anchorX="center"
            anchorY="middle"
            letterSpacing={-0.08}
          >
            &gt;&gt;&gt;
          </Text>
        </group>
      </group>

      {/* ── 5. Left Station: Database Activity Monitor & Server Rack ── */}
      <group position={[-3.3, 1.45, 0.4]}>
        {/* Angled Monitor */}
        <group position={[0, 0.55, 0]} rotation={[-0.12, 0.32, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.35, 1.05, 0.08]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[1.27, 0.97]} />
            <meshStandardMaterial color="#050B14" emissive="#050B14" emissiveIntensity={0.6} />
          </mesh>
          {/* Green Status LED + Database Activity */}
          <mesh position={[-0.48, 0.38, 0.05]}>
            <circleGeometry args={[0.03, 12]} />
            <meshBasicMaterial color="#22C55E" />
          </mesh>
          <Text position={[0.05, 0.38, 0.05]} fontSize={0.16} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
            Database Activity
          </Text>
          {/* Animated Area / Column Chart */}
          <group ref={chartBarsRef} position={[-0.48, 0.08, 0.05]}>
            {[0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78].map((x, i) => (
              <mesh key={i} position={[x, (i + 1) * 0.02, 0]}>
                <planeGeometry args={[0.07, 0.28]} />
                <meshBasicMaterial color="#0284C7" />
              </mesh>
            ))}
          </group>
          {/* Checklist: Data Stored, Indexed, Available */}
          <group position={[-0.48, -0.22, 0.05]}>
            {[
              { label: 'Data Stored', y: 0.1 },
              { label: 'Indexed', y: 0 },
              { label: 'Available', y: -0.1 },
            ].map((item, i) => (
              <group key={i} position={[0, item.y, 0]}>
                <mesh position={[0.05, 0, 0]}>
                  <circleGeometry args={[0.03, 10]} />
                  <meshBasicMaterial color="#22C55E" />
                </mesh>
                <Text position={[0.38, 0, 0]} fontSize={0.12} color="#E2E8F0" anchorX="center" anchorY="middle" fontWeight="bold">
                  {item.label}
                </Text>
              </group>
            ))}
          </group>
          {/* Stand */}
          <mesh position={[0, -0.58, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.18, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} />
          </mesh>
        </group>

        {/* Dual Server Blade Rack Chassis */}
        <group position={[0, -0.32, -0.05]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.5, 0.8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
          </mesh>
          {[-0.1, 0.1].map((y, i) => (
            <group key={i} position={[0, y, 0.41]}>
              <mesh>
                <boxGeometry args={[1.1, 0.14, 0.02]} />
                <meshStandardMaterial color="#1E293B" />
              </mesh>
              {[-0.4, -0.3, -0.2, 0.2, 0.3, 0.4].map((x, xi) => (
                <mesh key={xi} position={[x, 0, 0.012]}>
                  <circleGeometry args={[0.02, 8]} />
                  <meshBasicMaterial color="#00D2FF" />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      </group>

      {/* ── 6. Right Station: Backup & Sync Cloud Unit ── */}
      <group position={[3.3, 1.55, 0.4]}>
        {/* Vibrant 3D Blue Cloud Unit */}
        <group position={[0, 0.65, 0]}>
          {/* Overlapping Cloud Spheres */}
          <mesh position={[-0.28, -0.05, 0]} castShadow>
            <sphereGeometry args={[0.34, 20, 20]} />
            <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.28, -0.05, 0]} castShadow>
            <sphereGeometry args={[0.34, 20, 20]} />
            <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0.18, 0]} castShadow>
            <sphereGeometry args={[0.42, 20, 20]} />
            <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.25, 24]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.6} />
          </mesh>
          {/* White Security Shield with Checkmark */}
          <group position={[0, 0.02, 0.38]}>
            <mesh>
              <cylinderGeometry args={[0.22, 0.16, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
            <Text position={[0, 0, 0.03]} fontSize={0.22} color="#2563EB" anchorX="center" anchorY="middle">
              ✓
            </Text>
          </group>
        </group>

        {/* Dual Server Blade Chassis underneath */}
        <group position={[0, -0.22, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.55, 0.8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
          </mesh>
          {[-0.12, 0.12].map((y, i) => (
            <group key={i} position={[0, y, 0.41]}>
              <mesh>
                <boxGeometry args={[1.1, 0.14, 0.02]} />
                <meshStandardMaterial color="#1E293B" />
              </mesh>
              {[-0.4, -0.3, 0.2, 0.3].map((x, xi) => (
                <mesh key={xi} position={[x, 0, 0.012]}>
                  <circleGeometry args={[0.02, 8]} />
                  <meshBasicMaterial color="#00D2FF" />
                </mesh>
              ))}
            </group>
          ))}
          {/* Backup & Sync plaque */}
          <group position={[0, -0.36, 0.41]}>
            <mesh>
              <boxGeometry args={[1.1, 0.18, 0.02]} />
              <meshStandardMaterial color="#0A0E17" />
            </mesh>
            <Text position={[0, 0, 0.02]} fontSize={0.16} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              Backup &amp; Sync
            </Text>
          </group>
        </group>
      </group>

      {/* ── 7. Potted Tropical Plants ── */}
      {/* Left Plant */}
      <group position={[-2.95, 0.65, -0.8]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.38, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#3E2723" roughness={0.9} />
        </mesh>
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.1, 0.38 + (i % 2) * 0.06, Math.sin(angle) * 0.1]}
            rotation={[0.35, angle, 0.25]}
          >
            <coneGeometry args={[0.12, 0.38, 5]} />
            <meshStandardMaterial color="#22C55E" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Right Plant */}
      <group position={[3.2, 0.65, -0.8]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.38, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#3E2723" roughness={0.9} />
        </mesh>
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.1, 0.38 + (i % 2) * 0.06, Math.sin(angle) * 0.1]}
            rotation={[0.35, angle, 0.25]}
          >
            <coneGeometry args={[0.12, 0.38, 5]} />
            <meshStandardMaterial color="#22C55E" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* ── 8. 4 Heavy Database Silos: PostgreSQL, MongoDB, MySQL, Supabase ── */}
      {/* Silo 1: PostgreSQL */}
      <group position={[-2.15, 1.75, 0.1]} rotation={[-0.08, 0, 0]}>
        {/* Main Tank Body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.62, 2.1, 32]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Top & Bottom Chrome Rims */}
        <mesh position={[0, 1.05, 0]}>
          <torusGeometry args={[0.63, 0.04, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <torusGeometry args={[0.63, 0.04, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
        </mesh>
        {/* Glowing Blue Horizontal Seam Rings */}
        {[-0.55, 0.55].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.625, 0.018, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
        ))}
        {/* PostgreSQL Exact Official 3D Elephant Logo */}
        <ExactTechIcon3D techId="postgresql" size={0.72} position={[0, 0.35, 0.64]} />
        {/* Label: PostgreSQL */}
        <Text
          position={[0, -0.15, 0.63]}
          fontSize={0.28}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          PostgreSQL
        </Text>
        {/* Subtitle Plaque: Relational DB */}
        <group position={[0, -0.55, 0.63]}>
          <mesh>
            <boxGeometry args={[1.05, 0.26, 0.04]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.8} />
          </mesh>
          <Text position={[0, 0, 0.025]} fontSize={0.14} color="#93C5FD" anchorX="center" anchorY="middle">
            Relational DB
          </Text>
        </group>
      </group>

      {/* Silo 2: MongoDB */}
      <group position={[-0.72, 1.75, 0.1]} rotation={[-0.08, 0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.62, 2.1, 32]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <torusGeometry args={[0.63, 0.04, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <torusGeometry args={[0.63, 0.04, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
        </mesh>
        {[-0.55, 0.55].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.625, 0.018, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
        ))}
        {/* MongoDB Exact Official 3D Green Leaf Logo */}
        <ExactTechIcon3D techId="mongodb" size={0.72} position={[0, 0.35, 0.64]} />
        {/* Label: MongoDB */}
        <Text
          position={[0, -0.15, 0.63]}
          fontSize={0.28}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          MongoDB
        </Text>
        {/* Subtitle Plaque: NoSQL DB */}
        <group position={[0, -0.55, 0.63]}>
          <mesh>
            <boxGeometry args={[1.0, 0.26, 0.04]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.8} />
          </mesh>
          <Text position={[0, 0, 0.025]} fontSize={0.14} color="#86EFAC" anchorX="center" anchorY="middle">
            NoSQL DB
          </Text>
        </group>
      </group>

      {/* Silo 3: MySQL */}
      <group position={[0.72, 1.75, 0.1]} rotation={[-0.08, 0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.62, 2.1, 32]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <torusGeometry args={[0.63, 0.04, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <torusGeometry args={[0.63, 0.04, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
        </mesh>
        {[-0.55, 0.55].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.625, 0.018, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
        ))}
        {/* MySQL Exact Official 3D Dolphin Logo */}
        <ExactTechIcon3D techId="mysql" size={0.72} position={[0, 0.35, 0.64]} />
        {/* Label: MySQL with orange SQL */}
        <group position={[0, -0.15, 0.63]}>
          <Text
            position={[-0.22, 0, 0]}
            fontSize={0.28}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000000"
          >
            My
          </Text>
          <Text
            position={[0.22, 0, 0]}
            fontSize={0.28}
            color="#F29111"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000000"
          >
            SQL
          </Text>
        </group>
        {/* Subtitle Plaque: Relational DB */}
        <group position={[0, -0.55, 0.63]}>
          <mesh>
            <boxGeometry args={[1.05, 0.26, 0.04]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.8} />
          </mesh>
          <Text position={[0, 0, 0.025]} fontSize={0.14} color="#67E8F9" anchorX="center" anchorY="middle">
            Relational DB
          </Text>
        </group>
      </group>

      {/* Silo 4: Supabase */}
      <group position={[2.15, 1.75, 0.1]} rotation={[-0.08, 0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.62, 2.1, 32]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <torusGeometry args={[0.63, 0.04, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <torusGeometry args={[0.63, 0.04, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
        </mesh>
        {[-0.55, 0.55].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.625, 0.018, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
        ))}
        {/* Supabase Exact Official 3D Emerald Lightning Logo */}
        <ExactTechIcon3D techId="supabase" size={0.72} position={[0, 0.35, 0.64]} />
        {/* Label: Supabase */}
        <Text
          position={[0, -0.15, 0.63]}
          fontSize={0.28}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          Supabase
        </Text>
        {/* Subtitle Plaque: Backend DB */}
        <group position={[0, -0.55, 0.63]}>
          <mesh>
            <boxGeometry args={[1.05, 0.26, 0.04]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.8} />
          </mesh>
          <Text position={[0, 0, 0.025]} fontSize={0.14} color="#6EE7B7" anchorX="center" anchorY="middle">
            Backend DB
          </Text>
        </group>
      </group>

      {/* ── 9. Base Platform with Blue Rim and Front Banner ── */}
      <group position={[0, 0.28, 0]}>
        {/* Main Base Slab resting on floor */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[9.6, 0.55, 4.0]} />
          <meshStandardMaterial
            color={darkMode ? '#1E293B' : '#E2E8F0'}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Blue bottom perimeter safety trim */}
        <mesh position={[0, -0.24, 0]}>
          <boxGeometry args={[9.7, 0.09, 4.1]} />
          <meshStandardMaterial
            color="#2563EB"
            emissive="#2563EB"
            emissiveIntensity={0.85}
          />
        </mesh>
        {/* Cyan horizontal LED accent strip across front step */}
        <mesh position={[0, 0.18, 2.01]}>
          <boxGeometry args={[9.0, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={1}
          />
        </mesh>
        {/* Front plaque: 4 Badges (Scalable Storage, High Availability, Fast Query, Cloud Ready) */}
        <group position={[0, 0.02, 2.06]} rotation={[-0.32, 0, 0]}>
          <mesh>
            <boxGeometry args={[8.4, 0.44, 0.06]} />
            <meshStandardMaterial
              color="#0A0E17"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
          {/* Badge 1: Scalable Storage */}
          <group position={[-3.15, 0, 0.04]}>
            <Text position={[0, 0, 0]} fontSize={0.18} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              🗄️ Scalable Storage
            </Text>
          </group>
          {/* Badge 2: High Availability */}
          <group position={[-1.05, 0, 0.04]}>
            <Text position={[0, 0, 0]} fontSize={0.18} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              🛡️ High Availability
            </Text>
          </group>
          {/* Badge 3: Fast Query */}
          <group position={[1.05, 0, 0.04]}>
            <Text position={[0, 0, 0]} fontSize={0.18} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              ⏱️ Fast Query
            </Text>
          </group>
          {/* Badge 4: Cloud Ready */}
          <group position={[3.15, 0, 0.04]}>
            <Text position={[0, 0, 0]} fontSize={0.18} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              ☁️ Cloud Ready
            </Text>
          </group>
        </group>

        {/* Cable Port Collar where the blue conduit plugs in on dais-facing bevel */}
        <group position={[3.8, 0.05, 1.7]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.06, 8, 16]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.04]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ─── Rotating 3D Cyan Gear Mesh (Forward-Facing, High-Fidelity) ────
function CyanGearMesh({ radius = 0.32, teeth = 8, speed = 1, color = '#00E5FF' }) {
  const gRef = useRef()
  useFrame((_, delta) => {
    if (gRef.current) gRef.current.rotation.z += delta * speed
  })

  return (
    <group ref={gRef}>
      {/* Outer gear rim */}
      <mesh>
        <cylinderGeometry args={[radius, radius, 0.05, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      {/* Chrome inner cutout torus */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.72, 0.024, 8, 24]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Center hub cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.35, radius * 0.35, 0.07, 16]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Gear Teeth around rim */}
      {Array.from({ length: teeth }).map((_, i) => {
        const a = (i * Math.PI * 2) / teeth
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[radius * 0.34, radius * 0.28, 0.05]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── Environment 2: Exact High-Detail Backend Platform (Top-Right) ──
// Faithfully matches the uploaded mechanical engine reference image with:
// • Polished chrome industrial pipe manifold looping overhead & interconnecting modules
// • Crystal-clear see-through glass chamber with 3 forward-facing rotating cyan gears
// • High-tech left server rack with animated equalizer bars and LED indicators
// • Angled code terminal monitor with syntax lines and animated pneumatic piston
// • Front tech modules with 3D badges (Node.js, Express, FastAPI, Python)
// • Top Backend sign with 3D gear and neon border
// • Placards for API Requests (incoming <<<) and API Response (outgoing >>>)
function BackendPlatformDetailed({ darkMode = true }) {
  const topGearRef = useRef()
  const chevronsLeftRef = useRef()
  const chevronsRightRef = useRef()
  const barsRef = useRef()
  const pistonRef = useRef()

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (topGearRef.current) topGearRef.current.rotation.z += delta * 0.8
    if (chevronsLeftRef.current) {
      chevronsLeftRef.current.position.x = 0.35 + ((t * 2.8) % 1) * 0.15
    }
    if (chevronsRightRef.current) {
      chevronsRightRef.current.position.x = -0.78 + ((t * 2.8) % 1) * 0.15
    }
    if (barsRef.current) {
      barsRef.current.children.forEach((bar, i) => {
        bar.scale.y = 0.2 + Math.abs(Math.sin(t * 3.5 + i * 0.85)) * 0.4
      })
    }
    if (pistonRef.current) {
      pistonRef.current.position.x = -0.05 + Math.sin(t * 4) * 0.12
    }
  })

  return (
    <group position={[4.6, 0, -3.2]} scale={[0.42, 0.42, 0.42]}>
      {/* ── 1. Top Industrial Sign: [ ⚙️ Backend ] ── */}
      <group position={[0, 4.45, 0]}>
        {/* Signboard casing */}
        <mesh castShadow>
          <boxGeometry args={[3.6, 0.82, 0.18]} />
          <meshStandardMaterial
            color={darkMode ? '#0A0E17' : '#1E293B'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Glowing Cyan Border Trim */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[3.68, 0.9, 0.16]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* 3D Cyan Gear Icon */}
        <group ref={topGearRef} position={[-1.1, 0, 0.11]}>
          <mesh>
            <cylinderGeometry args={[0.24, 0.24, 0.05, 18]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.03, 8, 18]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.9} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i * Math.PI) / 3
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 0.24, Math.sin(a) * 0.24, 0]}
                rotation={[0, 0, a]}
              >
                <boxGeometry args={[0.08, 0.08, 0.05]} />
                <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
              </mesh>
            )
          })}
        </group>
        {/* Bold White Text: Backend */}
        <Text
          position={[0.22, 0, 0.11]}
          fontSize={0.38}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          Backend
        </Text>
        {/* Mounting posts into pipe arch */}
        <mesh position={[-1.3, -0.52, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[1.3, -0.52, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ── 2. Full Industrial Chrome Pipe Architecture ── */}
      <group position={[0, 0, 0]}>
        {/* Main Overhead Cross-Pipe (spanning behind the sign) */}
        <mesh position={[0, 3.9, -0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 4.6, 24]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
        {/* Overhead cyan pipe collar rings */}
        {[-2.0, -1.3, 0, 1.3, 2.0].map((x, i) => (
          <mesh key={i} position={[x, 3.9, -0.1]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.13, 0.035, 8, 20]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.7} />
          </mesh>
        ))}

        {/* Left Vertical Down-Pipe from Overhead Arch */}
        <mesh position={[-2.3, 3.0, -0.1]}>
          <cylinderGeometry args={[0.11, 0.11, 1.8, 24]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
        {/* Left 90-degree Elbow joint */}
        <mesh position={[-2.3, 3.9, -0.1]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Right Vertical Down-Pipe from Overhead Arch */}
        <mesh position={[2.3, 3.0, -0.1]}>
          <cylinderGeometry args={[0.11, 0.11, 1.8, 24]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
        {/* Right 90-degree Elbow joint */}
        <mesh position={[2.3, 3.9, -0.1]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Left Horizontal Feeder Pipe (from API Requests to Chamber) */}
        <mesh position={[-2.7, 2.5, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 2.4, 20]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
        {[-3.6, -2.6, -1.7].map((x, i) => (
          <mesh key={i} position={[x, 2.5, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.11, 0.03, 8, 20]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
        ))}

        {/* Right Horizontal Feeder Pipe (from Chamber to API Response) */}
        <mesh position={[2.7, 2.5, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 2.4, 20]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
        {[1.7, 2.6, 3.6].map((x, i) => (
          <mesh key={i} position={[x, 2.5, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.11, 0.03, 8, 20]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
        ))}

        {/* Vertical Manifold Struts anchoring into Base */}
        <mesh position={[-1.6, 1.3, -0.4]}>
          <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[1.6, 1.3, -0.4]}>
          <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ── 3. Left Placard: API Requests ── */}
      <group position={[-4.1, 2.75, 0.2]} rotation={[-0.15, 0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.35, 1.35, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.4, 1.4, 0.06]} />
          <meshStandardMaterial color="#0284C7" />
        </mesh>
        {/* Globe network icon */}
        <group position={[0, 0.22, 0.05]}>
          <mesh>
            <sphereGeometry args={[0.22, 18, 18]} />
            <meshStandardMaterial color="#0284C7" metalness={0.3} roughness={0.3} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.225, 0.015, 8, 24]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.225, 0.015, 8, 24]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
        <Text
          position={[0, -0.22, 0.05]}
          fontSize={0.20}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.1}
          fontWeight="bold"
        >
          {'API\nRequests'}
        </Text>
        {/* Animated chevrons >>> */}
        <group ref={chevronsLeftRef} position={[0.78, 0, 0]}>
          <Text
            fontSize={0.28}
            color="#00D2FF"
            anchorX="center"
            anchorY="middle"
            letterSpacing={-0.08}
          >
            &gt;&gt;&gt;
          </Text>
        </group>
      </group>

      {/* ── 4. Right Placard: API Response ── */}
      <group position={[4.1, 2.75, 0.2]} rotation={[-0.15, -0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.35, 1.35, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.4, 1.4, 0.06]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
        {/* Green Checkmark Circle */}
        <group position={[0, 0.22, 0.05]}>
          <mesh>
            <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#10B981" roughness={0.3} />
          </mesh>
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
        <Text
          position={[0, -0.22, 0.05]}
          fontSize={0.20}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.1}
          fontWeight="bold"
        >
          {'API\nResponse'}
        </Text>
        {/* Animated chevrons >>> */}
        <group ref={chevronsRightRef} position={[-0.78, 0, 0]}>
          <Text
            fontSize={0.28}
            color="#00D2FF"
            anchorX="center"
            anchorY="middle"
            letterSpacing={-0.08}
          >
            &gt;&gt;&gt;
          </Text>
        </group>
      </group>

      {/* ── 5. Left High-Tech Analytics Server Tower ── */}
      <group position={[-3.25, 1.45, 0.25]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.8, 0.75]} />
          <meshStandardMaterial
            color={darkMode ? '#0F172A' : '#1E293B'}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
        {/* Vertical cyan neon trim */}
        <mesh position={[0.44, 0, 0.37]}>
          <boxGeometry args={[0.04, 1.76, 0.03]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.44, 0, 0.37]}>
          <boxGeometry args={[0.04, 1.76, 0.03]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
        </mesh>
        {/* Monitor Screen with dynamic bar chart */}
        <mesh position={[0, 0.35, 0.38]}>
          <planeGeometry args={[0.72, 0.75]} />
          <meshStandardMaterial color="#050B14" roughness={0.9} />
        </mesh>
        <group ref={barsRef} position={[-0.22, 0.15, 0.39]}>
          {[-0.08, 0.06, 0.2, 0.34, 0.48].map((x, i) => (
            <mesh key={i} position={[x, 0.2, 0]}>
              <planeGeometry args={[0.09, 0.5]} />
              <meshBasicMaterial color={i === 0 ? '#EAB308' : '#00D2FF'} />
            </mesh>
          ))}
        </group>
        {/* Status LED rows */}
        {[-0.2, -0.35, -0.5, -0.65].map((y, rowIdx) => (
          <group key={rowIdx} position={[0, y, 0.39]}>
            {[-0.25, -0.1, 0.05, 0.2].map((x, colIdx) => (
              <mesh key={colIdx} position={[x, 0, 0]}>
                <circleGeometry args={[0.025, 8]} />
                <meshBasicMaterial
                  color={colIdx === 0 && rowIdx === 0 ? '#EAB308' : '#00D2FF'}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* ── 6. Right Angled Terminal Monitor & Pneumatic Piston ── */}
      <group position={[3.2, 1.45, 0.35]}>
        {/* Angled Terminal Monitor */}
        <group position={[0, 0.55, 0]} rotation={[-0.15, -0.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.8, 0.08]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[1.12, 0.72]} />
            <meshStandardMaterial
              color="#050B14"
              emissive="#050B14"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[-0.4, 0.24, 0.05]}
            fontSize={0.12}
            color="#38BDF8"
            anchorX="center"
            anchorY="middle"
          >
            &lt;/&gt;
          </Text>
          {[-0.2, -0.08, 0.04, 0.16].map((y, i) => (
            <mesh key={i} position={[0.05, y, 0.05]}>
              <planeGeometry args={[0.7 - (i % 2) * 0.2, 0.04]} />
              <meshBasicMaterial
                color={i % 3 === 0 ? '#38BDF8' : i % 3 === 1 ? '#C084FC' : '#FB923C'}
              />
            </mesh>
          ))}
          <mesh position={[0, -0.44, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.15, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} />
          </mesh>
        </group>

        {/* Industrial Pneumatic Piston & Actuator */}
        <group position={[0.05, -0.4, -0.1]}>
          {/* Outer golden cylinder casing */}
          <mesh position={[-0.25, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.55, 16]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Moving polished chrome piston rod */}
          <group ref={pistonRef} position={[0.12, 0.15, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.42, 16]} />
              <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.08} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 7. Center Transparent Processing Chamber (NO BLACK DISCS!) ── */}
      <group position={[0, 2.35, 0]}>
        {/* Crystal-clear open-ended glass cylinder wall */}
        <mesh>
          <cylinderGeometry args={[1.45, 1.45, 0.95, 32, 1, true]} />
          <meshStandardMaterial
            color="#67E8F9"
            emissive="#00E5FF"
            emissiveIntensity={0.2}
            transparent
            opacity={0.28}
            roughness={0.08}
            metalness={0.15}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Top Metallic Torus Ring (Open ring, allows direct viewing inside!) */}
        <mesh position={[0, 0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.45, 0.045, 12, 36]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Bottom Metallic Torus Ring */}
        <mesh position={[0, -0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.45, 0.045, 12, 36]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* 3 Bright Forward-Facing Interlocking Cyan Gears inside the chamber */}
        <group position={[-0.46, 0.06, 0.04]}>
          <CyanGearMesh radius={0.29} teeth={8} speed={1.3} color="#00E5FF" />
        </group>
        <group position={[0.08, 0.14, -0.02]}>
          <CyanGearMesh radius={0.36} teeth={10} speed={-0.95} color="#38BDF8" />
        </group>
        <group position={[0.56, -0.06, 0.05]}>
          <CyanGearMesh radius={0.25} teeth={7} speed={1.5} color="#00E5FF" />
        </group>

        {/* Plaque: </> Processing (Application Logic) */}
        <group position={[0, -0.72, 0.65]} rotation={[-0.2, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 0.60, 0.12]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.85} roughness={0.2} />
          </mesh>
          <Text
            position={[-1.0, 0, 0.08]}
            fontSize={0.32}
            color="#00E5FF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            &lt;/&gt;
          </Text>
          <Text
            position={[0.26, 0.10, 0.08]}
            fontSize={0.20}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            Processing
          </Text>
          <Text
            position={[0.26, -0.12, 0.08]}
            fontSize={0.15}
            color="#94A3B8"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            (Application Logic)
          </Text>
        </group>

        {/* Glowing Horizontal Cyan Neon Light Bar */}
        <mesh position={[0, -1.04, 0.65]}>
          <boxGeometry args={[2.6, 0.06, 0.04]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* ── 8. 4 Front Tech Modules: Node.js, Express, FastAPI, Python (Fully Elevated & Visible) ── */}
      {/* Node.js Module */}
      <group position={[-2.15, 1.32, 1.45]} rotation={[-0.20, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.36, 1.40, 0.46]} />
          <meshStandardMaterial color="#0F172A" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.235]}>
          <boxGeometry args={[1.30, 1.34, 0.02]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.3} />
        </mesh>
        {/* Node.js Exact Official Green Hexagon Logo */}
        <ExactTechIcon3D techId="nodejs" size={0.78} position={[0, 0.22, 0.26]} />
        <Text
          position={[0, -0.28, 0.26]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#000000"
        >
          Node.js
        </Text>
      </group>

      {/* Express Module */}
      <group position={[-0.72, 1.32, 1.45]} rotation={[-0.20, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.36, 1.40, 0.46]} />
          <meshStandardMaterial color="#0F172A" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.235]}>
          <boxGeometry args={[1.30, 1.34, 0.02]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.3} />
        </mesh>
        {/* Express Exact Official Logo */}
        <ExactTechIcon3D techId="express" size={0.78} position={[0, 0.22, 0.26]} />
        <Text
          position={[0, -0.28, 0.26]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#000000"
        >
          Express
        </Text>
      </group>

      {/* FastAPI Module */}
      <group position={[0.72, 1.32, 1.45]} rotation={[-0.20, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.36, 1.40, 0.46]} />
          <meshStandardMaterial color="#0F172A" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.235]}>
          <boxGeometry args={[1.30, 1.34, 0.02]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.3} />
        </mesh>
        {/* FastAPI Exact Official Logo */}
        <ExactTechIcon3D techId="fastapi" size={0.78} position={[0, 0.22, 0.26]} />
        <Text
          position={[0, -0.28, 0.26]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#000000"
        >
          FastAPI
        </Text>
      </group>

      {/* Python Module */}
      <group position={[2.15, 1.32, 1.45]} rotation={[-0.20, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.36, 1.40, 0.46]} />
          <meshStandardMaterial color="#0F172A" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.235]}>
          <boxGeometry args={[1.30, 1.34, 0.02]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.3} />
        </mesh>
        {/* Python Exact Official Two-Toned Snakes Logo */}
        <ExactTechIcon3D techId="python" size={0.78} position={[0, 0.22, 0.26]} />
        <Text
          position={[0, -0.28, 0.26]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#000000"
        >
          Python
        </Text>
      </group>

      {/* ── 9. Base Platform with Orange Rim and Front Banner ── */}
      <group position={[0, 0.28, 0]}>
        {/* Main Base Slab resting on floor */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[9.6, 0.55, 4.0]} />
          <meshStandardMaterial
            color={darkMode ? '#1E293B' : '#E2E8F0'}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Orange bottom perimeter safety trim */}
        <mesh position={[0, -0.24, 0]}>
          <boxGeometry args={[9.7, 0.09, 4.1]} />
          <meshStandardMaterial
            color="#EA580C"
            emissive="#EA580C"
            emissiveIntensity={0.85}
          />
        </mesh>
        {/* Cyan horizontal LED accent strip across front step */}
        <mesh position={[0, 0.18, 2.01]}>
          <boxGeometry args={[9.0, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={1}
          />
        </mesh>
        {/* Front plaque: Build APIs • Handle Logic • Process Requests */}
        <group position={[0, 0.02, 2.06]} rotation={[-0.32, 0, 0]}>
          <mesh>
            <boxGeometry args={[6.6, 0.44, 0.06]} />
            <meshStandardMaterial
              color="#0A0E17"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
          <Text
            position={[-1.85, 0, 0.04]}
            fontSize={0.21}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            Build APIs
          </Text>
          <Text
            position={[-0.92, 0, 0.04]}
            fontSize={0.24}
            color="#00D2FF"
            anchorX="center"
            anchorY="middle"
          >
            •
          </Text>
          <Text
            position={[0, 0, 0.04]}
            fontSize={0.21}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            Handle Logic
          </Text>
          <Text
            position={[0.92, 0, 0.04]}
            fontSize={0.24}
            color="#00D2FF"
            anchorX="center"
            anchorY="middle"
          >
            •
          </Text>
          <Text
            position={[1.85, 0, 0.04]}
            fontSize={0.21}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            Process Requests
          </Text>
        </group>

        {/* Cable Port Collar where the orange conduit plugs in on front-left bevel */}
        <group position={[-3.8, 0.05, 1.7]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.06, 8, 16]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.04]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#EA580C" emissive="#EA580C" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ─── Environment 3: Exact High-Detail Frontend Platform (Bottom-Left) ──
// Faithfully matches the uploaded UI/UX creative studio reference image with:
// • Top [ 🖥️ Frontend ] sign with 3D monitor icon and electric neon border
// • Purple industrial pipe scaffolding looping overhead with cyan connector joints
// • Left floating cards: "UI/UX Design" (palette & wireframe) and "Components" (primitives & toggles)
// • Right floating cards: "Responsive" (multi-device wireframes) and "Performance" (speedometer & rising bars)
// • Central developer workstation: Oak desktop, ergonomic mesh chair, open laptop, pen holder with </>, dual monitors
// • Center widescreen monitor displaying rich web application (mountains, sun, search, CTA button)
// • Secondary angled code editor monitor with syntax lines and </> header
// • Potted tropical plants on both sides and a high-tech mini server tower with glowing </>
// • 4 Front tech modules with crystal-clear 3D emblems (JavaScript, React, Next.js, Tailwind CSS)
// • Base platform with purple perimeter trim and front plaque "Build Beautiful • Responsive • Modern UI"
function FrontendPlatformDetailed({ darkMode = true }) {
  const barsRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (barsRef.current) {
      barsRef.current.children.forEach((bar, i) => {
        bar.scale.y = 0.3 + Math.abs(Math.sin(t * 3 + i * 0.9)) * 0.45
      })
    }
  })

  return (
    <group position={[-4.6, 0, 3.2]} scale={[0.42, 0.42, 0.42]}>
      {/* ── 1. Top Industrial Sign: [ 🖥️ Frontend ] ── */}
      <group position={[0, 4.45, 0]}>
        {/* Signboard box */}
        <mesh castShadow>
          <boxGeometry args={[3.6, 0.82, 0.18]} />
          <meshStandardMaterial
            color={darkMode ? '#0A0E17' : '#1E293B'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Glowing Cyan/Purple Border Trim */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[3.68, 0.9, 0.16]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* 3D Cyan Monitor Icon on left */}
        <group position={[-1.1, 0, 0.11]}>
          <mesh>
            <boxGeometry args={[0.46, 0.32, 0.04]} />
            <meshStandardMaterial
              color="#00D2FF"
              emissive="#00D2FF"
              emissiveIntensity={0.85}
            />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[0.22, 0.02, 0.12]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        </group>
        {/* Bold White Text: Frontend */}
        <Text
          position={[0.22, 0, 0.11]}
          fontSize={0.38}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          Frontend
        </Text>
        {/* Mounting posts into purple pipe arch */}
        <mesh position={[-1.3, -0.52, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[1.3, -0.52, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ── 2. Full Purple Industrial Pipe Architecture ── */}
      <group position={[0, 0, 0]}>
        {/* Main Overhead Cross-Pipe */}
        <mesh position={[0, 3.9, -0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 4.6, 24]} />
          <meshStandardMaterial color="#9333EA" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Overhead cyan pipe collar rings */}
        {[-2.0, -1.3, 0, 1.3, 2.0].map((x, i) => (
          <mesh key={i} position={[x, 3.9, -0.1]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.13, 0.035, 8, 20]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
        ))}

        {/* Left Vertical Down-Pipe */}
        <mesh position={[-2.3, 3.0, -0.1]}>
          <cylinderGeometry args={[0.11, 0.11, 1.8, 24]} />
          <meshStandardMaterial color="#9333EA" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Left 90-degree Elbow joint */}
        <mesh position={[-2.3, 3.9, -0.1]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
        </mesh>

        {/* Right Vertical Down-Pipe */}
        <mesh position={[2.3, 3.0, -0.1]}>
          <cylinderGeometry args={[0.11, 0.11, 1.8, 24]} />
          <meshStandardMaterial color="#9333EA" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Right 90-degree Elbow joint */}
        <mesh position={[2.3, 3.9, -0.1]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
        </mesh>

        {/* Left Feeder Pipes to UI/UX and Components cards */}
        <mesh position={[-3.2, 2.75, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-3.2, 1.35, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.5} />
        </mesh>

        {/* Right Feeder Pipes to Responsive and Performance cards */}
        <mesh position={[3.2, 2.75, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[3.2, 1.35, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* ── 3. Left Placard 1: UI/UX Design (Top-Left) ── */}
      <group position={[-4.1, 2.75, 0.2]} rotation={[-0.15, 0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 1.25, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.46, 1.31, 0.06]} />
          <meshStandardMaterial color="#0284C7" />
        </mesh>
        {/* Header: Palette Icon + UI/UX Design */}
        <group position={[-0.45, 0.42, 0.05]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          <mesh position={[-0.04, 0.04, 0.012]}>
            <circleGeometry args={[0.02, 8]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
          <mesh position={[0.04, 0.04, 0.012]}>
            <circleGeometry args={[0.02, 8]} />
            <meshBasicMaterial color="#3B82F6" />
          </mesh>
          <mesh position={[0, -0.04, 0.012]}>
            <circleGeometry args={[0.02, 8]} />
            <meshBasicMaterial color="#EAB308" />
          </mesh>
        </group>
        <Text
          position={[0.1, 0.42, 0.05]}
          fontSize={0.20}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          UI/UX Design
        </Text>
        {/* Mini UI wireframe placeholder */}
        <mesh position={[-0.22, 0.04, 0.05]}>
          <planeGeometry args={[0.7, 0.46]} />
          <meshStandardMaterial color="#DBEAFE" />
        </mesh>
        {/* Mountain & Sun graphic inside wireframe */}
        <mesh position={[-0.22, 0.02, 0.055]}>
          <planeGeometry args={[0.55, 0.32]} />
          <meshStandardMaterial color="#3B82F6" />
        </mesh>
        <mesh position={[-0.1, 0.12, 0.06]}>
          <circleGeometry args={[0.04, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Dashed selection box with mouse cursor arrow */}
        <mesh position={[0.34, 0.02, 0.05]}>
          <planeGeometry args={[0.38, 0.42]} />
          <meshStandardMaterial color="#F1F5F9" />
        </mesh>
        <Text
          position={[0.38, 0.02, 0.06]}
          fontSize={0.2}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
        >
          ↖
        </Text>
        {/* Text layout skeleton bars */}
        {[-0.32, -0.42].map((y, i) => (
          <mesh key={i} position={[0, y, 0.05]}>
            <planeGeometry args={[1.1 - i * 0.3, 0.05]} />
            <meshStandardMaterial color="#CBD5E1" />
          </mesh>
        ))}
      </group>

      {/* ── 4. Left Placard 2: Components (Bottom-Left) ── */}
      <group position={[-4.1, 1.25, 0.2]} rotation={[-0.15, 0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 1.25, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.46, 1.31, 0.06]} />
          <meshStandardMaterial color="#0284C7" />
        </mesh>
        {/* Cube icon + Components */}
        <mesh position={[-0.45, 0.42, 0.05]}>
          <boxGeometry args={[0.12, 0.12, 0.04]} />
          <meshStandardMaterial color="#0284C7" />
        </mesh>
        <Text
          position={[0.1, 0.42, 0.05]}
          fontSize={0.20}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Components
        </Text>
        {/* Pill button */}
        <mesh position={[-0.28, 0.15, 0.05]}>
          <boxGeometry args={[0.42, 0.12, 0.02]} />
          <meshStandardMaterial color="#3B82F6" />
        </mesh>
        {/* 2x2 grid icon */}
        {[-0.05, 0.05].map((x, xi) =>
          [0.1, 0.2].map((y, yi) => (
            <mesh key={`${xi}-${yi}`} position={[0.15 + x, y, 0.05]}>
              <boxGeometry args={[0.07, 0.07, 0.02]} />
              <meshStandardMaterial color="#3B82F6" />
            </mesh>
          )),
        )}
        {/* 'T' text block */}
        <Text
          position={[0.42, 0.15, 0.05]}
          fontSize={0.18}
          color="#3B82F6"
          anchorX="center"
          anchorY="middle"
        >
          T
        </Text>
        {/* Active Toggle Switch */}
        <group position={[0, -0.15, 0.05]}>
          <mesh>
            <boxGeometry args={[0.55, 0.18, 0.02]} />
            <meshStandardMaterial color="#3B82F6" />
          </mesh>
          <mesh position={[0.16, 0, 0.015]}>
            <circleGeometry args={[0.07, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </group>

      {/* ── 5. Right Placard 3: Responsive (Top-Right) ── */}
      <group position={[4.1, 2.75, 0.2]} rotation={[-0.15, -0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 1.25, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.46, 1.31, 0.06]} />
          <meshStandardMaterial color="#0284C7" />
        </mesh>
        {/* Header: Cube icon + Responsive */}
        <mesh position={[-0.45, 0.42, 0.05]}>
          <boxGeometry args={[0.12, 0.12, 0.04]} />
          <meshStandardMaterial color="#0284C7" />
        </mesh>
        <Text
          position={[0.1, 0.42, 0.05]}
          fontSize={0.20}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Responsive
        </Text>
        {/* 3 Device Outlines: Desktop, Tablet, Mobile */}
        {/* Desktop */}
        <group position={[-0.38, -0.02, 0.05]}>
          <mesh>
            <boxGeometry args={[0.38, 0.28, 0.02]} />
            <meshStandardMaterial color="#0284C7" wireframe />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
        </group>
        {/* Tablet */}
        <mesh position={[0.04, -0.02, 0.05]}>
          <boxGeometry args={[0.26, 0.36, 0.02]} />
          <meshStandardMaterial color="#0284C7" wireframe />
        </mesh>
        {/* Mobile Phone */}
        <mesh position={[0.42, -0.02, 0.05]}>
          <boxGeometry args={[0.18, 0.34, 0.02]} />
          <meshStandardMaterial color="#0284C7" wireframe />
        </mesh>
      </group>

      {/* ── 6. Right Placard 4: Performance (Bottom-Right) ── */}
      <group position={[4.1, 1.25, 0.2]} rotation={[-0.15, -0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 1.25, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.46, 1.31, 0.06]} />
          <meshStandardMaterial color="#0284C7" />
        </mesh>
        {/* Speedometer Gauge Icon + Performance */}
        <group position={[-0.45, 0.42, 0.05]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          <mesh position={[0.02, 0.02, 0.015]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.02, 0.07, 0.01]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
        <Text
          position={[0.1, 0.42, 0.05]}
          fontSize={0.20}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Performance
        </Text>
        {/* 4 Rising Blue Performance Bars */}
        <group ref={barsRef} position={[-0.24, -0.15, 0.05]}>
          {[0.12, 0.22, 0.32, 0.42].map((x, i) => (
            <mesh key={i} position={[x, (i + 1) * 0.08, 0]}>
              <planeGeometry args={[0.07, (i + 1) * 0.16]} />
              <meshBasicMaterial color="#0284C7" />
            </mesh>
          ))}
        </group>
        {/* Green Circular Checkmark Badge */}
        <group position={[0.38, -0.02, 0.05]}>
          <mesh>
            <circleGeometry args={[0.12, 24]} />
            <meshStandardMaterial color="#10B981" />
          </mesh>
          <Text position={[0, 0, 0.02]} fontSize={0.16} color="#FFFFFF" anchorX="center" anchorY="middle">
            ✓
          </Text>
        </group>
      </group>

      {/* ── 7. Central Developer Workstation Desk & Chair ── */}
      <group position={[0, 0, 0]}>
        {/* Warm Oak Tabletop */}
        <mesh position={[0, 1.35, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[5.6, 0.16, 2.4]} />
          <meshStandardMaterial color="#D97706" metalness={0.2} roughness={0.4} />
        </mesh>
        {/* Desk Under-structure & Storage Drawers */}
        <group position={[0, 0.72, -0.2]}>
          {/* Left drawer pedestal */}
          <mesh position={[-2.1, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 1.1, 2.1]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
          </mesh>
          {[-0.25, 0.15].map((y, i) => (
            <mesh key={i} position={[-2.1, y, 1.07]}>
              <boxGeometry args={[0.4, 0.03, 0.04]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
            </mesh>
          ))}
          {/* Right drawer pedestal */}
          <mesh position={[2.1, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 1.1, 2.1]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
          </mesh>
          {[-0.25, 0.15].map((y, i) => (
            <mesh key={i} position={[2.1, y, 1.07]}>
              <boxGeometry args={[0.4, 0.03, 0.04]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
            </mesh>
          ))}
          {/* Center modesty panel */}
          <mesh position={[0, 0.1, -0.9]}>
            <boxGeometry args={[3.1, 0.9, 0.05]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>

        {/* Ergonomic Developer Chair */}
        <group position={[0, 1.15, 0.85]}>
          {/* Seat Cushion */}
          <mesh castShadow>
            <boxGeometry args={[0.75, 0.12, 0.75]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
          {/* Contoured Backrest */}
          <mesh position={[0, 0.52, -0.32]} rotation={[-0.08, 0, 0]} castShadow>
            <boxGeometry args={[0.68, 0.95, 0.1]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
          {/* Headrest */}
          <mesh position={[0, 1.08, -0.35]}>
            <boxGeometry args={[0.42, 0.18, 0.08]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          {/* Armrests */}
          <mesh position={[-0.42, 0.32, -0.05]}>
            <boxGeometry args={[0.08, 0.05, 0.42]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[0.42, 0.32, -0.05]}>
            <boxGeometry args={[0.08, 0.05, 0.42]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          {/* Chair Stem & Star Base */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.52, 12]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.58, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.04, 5]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>

        {/* Desk Accessories */}
        {/* Keyboard & Mousepad */}
        <group position={[-0.4, 1.45, 0.3]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.02, 0.38]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
          <mesh position={[0.85, 0, 0]}>
            <boxGeometry args={[0.14, 0.025, 0.22]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
        {/* Pen cup with </> emblem and colored pencils */}
        <group position={[-1.6, 1.55, 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.13, 0.11, 0.28, 16]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          <Text position={[0, 0, 0.135]} fontSize={0.12} color="#00D2FF" anchorX="center" anchorY="middle">
            &lt;/&gt;
          </Text>
          {[-0.04, 0, 0.04].map((x, i) => (
            <mesh key={i} position={[x, 0.18, 0]} rotation={[0.1, 0, (i - 1) * 0.15]}>
              <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
              <meshBasicMaterial color={i === 0 ? '#3B82F6' : i === 1 ? '#EAB308' : '#EF4444'} />
            </mesh>
          ))}
        </group>
        {/* Notebook stack */}
        <group position={[-1.15, 1.47, -0.4]}>
          <mesh>
            <boxGeometry args={[0.42, 0.06, 0.3]} />
            <meshStandardMaterial color="#1E3A8A" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.38, 0.04, 0.28]} />
            <meshStandardMaterial color="#F8FAFC" />
          </mesh>
        </group>
        {/* Open Laptop on Right */}
        <group position={[1.35, 1.52, 0.2]} rotation={[0, -0.28, 0]}>
          <mesh>
            <boxGeometry args={[0.75, 0.03, 0.52]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
          </mesh>
          <group position={[0, 0.02, -0.25]} rotation={[-1.7, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.75, 0.48, 0.02]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <planeGeometry args={[0.7, 0.44]} />
              <meshStandardMaterial color="#1E293B" emissive="#1E293B" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[-0.14, 0.08, 0.015]}>
              <planeGeometry args={[0.34, 0.22]} />
              <meshBasicMaterial color="#3B82F6" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 8. Dual Monitors: Center Widescreen & Secondary Code Monitor ── */}
      {/* Center Widescreen Monitor */}
      <group position={[0, 2.55, -0.35]}>
        {/* Monitor Bezel */}
        <mesh castShadow>
          <boxGeometry args={[2.9, 1.8, 0.08]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Top Window Header Bar with macOS dots */}
        <mesh position={[0, 0.81, 0.045]}>
          <planeGeometry args={[2.78, 0.12]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <group position={[-1.25, 0.81, 0.05]}>
          <circleGeometry args={[0.028, 12]} />
          <meshBasicMaterial color="#EF4444" />
        </group>
        <group position={[-1.17, 0.81, 0.05]}>
          <circleGeometry args={[0.028, 12]} />
          <meshBasicMaterial color="#EAB308" />
        </group>
        <group position={[-1.09, 0.81, 0.05]}>
          <circleGeometry args={[0.028, 12]} />
          <meshBasicMaterial color="#22C55E" />
        </group>
        {/* Main Display Screen */}
        <mesh position={[0, -0.06, 0.045]}>
          <planeGeometry args={[2.78, 1.6]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
        </mesh>
        {/* Blue Mountain Landscape Hero Banner */}
        <group position={[-0.45, 0.2, 0.05]}>
          <mesh>
            <planeGeometry args={[1.5, 0.95]} />
            <meshStandardMaterial color="#DBEAFE" />
          </mesh>
          {/* Dark blue mountains */}
          <mesh position={[-0.2, -0.15, 0.005]}>
            <planeGeometry args={[0.85, 0.55]} />
            <meshBasicMaterial color="#2563EB" />
          </mesh>
          <mesh position={[0.25, -0.2, 0.006]}>
            <planeGeometry args={[0.7, 0.45]} />
            <meshBasicMaterial color="#1D4ED8" />
          </mesh>
          {/* Glowing circular sun */}
          <mesh position={[0.3, 0.22, 0.005]}>
            <circleGeometry args={[0.1, 18]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
        {/* Right side web content cards & CTA button */}
        <group position={[0.72, 0.2, 0.05]}>
          {[0.3, 0.12, -0.06].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <planeGeometry args={[0.75, 0.08]} />
              <meshStandardMaterial color="#94A3B8" />
            </mesh>
          ))}
          {/* Blue CTA Button */}
          <mesh position={[0, -0.28, 0]}>
            <boxGeometry args={[0.55, 0.16, 0.02]} />
            <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.5} />
          </mesh>
        </group>
        {/* Monitor Heavy Stand */}
        <mesh position={[0, -1.02, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.45, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
        <mesh position={[0, -1.22, 0.1]}>
          <boxGeometry args={[0.85, 0.04, 0.48]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
      </group>

      {/* Secondary Angled Code Editor Monitor */}
      <group position={[1.85, 2.7, -0.1]} rotation={[0, -0.38, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 1.25, 0.06]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[1.42, 1.16]} />
          <meshStandardMaterial color="#050B14" emissive="#050B14" emissiveIntensity={0.6} />
        </mesh>
        {/* Cyan </> Header Tag */}
        <group position={[0.5, 0.44, 0.04]}>
          <mesh>
            <boxGeometry args={[0.26, 0.14, 0.02]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
          <Text position={[0, 0, 0.015]} fontSize={0.11} color="#000000" anchorX="center" anchorY="middle">
            &lt;/&gt;
          </Text>
        </group>
        {/* Colorful syntax-highlighted code lines */}
        {[-0.38, -0.26, -0.14, -0.02, 0.1, 0.22, 0.34].map((y, i) => (
          <mesh key={i} position={[-0.15 + (i % 3) * 0.05, y, 0.04]}>
            <planeGeometry args={[0.95 - (i % 2) * 0.25, 0.045]} />
            <meshBasicMaterial
              color={
                i % 4 === 0
                  ? '#38BDF8'
                  : i % 4 === 1
                  ? '#F59E0B'
                  : i % 4 === 2
                  ? '#10B981'
                  : '#C084FC'
              }
            />
          </mesh>
        ))}
      </group>

      {/* ── 9. Potted Plants & Right High-Tech Server Unit ── */}
      {/* Left Potted Tropical Plant */}
      <group position={[-2.95, 0.65, 0.6]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.24, 0.18, 0.42, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
          <meshStandardMaterial color="#3E2723" roughness={0.9} />
        </mesh>
        {[0, 1.1, 2.2, 3.3, 4.4, 5.5].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.12, 0.42 + (i % 2) * 0.08, Math.sin(angle) * 0.12]}
            rotation={[0.35, angle, 0.25]}
          >
            <coneGeometry args={[0.13, 0.44, 5]} />
            <meshStandardMaterial color="#22C55E" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Right Potted Tropical Plant */}
      <group position={[3.3, 0.65, 0.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.24, 0.18, 0.42, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
          <meshStandardMaterial color="#3E2723" roughness={0.9} />
        </mesh>
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.12, 0.42 + (i % 2) * 0.08, Math.sin(angle) * 0.12]}
            rotation={[0.35, angle, 0.25]}
          >
            <coneGeometry args={[0.13, 0.44, 5]} />
            <meshStandardMaterial color="#22C55E" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Right Mini-Server Tower with Glowing </> */}
      <group position={[2.65, 0.85, 0.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.95, 0.72]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.365]}>
          <planeGeometry args={[0.48, 0.88]} />
          <meshStandardMaterial color="#0A0E17" />
        </mesh>
        <Text position={[0, 0.2, 0.37]} fontSize={0.24} color="#00D2FF" anchorX="center" anchorY="middle">
          &lt;/&gt;
        </Text>
        {[-0.15, -0.28].map((y, i) => (
          <mesh key={i} position={[0, y, 0.37]}>
            <planeGeometry args={[0.38, 0.06]} />
            <meshBasicMaterial color="#0284C7" />
          </mesh>
        ))}
      </group>

      {/* ── 10. 4 Front Tech Modules: JavaScript, React, Next.js, Tailwind CSS (Fully Elevated & Visible) ── */}
      {/* JavaScript Module */}
      <group position={[-2.15, 1.32, 1.45]} rotation={[-0.20, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.36, 1.40, 0.46]} />
          <meshStandardMaterial color="#0F172A" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.235]}>
          <boxGeometry args={[1.30, 1.34, 0.02]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.3} />
        </mesh>
        {/* JavaScript Exact Official Yellow Badge Logo */}
        <ExactTechIcon3D techId="javascript" size={0.78} position={[0, 0.22, 0.26]} />
        <Text
          position={[0, -0.28, 0.26]}
          fontSize={0.23}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#000000"
        >
          JavaScript
        </Text>
      </group>

      {/* React Module */}
      <group position={[-0.72, 1.32, 1.45]} rotation={[-0.20, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.36, 1.40, 0.46]} />
          <meshStandardMaterial color="#0F172A" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.235]}>
          <boxGeometry args={[1.30, 1.34, 0.02]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.3} />
        </mesh>
        {/* React Exact Official Cyan Atom Logo */}
        <ExactTechIcon3D techId="react" size={0.78} position={[0, 0.22, 0.26]} />
        <Text
          position={[0, -0.28, 0.26]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#000000"
        >
          React
        </Text>
      </group>

      {/* Next.js Module */}
      <group position={[0.72, 1.32, 1.45]} rotation={[-0.20, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.36, 1.40, 0.46]} />
          <meshStandardMaterial color="#0F172A" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.235]}>
          <boxGeometry args={[1.30, 1.34, 0.02]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.3} />
        </mesh>
        {/* Next.js Exact Official Logo */}
        <ExactTechIcon3D techId="nextjs" size={0.78} position={[0, 0.22, 0.26]} />
        <Text
          position={[0, -0.28, 0.26]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#000000"
        >
          Next.js
        </Text>
      </group>

      {/* Tailwind CSS Module */}
      <group position={[2.15, 1.32, 1.45]} rotation={[-0.20, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.36, 1.40, 0.46]} />
          <meshStandardMaterial color="#0F172A" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.235]}>
          <boxGeometry args={[1.30, 1.34, 0.02]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.3} />
        </mesh>
        {/* Tailwind CSS Exact Official Dual-Wave Logo */}
        <ExactTechIcon3D techId="tailwind" size={0.78} position={[0, 0.22, 0.26]} />
        <Text
          position={[0, -0.28, 0.26]}
          fontSize={0.22}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#000000"
        >
          Tailwind CSS
        </Text>
      </group>

      {/* ── 11. Base Platform with Purple Rim and Front Banner ── */}
      <group position={[0, 0.28, 0]}>
        {/* Main Base Slab resting on floor */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[9.6, 0.55, 4.0]} />
          <meshStandardMaterial
            color={darkMode ? '#1E293B' : '#E2E8F0'}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Purple bottom perimeter trim */}
        <mesh position={[0, -0.24, 0]}>
          <boxGeometry args={[9.7, 0.09, 4.1]} />
          <meshStandardMaterial
            color="#9333EA"
            emissive="#9333EA"
            emissiveIntensity={0.85}
          />
        </mesh>
        {/* Cyan horizontal LED accent strip across front step */}
        <mesh position={[0, 0.18, 2.01]}>
          <boxGeometry args={[9.0, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={1}
          />
        </mesh>
        {/* Front plaque: Build Beautiful • Responsive • Modern UI */}
        <group position={[0, 0.02, 2.06]} rotation={[-0.32, 0, 0]}>
          <mesh>
            <boxGeometry args={[6.6, 0.44, 0.06]} />
            <meshStandardMaterial
              color="#0A0E17"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
          <Text
            position={[-1.85, 0, 0.04]}
            fontSize={0.21}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            Build Beautiful
          </Text>
          <Text
            position={[-0.85, 0, 0.04]}
            fontSize={0.24}
            color="#00D2FF"
            anchorX="center"
            anchorY="middle"
          >
            •
          </Text>
          <Text
            position={[0.05, 0, 0.04]}
            fontSize={0.21}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            Responsive
          </Text>
          <Text
            position={[0.95, 0, 0.04]}
            fontSize={0.24}
            color="#00D2FF"
            anchorX="center"
            anchorY="middle"
          >
            •
          </Text>
          <Text
            position={[1.85, 0, 0.04]}
            fontSize={0.21}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            Modern UI
          </Text>
        </group>

        {/* Cable Port Collar where the purple conduit plugs in on dais-facing side */}
        <group position={[3.8, 0.05, -1.7]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.06, 8, 16]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.04]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#9333EA" emissive="#9333EA" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ─── Environment 4: Exact High-Detail Tools Platform (Bottom-Right) ───
// Faithfully matches the uploaded developer workshop reference image with:
// • Top [ 🔧 Tools ] sign elevated high overhead with 3D wrench icon & electric cyan border
// • Intricate stepped electric blue hydraulic pipe manifold branching gracefully across the entire width
// • 6 suspended tool cards spanning the full width comfortably ABOVE the desk and monitor:
//   VS Code (Powerful IDE), Git (Version Control), GitHub (Repositories), Docker (Containers), Vercel (Deployment), Render (Hosting)
// • Central developer workstation desk placed in front with oak tabletop, keyboard, mouse, mug with </>, notebook stack
// • Main widescreen monitor completely unobstructed: left code editor pane + right visual Git branching graph with "✓ Build Success"
// • Left station: Heavy VS Code server chassis with 3D logo, vertical LED vents, potted plant, and angled Git Workflow monitor (Commit, Push, Pull Request, Merge)
// • Right station: 3 Stacked Docker metallic freight containers with realistic ridges & whale logo + angled Containers monitor (Running, 4 containers, live equalizer)
// • Base platform with green perimeter trim and front plaque: Development Workflow • CI/CD Automation • Deployment Pipeline • Scalable Infrastructure
function ToolsPlatformDetailed({ darkMode = true }) {
  const containerBarsRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (containerBarsRef.current) {
      containerBarsRef.current.children.forEach((bar, i) => {
        bar.scale.y = 0.3 + Math.abs(Math.sin(t * 3.5 + i * 0.9)) * 0.5
      })
    }
  })

  return (
    <group position={[4.6, 0, 3.2]} scale={[0.42, 0.42, 0.42]}>
      {/* ── 1. Top Industrial Sign: [ 🔧 Tools ] (High Overhead) ── */}
      <group position={[0, 5.85, -0.6]}>
        {/* Signboard casing */}
        <mesh castShadow>
          <boxGeometry args={[3.8, 0.88, 0.2]} />
          <meshStandardMaterial
            color={darkMode ? '#0A0E17' : '#1E293B'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Glowing Cyan Border Trim */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[3.9, 0.98, 0.18]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* 3D Cyan Mechanical Wrench Icon */}
        <group position={[-1.15, 0, 0.12]} rotation={[0, 0, Math.PI / 4]}>
          <mesh>
            <boxGeometry args={[0.08, 0.42, 0.04]} />
            <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <torusGeometry args={[0.09, 0.035, 8, 16, Math.PI * 1.5]} rotation={[0, 0, Math.PI / 4]} />
            <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} metalness={0.8} />
          </mesh>
        </group>
        {/* Bold White Text: Tools */}
        <Text
          position={[0.25, 0, 0.12]}
          fontSize={0.42}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          Tools
        </Text>
        {/* Mounting posts into overhead blue pipe arch */}
        <mesh position={[-1.4, -0.55, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.38, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[1.4, -0.55, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.38, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ── 2. Stepped Electric Blue Hydraulic Pipe Manifold (Full Width) ── */}
      <group position={[0, 0, -0.6]}>
        {/* Central Vertical Drop from Sign */}
        <mesh position={[0, 5.25, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 16]} />
          <meshStandardMaterial color="#0284C7" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Central T-Junction Sphere */}
        <mesh position={[0, 5.0, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Horizontal Main Runners Left & Right from Center */}
        {/* Left main pipe */}
        <mesh position={[-1.75, 5.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.085, 0.085, 3.5, 20]} />
          <meshStandardMaterial color="#0284C7" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Right main pipe */}
        <mesh position={[1.75, 5.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.085, 0.085, 3.5, 20]} />
          <meshStandardMaterial color="#0284C7" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Cyan Pipe Collar Rings at key branching junctions */}
        {[-3.5, -2.1, -0.7, 0, 0.7, 2.1, 3.5].map((x, i) => (
          <mesh key={i} position={[x, 5.0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.11, 0.03, 8, 20]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
          </mesh>
        ))}

        {/* 6 Down-Feeder Pipes Suspending the 6 Tool Cards */}
        {[-3.5, -2.1, -0.7, 0.7, 2.1, 3.5].map((x, i) => (
          <group key={i} position={[x, 4.65, 0]}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 0.55, 16]} />
              <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.075, 12, 12]} />
              <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.8} />
            </mesh>
          </group>
        ))}

        {/* Vertical Manifold Struts anchoring into Base on extreme sides */}
        <mesh position={[-3.8, 3.1, -0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 3.6, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[3.8, 3.1, -0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 3.6, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ── 3. 6 Suspended Tool Cards (Comfortably ABOVE desk and monitor) ── */}
      <group position={[0, 0, -0.4]}>
        {/* Card 1: VS Code */}
        <group position={[-3.5, 3.85, 0]} rotation={[-0.08, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.18, 1.48, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.015]}>
            <boxGeometry args={[1.24, 1.54, 0.05]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* VS Code Exact Official Ribbon Logo */}
          <ExactTechIcon3D techId="vscode" size={0.62} position={[0, 0.25, 0.04]} />
          <Text position={[0, -0.18, 0.04]} fontSize={0.21} color="#0F172A" anchorX="center" anchorY="middle">
            VS Code
          </Text>
          <Text position={[0, -0.42, 0.04]} fontSize={0.12} color="#64748B" anchorX="center" anchorY="middle">
            Powerful IDE
          </Text>
        </group>

        {/* Card 2: Git */}
        <group position={[-2.1, 3.85, 0]} rotation={[-0.08, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.18, 1.48, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.015]}>
            <boxGeometry args={[1.24, 1.54, 0.05]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* Git Exact Official Branching Logo */}
          <ExactTechIcon3D techId="git" size={0.62} position={[0, 0.25, 0.04]} />
          <Text position={[0, -0.18, 0.04]} fontSize={0.21} color="#0F172A" anchorX="center" anchorY="middle">
            Git
          </Text>
          <Text position={[0, -0.42, 0.04]} fontSize={0.12} color="#64748B" anchorX="center" anchorY="middle">
            Version Control
          </Text>
        </group>

        {/* Card 3: GitHub */}
        <group position={[-0.7, 3.85, 0]} rotation={[-0.08, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.18, 1.48, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.015]}>
            <boxGeometry args={[1.24, 1.54, 0.05]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* GitHub Exact Official Octocat Logo */}
          <ExactTechIcon3D techId="github" size={0.62} color="#181717" position={[0, 0.25, 0.04]} />
          <Text position={[0, -0.18, 0.04]} fontSize={0.21} color="#0F172A" anchorX="center" anchorY="middle">
            GitHub
          </Text>
          <Text position={[0, -0.42, 0.04]} fontSize={0.12} color="#64748B" anchorX="center" anchorY="middle">
            Repositories
          </Text>
        </group>

        {/* Card 4: Docker */}
        <group position={[0.7, 3.85, 0]} rotation={[-0.08, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.18, 1.48, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.015]}>
            <boxGeometry args={[1.24, 1.54, 0.05]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* Docker Exact Official Whale Logo */}
          <ExactTechIcon3D techId="docker" size={0.62} position={[0, 0.25, 0.04]} />
          <Text position={[0, -0.18, 0.04]} fontSize={0.21} color="#0F172A" anchorX="center" anchorY="middle">
            Docker
          </Text>
          <Text position={[0, -0.42, 0.04]} fontSize={0.12} color="#64748B" anchorX="center" anchorY="middle">
            Containers
          </Text>
        </group>

        {/* Card 5: Vercel */}
        <group position={[2.1, 3.85, 0]} rotation={[-0.08, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.18, 1.48, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.015]}>
            <boxGeometry args={[1.24, 1.54, 0.05]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* Vercel Exact Official Triangle Logo */}
          <ExactTechIcon3D techId="vercel" size={0.58} color="#000000" position={[0, 0.25, 0.04]} />
          <Text position={[0, -0.18, 0.04]} fontSize={0.21} color="#0F172A" anchorX="center" anchorY="middle">
            Vercel
          </Text>
          <Text position={[0, -0.42, 0.04]} fontSize={0.12} color="#64748B" anchorX="center" anchorY="middle">
            Deployment
          </Text>
        </group>

        {/* Card 6: Render */}
        <group position={[3.5, 3.85, 0]} rotation={[-0.08, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.18, 1.48, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.015]}>
            <boxGeometry args={[1.24, 1.54, 0.05]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* Render Exact Official Logo */}
          <ExactTechIcon3D techId="render" size={0.62} position={[0, 0.25, 0.04]} />
          <Text position={[0, -0.18, 0.04]} fontSize={0.21} color="#0F172A" anchorX="center" anchorY="middle">
            Render
          </Text>
          <Text position={[0, -0.42, 0.04]} fontSize={0.12} color="#64748B" anchorX="center" anchorY="middle">
            Hosting
          </Text>
        </group>
      </group>

      {/* ── 4. Central Developer Workstation Desk (Placed in FRONT, completely clear!) ── */}
      <group position={[0, 0, 0.2]}>
        {/* Warm Oak Wood Tabletop */}
        <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.6, 0.16, 2.2]} />
          <meshStandardMaterial color="#D97706" metalness={0.2} roughness={0.4} />
        </mesh>
        {/* Desk Under-structure */}
        <group position={[0, 0.72, 0]}>
          <mesh position={[-2.1, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 1.1, 1.9]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[2.1, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 1.1, 1.9]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.1, -0.85]}>
            <boxGeometry args={[3.1, 0.9, 0.05]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>

        {/* Desk Accessories */}
        {/* Keyboard & Mouse on Desk Front */}
        <group position={[-0.2, 1.45, 0.6]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.3, 0.02, 0.38]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
          <mesh position={[0.9, 0, 0]}>
            <boxGeometry args={[0.15, 0.025, 0.24]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
        {/* Documentation books stack */}
        <group position={[-1.8, 1.48, 0.2]}>
          <mesh>
            <boxGeometry args={[0.48, 0.07, 0.34]} />
            <meshStandardMaterial color="#1E3A8A" />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.44, 0.05, 0.3]} />
            <meshStandardMaterial color="#F8FAFC" />
          </mesh>
        </group>
        {/* Coffee Mug with </> emblem */}
        <group position={[1.7, 1.52, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.13, 0.1, 0.25, 16]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          <Text position={[0, 0, 0.135]} fontSize={0.12} color="#00D2FF" anchorX="center" anchorY="middle">
            &lt;/&gt;
          </Text>
        </group>

        {/* Main Widescreen Display: Left Code + Right Git Graph (Completely Clear & Unobstructed!) */}
        <group position={[0, 2.25, -0.05]}>
          <mesh castShadow>
            <boxGeometry args={[3.0, 1.7, 0.08]} />
            <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Window Top Bar with macOS dots */}
          <mesh position={[0, 0.76, 0.045]}>
            <planeGeometry args={[2.88, 0.11]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <group position={[-1.3, 0.76, 0.05]}>
            <circleGeometry args={[0.026, 12]} />
            <meshBasicMaterial color="#EF4444" />
          </group>
          <group position={[-1.22, 0.76, 0.05]}>
            <circleGeometry args={[0.026, 12]} />
            <meshBasicMaterial color="#EAB308" />
          </group>
          <group position={[-1.14, 0.76, 0.05]}>
            <circleGeometry args={[0.026, 12]} />
            <meshBasicMaterial color="#22C55E" />
          </group>
          {/* Main Display Pane */}
          <mesh position={[0, -0.06, 0.045]}>
            <planeGeometry args={[2.88, 1.5]} />
            <meshStandardMaterial color="#050B14" emissive="#050B14" emissiveIntensity={0.65} />
          </mesh>

          {/* Left Code Editor Pane */}
          <group position={[-0.68, -0.06, 0.05]}>
            {/* Explorer sidebar */}
            <mesh position={[-0.56, 0, 0]}>
              <planeGeometry args={[0.26, 1.46]} />
              <meshStandardMaterial color="#0A0E17" />
            </mesh>
            {/* Syntax lines */}
            {[-0.5, -0.37, -0.24, -0.11, 0.02, 0.15, 0.28, 0.41, 0.54].map((y, i) => (
              <mesh key={i} position={[-0.04 + (i % 3) * 0.05, y, 0]}>
                <planeGeometry args={[0.82 - (i % 2) * 0.2, 0.048]} />
                <meshBasicMaterial
                  color={
                    i % 4 === 0
                      ? '#38BDF8'
                      : i % 4 === 1
                      ? '#F59E0B'
                      : i % 4 === 2
                      ? '#10B981'
                      : '#C084FC'
                  }
                />
              </mesh>
            ))}
          </group>

          {/* Right Visual Git Branching Graph */}
          <group position={[0.74, -0.06, 0.05]}>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[1.25, 1.46]} />
              <meshStandardMaterial color="#0B132B" />
            </mesh>
            {/* Git Branch Lines */}
            <mesh position={[-0.2, 0, 0.005]}>
              <planeGeometry args={[0.03, 1.1]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
            <mesh position={[0.2, 0.08, 0.005]}>
              <planeGeometry args={[0.03, 0.7]} />
              <meshBasicMaterial color="#C084FC" />
            </mesh>
            {/* Connected Nodes */}
            {[
              { x: -0.2, y: -0.42, color: '#38BDF8' },
              { x: -0.2, y: -0.16, color: '#38BDF8' },
              { x: -0.2, y: 0.12, color: '#38BDF8' },
              { x: 0.2, y: 0.08, color: '#C084FC' },
              { x: 0.2, y: 0.35, color: '#C084FC' },
              { x: -0.2, y: 0.45, color: '#10B981' },
            ].map((node, i) => (
              <mesh key={i} position={[node.x, node.y, 0.01]}>
                <circleGeometry args={[0.055, 16]} />
                <meshBasicMaterial color={node.color} />
              </mesh>
            ))}
            {/* Build Success Pill Badge */}
            <group position={[0.08, -0.48, 0.01]}>
              <mesh>
                <boxGeometry args={[0.9, 0.18, 0.02]} />
                <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.6} />
              </mesh>
              <Text position={[0, 0, 0.015]} fontSize={0.16} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
                ✓ Build Success
              </Text>
            </group>
          </group>

          {/* Monitor Stand */}
          <mesh position={[0, -0.96, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.42, 16]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
          <mesh position={[0, -1.18, 0.1]}>
            <boxGeometry args={[0.85, 0.04, 0.45]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* ── 5. Left Station: VS Code Server Chassis & Git Workflow Screen ── */}
      <group position={[-3.3, 1.4, 0.2]}>
        {/* VS Code Tower Chassis */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.95, 1.9, 1.25]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Large 3D VS Code Ribbon on side panel */}
        <ExactTechIcon3D
          techId="vscode"
          size={0.85}
          position={[-0.49, 0.15, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        {/* Front LED vents */}
        <group position={[0, 0, 0.64]}>
          {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <boxGeometry args={[0.75, 0.04, 0.02]} />
              <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.85} />
            </mesh>
          ))}
        </group>

        {/* Potted Plant */}
        <group position={[0.8, -0.3, 0.7]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.15, 0.38, 16]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.19, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
            <meshStandardMaterial color="#3E2723" roughness={0.9} />
          </mesh>
          {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.09, 0.36 + (i % 2) * 0.05, Math.sin(angle) * 0.09]}
              rotation={[0.35, angle, 0.25]}
            >
              <coneGeometry args={[0.11, 0.38, 5]} />
              <meshStandardMaterial color="#22C55E" roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* Angled Git Workflow Monitor */}
        <group position={[1.45, 0, 0.65]} rotation={[-0.15, 0.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.35, 1.25, 0.07]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[1.27, 1.17]} />
            <meshStandardMaterial color="#050B14" emissive="#050B14" emissiveIntensity={0.65} />
          </mesh>
          {/* Header: Branch Icon + Git Workflow */}
          <group position={[-0.48, 0.44, 0.045]}>
            <circleGeometry args={[0.04, 10]} />
            <meshBasicMaterial color="#00D2FF" />
          </group>
          <Text position={[0.12, 0.44, 0.045]} fontSize={0.20} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
            Git Workflow
          </Text>
          {/* 4 Checklist Rows */}
          {[
            { label: 'Commit', y: 0.18 },
            { label: 'Push', y: 0.03 },
            { label: 'Pull Request', y: -0.12 },
            { label: 'Merge', y: -0.27 },
          ].map((item, i) => (
            <group key={i} position={[-0.45, item.y, 0.045]}>
              <mesh position={[0.07, 0, 0]}>
                <circleGeometry args={[0.04, 12]} />
                <meshBasicMaterial color="#22C55E" />
              </mesh>
              <Text position={[0.18, 0, 0.01]} fontSize={0.07} color="#FFFFFF" anchorX="center" anchorY="middle">
                ✓
              </Text>
              <Text position={[0.52, 0, 0]} fontSize={0.15} color="#E2E8F0" anchorX="center" anchorY="middle" fontWeight="bold">
                {item.label}
              </Text>
            </group>
          ))}
          {/* Stand */}
          <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.2, 12]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
        </group>
      </group>

      {/* ── 6. Right Station: Stacked Docker Containers & Container Monitor ── */}
      <group position={[2.7, 1.15, 0.0]}>
        {/* 3 Stacked Docker Freight Containers */}
        {/* Bottom Left Container */}
        <group position={[-0.55, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.96, 0.58, 1.4]} />
            <meshStandardMaterial color="#0284C7" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Corrugated ribs */}
          {[-0.5, -0.25, 0, 0.25, 0.5].map((z, i) => (
            <mesh key={i} position={[0.49, 0, z]}>
              <boxGeometry args={[0.02, 0.54, 0.06]} />
              <meshStandardMaterial color="#0369A1" />
            </mesh>
          ))}
          {/* Whale Stencil */}
          <group position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.36, 0.16, 0.02]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
        </group>

        {/* Bottom Right Container */}
        <group position={[0.55, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.96, 0.58, 1.4]} />
            <meshStandardMaterial color="#0369A1" metalness={0.6} roughness={0.4} />
          </mesh>
          {[-0.5, -0.25, 0, 0.25, 0.5].map((z, i) => (
            <mesh key={i} position={[0.49, 0, z]}>
              <boxGeometry args={[0.02, 0.54, 0.06]} />
              <meshStandardMaterial color="#0284C7" />
            </mesh>
          ))}
        </group>

        {/* Top Container */}
        <group position={[0, 0.62, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.58, 1.4]} />
            <meshStandardMaterial color="#0284C7" metalness={0.6} roughness={0.4} />
          </mesh>
          <group position={[0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.36, 0.16, 0.02]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
        </group>

        {/* Angled Container Monitor */}
        <group position={[1.4, 0.15, 0.7]} rotation={[-0.15, -0.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.3, 1.1, 0.07]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[1.23, 1.03]} />
            <meshStandardMaterial color="#050B14" emissive="#050B14" emissiveIntensity={0.65} />
          </mesh>
          <Text position={[0, 0.38, 0.045]} fontSize={0.20} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
            Containers
          </Text>
          {/* Green Running Badge */}
          <group position={[-0.24, 0.15, 0.045]}>
            <mesh>
              <boxGeometry args={[0.56, 0.16, 0.02]} />
              <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.6} />
            </mesh>
            <Text position={[0, 0, 0.015]} fontSize={0.13} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              ✓ Running
            </Text>
          </group>
          <Text position={[0.28, 0.15, 0.045]} fontSize={0.13} color="#94A3B8" anchorX="center" anchorY="middle" fontWeight="bold">
            4 containers
          </Text>
          {/* Dynamic rising container activity bars */}
          <group ref={containerBarsRef} position={[-0.35, -0.22, 0.045]}>
            {[0.12, 0.24, 0.36, 0.48, 0.6].map((x, i) => (
              <mesh key={i} position={[x, (i + 1) * 0.038, 0]}>
                <planeGeometry args={[0.08, (i + 1) * 0.12]} />
                <meshBasicMaterial color="#0284C7" />
              </mesh>
            ))}
          </group>
          {/* Stand */}
          <mesh position={[0, -0.62, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.2, 12]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
        </group>
      </group>

      {/* ── 7. Base Platform with Green Rim and Front Banner ── */}
      <group position={[0, 0.28, 0]}>
        {/* Main Base Slab resting on floor */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[9.6, 0.55, 4.0]} />
          <meshStandardMaterial
            color={darkMode ? '#1E293B' : '#E2E8F0'}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Green bottom perimeter safety trim */}
        <mesh position={[0, -0.24, 0]}>
          <boxGeometry args={[9.7, 0.09, 4.1]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={0.85}
          />
        </mesh>
        {/* Cyan horizontal LED accent strip across front step */}
        <mesh position={[0, 0.18, 2.01]}>
          <boxGeometry args={[9.0, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={1}
          />
        </mesh>
        {/* Front plaque: 4 Badges */}
        <group position={[0, 0.02, 2.06]} rotation={[-0.32, 0, 0]}>
          <mesh>
            <boxGeometry args={[8.4, 0.44, 0.06]} />
            <meshStandardMaterial
              color="#0A0E17"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
          {/* Badge 1: Development Workflow */}
          <group position={[-3.15, 0, 0.04]}>
            <Text position={[0, 0, 0]} fontSize={0.18} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              ⚙️ Development Workflow
            </Text>
          </group>
          {/* Badge 2: CI/CD Automation */}
          <group position={[-1.05, 0, 0.04]}>
            <Text position={[0, 0, 0]} fontSize={0.18} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              ⚡ CI/CD Automation
            </Text>
          </group>
          {/* Badge 3: Deployment Pipeline */}
          <group position={[1.05, 0, 0.04]}>
            <Text position={[0, 0, 0]} fontSize={0.18} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              ☁️ Deployment Pipeline
            </Text>
          </group>
          {/* Badge 4: Scalable Infrastructure */}
          <group position={[3.15, 0, 0.04]}>
            <Text position={[0, 0, 0]} fontSize={0.18} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight="bold">
              🛡️ Scalable Infrastructure
            </Text>
          </group>
        </group>

        {/* Cable Port Collar where the green conduit plugs in on dais-facing bevel */}
        <group position={[-3.8, 0.05, -1.7]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.06, 8, 16]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.04]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ─── Master 3D Ecosystem Scene ──────────────────────────────
// Choreographed Staged Entrance Order:
// 1. Center Seat (Dais) rises first (0.0s - 0.8s)
// 2. Center Man comes down and sits solidly (0.8s - 1.6s)
// 3. Cables connect outwards (1.5s - 2.3s)
// 4. Platforms arrive in sequence from different positions:
//    - Database Platform (Top-Left: 1.8s - 2.5s)
//    - Backend Platform (Top-Right: 2.3s - 3.0s)
//    - Frontend Platform (Bottom-Left: 2.8s - 3.5s)
//    - Tools Platform (Bottom-Right: 3.3s - 4.0s)
// Static & Solid: NO up/down movement on title or man after arrival!
function easeOutBack(x) {
  const c1 = 1.25
  const c3 = c1 + 1
  const t = Math.max(0, Math.min(1, x))
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
function easeOutCubic(x) {
  const t = Math.max(0, Math.min(1, x))
  return 1 - Math.pow(1 - t, 3)
}

// ─── Cinematic Tour Controller: Zoom Showcase of Each -> 360° Rotate Without Zoom -> Repeat ────
// 1. Man -> Frontend -> Backend -> Database -> Tools, each holding for 2 full seconds in front of user showing all structure, then zooming out.
// 2. After the zoom-in showcase round of each one, rotates 360° in overview without zoom.
// 3. Then seamlessly returns to zoom for the next round!

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const TOUR_STATIONS = [
  {
    name: 'man',
    target: new THREE.Vector3(0, 1.25, 0),
    cameraPos: new THREE.Vector3(0, 2.1, 5.4),
    fov: 36,
    overviewAngle: 0,
  },
  {
    name: 'frontend',
    target: new THREE.Vector3(-4.6, 1.0, 3.2),
    cameraPos: new THREE.Vector3(-4.6, 1.85, 8.2),
    fov: 36,
    overviewAngle: -0.65,
  },
  {
    name: 'backend',
    target: new THREE.Vector3(4.6, 1.0, -3.2),
    cameraPos: new THREE.Vector3(4.6, 1.85, 1.8),
    fov: 36,
    overviewAngle: 2.3,
  },
  {
    name: 'database',
    target: new THREE.Vector3(-4.6, 1.0, -3.2),
    cameraPos: new THREE.Vector3(-4.6, 1.85, 1.8),
    fov: 36,
    overviewAngle: -2.3,
  },
  {
    name: 'tools',
    target: new THREE.Vector3(4.6, 1.0, 3.2),
    cameraPos: new THREE.Vector3(4.6, 1.85, 8.2),
    fov: 36,
    overviewAngle: 0.65,
  },
]

const ZOOM_CYCLE_TIME = TOUR_STATIONS.length * 4.0 // 5 stations * 4.0s = 20.0s
const ROTATE_CYCLE_TIME = 12.0 // 12.0s smooth 360° rotation without zoom
const TOTAL_MACRO_CYCLE = ZOOM_CYCLE_TIME + ROTATE_CYCLE_TIME // 32.0s total

function CameraTourController({ tourStationRef }) {
  const { camera } = useThree()
  const controlsRef = useRef()
  const isUserInteracting = useRef(false)
  const lastInteractionTime = useRef(0)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const onStart = () => {
      isUserInteracting.current = true
    }
    const onEnd = () => {
      isUserInteracting.current = false
      lastInteractionTime.current = performance.now()
    }

    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)
    return () => {
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
    }
  }, [])

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime()
    const controls = controlsRef.current
    if (!controls) return

    // 1. Initial entrance animation window (0.0s - 4.5s): stay steady at front overview
    if (elapsed < 4.5) {
      controls.target.set(0, 0.9, 0)
      controls.update()
      return
    }

    // 2. Check if user is manually interacting
    const timeSinceInteraction = (performance.now() - lastInteractionTime.current) / 1000
    const userActive = isUserInteracting.current || timeSinceInteraction < 1.5

    if (userActive) {
      if (tourStationRef) {
        tourStationRef.current = { stationIndex: -1, approach: 0 }
      }
      controls.update()
      return
    }

    const tourTime = elapsed - 4.5
    const macroTime = tourTime % TOTAL_MACRO_CYCLE

    // PHASE 1: Zoom-In Showcase of Each Station (0.0s - 20.0s)
    if (macroTime < ZOOM_CYCLE_TIME) {
      const stationIdx = Math.floor(macroTime / 4.0)
      const localTime = macroTime % 4.0

      // Compute approach factor (0 -> 1 zoom in, 1 for 2.0s hold, 1 -> 0 zoom out)
      let p = 0
      if (localTime < 1.0) {
        p = easeInOutQuad(localTime / 1.0)
      } else if (localTime < 3.0) {
        p = 1.0 // 2 seconds stationary hold showing all structure in front of user!
      } else {
        p = 1.0 - easeInOutQuad((localTime - 3.0) / 1.0)
      }

      if (tourStationRef) {
        tourStationRef.current = {
          stationIndex: stationIdx,
          approach: p,
        }
      }

      const station = TOUR_STATIONS[stationIdx]
      const nextStation = TOUR_STATIONS[(stationIdx + 1) % TOUR_STATIONS.length]

      // Overview transition path between stations
      const angleInterpolation = station.overviewAngle + (nextStation.overviewAngle - station.overviewAngle) * (localTime / 4.0)
      const overviewCamPos = new THREE.Vector3(
        Math.sin(angleInterpolation) * 14.5,
        8.4,
        Math.cos(angleInterpolation) * 14.5
      )
      const overviewTarget = new THREE.Vector3(0, 0.9, 0)
      const overviewFov = 46

      const activeTarget = new THREE.Vector3().lerpVectors(overviewTarget, station.target, p)
      const activeCamPos = new THREE.Vector3().lerpVectors(overviewCamPos, station.cameraPos, p)
      const activeFov = THREE.MathUtils.lerp(overviewFov, station.fov, p)

      camera.fov = THREE.MathUtils.lerp(camera.fov, activeFov, delta * 3.5)
      camera.updateProjectionMatrix()

      controls.target.lerp(activeTarget, delta * 4.0)
      camera.position.lerp(activeCamPos, delta * 4.0)
    } else {
      // PHASE 2: Rotate without zoom then return to zoom (20.0s - 32.0s)
      if (tourStationRef) {
        tourStationRef.current = { stationIndex: -1, approach: 0 }
      }

      const rotateTime = macroTime - ZOOM_CYCLE_TIME
      const orbitProgress = rotateTime / ROTATE_CYCLE_TIME
      const orbitAngle = orbitProgress * Math.PI * 2

      const overviewCamPos = new THREE.Vector3(
        Math.sin(orbitAngle) * 14.5,
        8.4,
        Math.cos(orbitAngle) * 14.5
      )
      const overviewTarget = new THREE.Vector3(0, 0.9, 0)

      camera.fov = THREE.MathUtils.lerp(camera.fov, 46, delta * 3.5)
      camera.updateProjectionMatrix()

      controls.target.lerp(overviewTarget, delta * 4.0)
      camera.position.lerp(overviewCamPos, delta * 4.0)
    }

    controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={Math.PI / 4.8}
      dampingFactor={0.06}
    />
  )
}

export default function EcosystemScene3D({ darkMode = true }) {
  const daisRef = useRef()
  const manRef = useRef()
  const cablesRef = useRef()
  const dbRef = useRef()
  const backendRef = useRef()
  const frontendRef = useRef()
  const toolsRef = useRef()

  const tourStationRef = useRef({ stationIndex: 0, approach: 0 })

  const curves = useMemo(() => {
    return CABLE_CONFIGS.map((cfg) => ({
      ...cfg,
      curve: new THREE.CatmullRomCurve3(cfg.points),
    }))
  }, [])


  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    
    // Tour offsets when entrance is completed:
    if (elapsed > 4.5) {
      const { stationIndex, approach } = tourStationRef.current

      // Man zoom in and comes to the user (subtle lift and forward float)
      if (manRef.current) {
        const manP = stationIndex === 0 ? approach : 0
        manRef.current.position.set(0, 1.28 + manP * 0.10, manP * 0.22)
        manRef.current.scale.setScalar(1 + manP * 0.05)
      }

      // Frontend zoom in and comes to the user (cleanly reveals entire structure)
      if (frontendRef.current) {
        const fP = stationIndex === 1 ? approach : 0
        frontendRef.current.position.set(0, fP * 0.12, fP * 0.18)
        frontendRef.current.scale.setScalar(1 + fP * 0.03)
      }

      // Backend zoom in and comes to the user (cleanly reveals entire structure)
      if (backendRef.current) {
        const bP = stationIndex === 2 ? approach : 0
        backendRef.current.position.set(0, bP * 0.12, bP * 0.18)
        backendRef.current.scale.setScalar(1 + bP * 0.03)
      }

      // Database zoom in and comes to the user (cleanly reveals entire structure)
      if (dbRef.current) {
        const dbP = stationIndex === 3 ? approach : 0
        dbRef.current.position.set(0, dbP * 0.12, dbP * 0.18)
        dbRef.current.scale.setScalar(1 + dbP * 0.03)
      }

      // Tools zoom in and comes to the user (cleanly reveals entire structure)
      if (toolsRef.current) {
        const tP = stationIndex === 4 ? approach : 0
        toolsRef.current.position.set(0, tP * 0.12, tP * 0.18)
        toolsRef.current.scale.setScalar(1 + tP * 0.03)
      }

      return
    }

    // 1. Center Seat (Dais) appears first
    if (daisRef.current) {
      const p = easeOutBack(elapsed / 0.8)
      daisRef.current.position.y = -2.5 * (1 - p)
      daisRef.current.scale.setScalar(0.2 + 0.8 * p)
    }

    // 2. Man comes down from above and sits down
    if (manRef.current) {
      if (elapsed < 0.8) {
        manRef.current.scale.setScalar(0)
        manRef.current.position.y = 3.5
      } else {
        const p = easeOutBack((elapsed - 0.8) / 0.8)
        manRef.current.scale.setScalar(p)
        manRef.current.position.y = 1.28 + (1 - p) * 2.2
      }
    }

    // 3. Cables connect outwards
    if (cablesRef.current) {
      if (elapsed < 1.5) {
        cablesRef.current.scale.setScalar(0)
      } else {
        const p = easeOutCubic((elapsed - 1.5) / 0.8)
        cablesRef.current.scale.setScalar(p)
      }
    }

    // 4. Platforms arrive in order and in different positions:
    // 4a. Database Platform (Top-Left)
    if (dbRef.current) {
      if (elapsed < 1.8) {
        dbRef.current.scale.setScalar(0)
        dbRef.current.position.y = -3.5
      } else {
        const p = easeOutBack((elapsed - 1.8) / 0.7)
        dbRef.current.scale.setScalar(p)
        dbRef.current.position.y = -3.5 * (1 - p)
      }
    }

    // 4b. Backend Platform (Top-Right)
    if (backendRef.current) {
      if (elapsed < 2.3) {
        backendRef.current.scale.setScalar(0)
        backendRef.current.position.y = -3.5
      } else {
        const p = easeOutBack((elapsed - 2.3) / 0.7)
        backendRef.current.scale.setScalar(p)
        backendRef.current.position.y = -3.5 * (1 - p)
      }
    }

    // 4c. Frontend Platform (Bottom-Left)
    if (frontendRef.current) {
      if (elapsed < 2.8) {
        frontendRef.current.scale.setScalar(0)
        frontendRef.current.position.y = -3.5
      } else {
        const p = easeOutBack((elapsed - 2.8) / 0.7)
        frontendRef.current.scale.setScalar(p)
        frontendRef.current.position.y = -3.5 * (1 - p)
      }
    }

    // 4d. Tools Platform (Bottom-Right)
    if (toolsRef.current) {
      if (elapsed < 3.3) {
        toolsRef.current.scale.setScalar(0)
        toolsRef.current.position.y = -3.5
      } else {
        const p = easeOutBack((elapsed - 3.3) / 0.7)
        toolsRef.current.scale.setScalar(p)
        toolsRef.current.position.y = -3.5 * (1 - p)
      }
    }
  })

  return (
    <>
      <ambientLight intensity={darkMode ? 0.8 : 1.2} />
      <directionalLight
        position={[6, 12, 8]}
        intensity={darkMode ? 1.6 : 1.9}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-6, 8, -6]} intensity={0.5} color="#93C5FD" />

      {/* Auto-Rotating Camera Tour with Dynamic Front Zoom-in */}
      <CameraTourController tourStationRef={tourStationRef} />

      {/* 3D Title at Top: Large Black Extruded "What am I know ?" (Static & Solid) */}
      <FloatingTitle3D darkMode={darkMode} />

      {/* Central 3D Developer Character (First seat appears, then man sits) */}
      <CentralDeveloper darkMode={darkMode} daisRef={daisRef} manRef={manRef} />

      {/* 4 Heavy Physical Colored Cables */}
      <group ref={cablesRef}>
        {curves.map((c) => (
          <PhysicalCable key={c.id} curve={c.curve} color={c.color} />
        ))}
      </group>

      {/* 1. Exact High-Detail Database Platform (Top-Left: Arrives 1st) */}
      <group ref={dbRef}>
        <DatabasePlatformDetailed darkMode={darkMode} />
      </group>

      {/* 2. Exact High-Detail Backend Platform (Top-Right: Arrives 2nd) */}
      <group ref={backendRef}>
        <BackendPlatformDetailed darkMode={darkMode} />
      </group>

      {/* 3. Exact High-Detail Frontend Platform (Bottom-Left: Arrives 3rd) */}
      <group ref={frontendRef}>
        <FrontendPlatformDetailed darkMode={darkMode} />
      </group>

      {/* 4. Exact High-Detail Tools Platform (Bottom-Right: Arrives 4th) */}
      <group ref={toolsRef}>
        <ToolsPlatformDetailed darkMode={darkMode} />
      </group>

      {/* Floor Grid Shadow Plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 22]} />
        <shadowMaterial opacity={darkMode ? 0.35 : 0.15} />
      </mesh>
    </>
  )
}
