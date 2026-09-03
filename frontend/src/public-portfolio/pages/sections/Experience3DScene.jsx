import { Suspense, useState, useEffect, useRef, useMemo, useCallback, Component } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useIsMobile, useDarkModeScene } from '../../../shared/hooks/useSceneHooks'

const MODEL_URL = import.meta.env.VITE_EXPERIENCE_3D_MODEL_URL || ''

/* ─── Reactive Scene Background (Three.js doesn't re-render <color> args) ── */
function SceneBackground({ color }) {
  const { scene } = useThree()
  useEffect(() => {
    scene.background = new THREE.Color(color)
  }, [scene, color])
  return null
}

/* ─── Error Boundary for 3D scenes ────────────────────────────── */
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error) {
    console.warn('[Experience3DScene] 3D scene error:', error.message)
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}

/* ─── Mouse-following subtle rotation ────────────────────────── */
function MouseRotation({ groupRef }) {
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      const cx = (e.clientX / window.innerWidth) * 2 - 1
      const cy = (e.clientY / window.innerHeight) * 2 - 1
      mouse.current = { x: cx, y: cy }
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    target.current.x = THREE.MathUtils.lerp(target.current.x, mouse.current.y * 0.04, 0.05)
    target.current.y = THREE.MathUtils.lerp(target.current.y, mouse.current.x * 0.06, 0.05)
    groupRef.current.rotation.x = target.current.x
    groupRef.current.rotation.y = target.current.y
  })

  return null
}

/* ─── Procedural Humanoid Figure ──────────────────────────────── */
function HumanFigure({ darkMode }) {
  const skinColor = darkMode ? '#c4a882' : '#d4a574'
  const shirtColor = darkMode ? '#2a3454' : '#4f46e5'
  const pantsColor = darkMode ? '#1a1f33' : '#374151'
  const hairColor = darkMode ? '#1a1020' : '#2d1b0e'
  const shoeColor = darkMode ? '#0f0a1a' : '#1f2937'

  return (
    <group position={[0, 0.78, 0.65]}>
      {/* Head */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.12, -0.02]} castShadow>
        <sphereGeometry args={[0.145, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={hairColor} roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.18]} />
        <meshStandardMaterial color={shirtColor} roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Left arm - reaching toward keyboard */}
      <group position={[-0.2, 0.7, 0.08]} rotation={[0.6, 0, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} metalness={0.15} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.18, 0.02]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      {/* Right arm - reaching toward keyboard */}
      <group position={[0.2, 0.7, 0.08]} rotation={[0.6, 0, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} metalness={0.15} />
        </mesh>
        <mesh position={[0, -0.18, 0.02]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      {/* Hips */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.28, 0.1, 0.18]} />
        <meshStandardMaterial color={pantsColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left leg - bent at knee (sitting) */}
      <group position={[-0.09, 0.25, 0.1]} rotation={[0.8, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.28, 0.1]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Lower leg */}
        <group position={[0, -0.18, 0.12]} rotation={[-0.8, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.09, 0.25, 0.09]} />
            <meshStandardMaterial color={pantsColor} roughness={0.6} metalness={0.1} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.14, 0.04]}>
            <boxGeometry args={[0.1, 0.06, 0.16]} />
            <meshStandardMaterial color={shoeColor} roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Right leg - bent at knee (sitting) */}
      <group position={[0.09, 0.25, 0.1]} rotation={[0.8, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.28, 0.1]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} metalness={0.1} />
        </mesh>
        <group position={[0, -0.18, 0.12]} rotation={[-0.8, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.09, 0.25, 0.09]} />
            <meshStandardMaterial color={pantsColor} roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.14, 0.04]}>
            <boxGeometry args={[0.1, 0.06, 0.16]} />
            <meshStandardMaterial color={shoeColor} roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* ─── Procedural Desk ──────────────────────────────────────────── */
function ProceduralDesk({ darkMode }) {
  const surfaceColor = darkMode ? '#0f0a2a' : '#e5e7eb'
  const legColor = darkMode ? '#1a1035' : '#d1d5db'
  const accentColor = darkMode ? '#6366f1' : '#4f46e5'

  return (
    <group position={[0, 0, 0]}>
      {/* Desktop surface */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.05, 1.1]} />
        <meshStandardMaterial color={surfaceColor} roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Front edge accent */}
      <mesh position={[0, 0.75, 0.56]}>
        <boxGeometry args={[2.42, 0.015, 0.015]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.5} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-1.05, 0.375, 0]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.9]} />
        <meshStandardMaterial color={legColor} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Right leg */}
      <mesh position={[1.05, 0.375, 0]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.9]} />
        <meshStandardMaterial color={legColor} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Under-desk support */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.0, 0.03, 0.03]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

/* ─── Procedural Monitor ────────────────────────────────────────── */
function ProceduralMonitor({ darkMode }) {
  const frameColor = darkMode ? '#111827' : '#374151'
  const screenBg = darkMode ? '#0a0e1a' : '#1e293b'
  const accentColor = darkMode ? '#6366f1' : '#4f46e5'
  const codeColor1 = darkMode ? '#818cf8' : '#818cf8'
  const codeColor2 = darkMode ? '#60a5fa' : '#60a5fa'

  return (
    <group position={[0, 0.78, -0.25]}>
      {/* Stand base */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.03, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.06, 0.44, 0.06]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Monitor frame */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.4, 0.85, 0.04]} />
        <meshStandardMaterial color={frameColor} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.72, 0.025]}>
        <planeGeometry args={[1.28, 0.73]} />
        <meshStandardMaterial color={screenBg} roughness={0.1} metalness={0.05} />
      </mesh>

      {/* Code lines on screen */}
      <mesh position={[-0.3, 0.9, 0.03]}>
        <planeGeometry args={[0.45, 0.025]} />
        <meshStandardMaterial color={codeColor1} emissive={codeColor1} emissiveIntensity={0.8} transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.2, 0.84, 0.03]}>
        <planeGeometry args={[0.6, 0.025]} />
        <meshStandardMaterial color={codeColor2} emissive={codeColor2} emissiveIntensity={0.6} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.25, 0.78, 0.03]}>
        <planeGeometry args={[0.35, 0.025]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.15, 0.72, 0.03]}>
        <planeGeometry args={[0.5, 0.025]} />
        <meshStandardMaterial color={codeColor1} emissive={codeColor1} emissiveIntensity={0.5} transparent opacity={0.4} />
      </mesh>
      <mesh position={[-0.2, 0.66, 0.03]}>
        <planeGeometry args={[0.4, 0.025]} />
        <meshStandardMaterial color={codeColor2} emissive={codeColor2} emissiveIntensity={0.6} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.28, 0.6, 0.03]}>
        <planeGeometry args={[0.3, 0.025]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} transparent opacity={0.35} />
      </mesh>

      {/* Screen glow */}
      <pointLight position={[0, 0.72, 0.3]} intensity={darkMode ? 0.4 : 0.15} color={accentColor} distance={3} decay={2} />
    </group>
  )
}

/* ─── Procedural Keyboard ──────────────────────────────────────── */
function ProceduralKeyboard({ darkMode }) {
  const bodyColor = darkMode ? '#0f0a2a' : '#e5e7eb'
  const keyColor = darkMode ? '#1a1035' : '#d1d5db'
  const accentColor = darkMode ? '#6366f1' : '#4f46e5'

  return (
    <group position={[0, 0.78, 0.2]}>
      {/* Body */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[1.0, 0.03, 0.35]} />
        <meshStandardMaterial color={bodyColor} roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Key rows */}
      {[[-0.08, 10], [0, 10], [0.08, 9]].map(([z, count], rowIdx) => (
        <group key={rowIdx} position={[0, 0.04, z]}>
          {Array.from({ length: count }).map((_, i) => {
            const totalW = count * 0.08 + (count - 1) * 0.008
            const x = -totalW / 2 + 0.04 + i * (0.08 + 0.008)
            return (
              <mesh key={i} position={[x, 0, 0]}>
                <boxGeometry args={[0.07, 0.018, 0.06]} />
                <meshStandardMaterial
                  color={keyColor}
                  roughness={0.4}
                  metalness={0.3}
                />
              </mesh>
            )
          })}
        </group>
      ))}

      {/* Spacebar glow */}
      <mesh position={[0, 0.02, 0.12]}>
        <boxGeometry args={[0.35, 0.004, 0.05]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}

/* ─── Procedural Chair ─────────────────────────────────────────── */
function ProceduralChair({ darkMode }) {
  const frameColor = darkMode ? '#1a1f33' : '#6b7280'
  const seatColor = darkMode ? '#1e2640' : '#9ca3af'

  return (
    <group position={[0, 0, 0.65]}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.4, 0.04, 0.4]} />
        <meshStandardMaterial color={seatColor} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.7, -0.18]} castShadow>
        <boxGeometry args={[0.38, 0.5, 0.04]} />
        <meshStandardMaterial color={seatColor} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Center pole */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.44, 8]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Base star (5 legs) */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        const x = Math.cos(angle) * 0.2
        const z = Math.sin(angle) * 0.2
        return (
          <group key={i}>
            <mesh position={[x * 0.5, 0.03, z * 0.5]}>
              <boxGeometry args={[0.03, 0.025, 0.22]} />
              <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Caster wheel */}
            <mesh position={[x, 0.02, z]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/* ─── Procedural Fallback Scene ──────────────────────────────────── */
function ProceduralScene({ darkMode, isMobile }) {
  const groupRef = useRef()

  const bgColor = darkMode ? '#1a1a2e' : '#ffffff'
  const fogColor = useMemo(() => new THREE.Color(bgColor), [bgColor])
  const floorColor = darkMode ? '#0b0e17' : '#f8f9fa'
  const wallColor = darkMode ? '#101522' : '#f3f4f6'
  const accentColor = darkMode ? '#6366f1' : '#4f46e5'

  return (
    <>
      <SceneBackground color={bgColor} />
      <fog attach="fog" args={[fogColor, 8, 20]} />

      <ambientLight intensity={darkMode ? 0.5 : 0.65} color={darkMode ? '#101522' : '#f5f5f5'} />

      <directionalLight
        position={[3, 5, 3]}
        intensity={darkMode ? 1.0 : 0.9}
        color={darkMode ? '#818cf8' : '#6366f1'}
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 256 : 512}
        shadow-mapSize-height={isMobile ? 256 : 512}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />

      <directionalLight position={[-2, 3, 1]} intensity={darkMode ? 0.2 : 0.1} color={darkMode ? '#4f46e5' : '#93c5fd'} />

      {darkMode && <pointLight position={[0.3, 1.5, -0.1]} intensity={0.4} color="#818cf8" distance={4} decay={2} />}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} metalness={0.15} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2, -1.5]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={wallColor} roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Accent strip on wall */}
      <mesh position={[0, 3, -1.49]}>
        <boxGeometry args={[5, 0.012, 0.01]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.5} />
      </mesh>

      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.04}>
        <group ref={groupRef} position={[0.1, -0.05, 0]} scale={isMobile ? 0.7 : 0.85}>
          <MouseRotation groupRef={groupRef} />
          <ProceduralDesk darkMode={darkMode} />
          <ProceduralMonitor darkMode={darkMode} />
          <ProceduralKeyboard darkMode={darkMode} />
          <ProceduralChair darkMode={darkMode} />
          <HumanFigure darkMode={darkMode} />
        </group>
      </Float>
    </>
  )
}

/* ─── GLB Model Loader ────────────────────────────────────────── */
function GLBModel({ url, darkMode, isMobile }) {
  const groupRef = useRef()
  const { scene } = useGLTF(url, true)

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  return (
    <Float speed={1} rotationIntensity={0} floatIntensity={0.03}>
      <group ref={groupRef} scale={isMobile ? 0.6 : 0.8}>
        <MouseRotation groupRef={groupRef} />
        <primitive object={clonedScene} />
      </group>
    </Float>
  )
}

/* ─── Loading Indicator ────────────────────────────────────────── */
function LoadingIndicator({ darkMode }) {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: darkMode ? '#1a1a2e' : '#ffffff' }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{
            borderColor: darkMode ? 'rgba(99,102,241,0.2)' : 'rgba(79,70,229,0.2)',
            borderTopColor: darkMode ? '#6366f1' : '#4f46e5',
          }}
        />
        <span className="text-xs" style={{ color: darkMode ? '#64748B' : '#9ca3af' }}>
          Loading 3D scene...
        </span>
      </div>
    </div>
  )
}

/* ─── Error Fallback ───────────────────────────────────────────── */
function ErrorFallback({ darkMode }) {
  const accentColor = darkMode ? '#6366f1' : '#4f46e5'
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: darkMode ? '#1a1a2e' : '#ffffff' }}>
      <div className="text-center max-w-[200px] px-4">
        <div
          className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: darkMode ? 'rgba(99,102,241,0.1)' : 'rgba(79,70,229,0.08)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </svg>
        </div>
        <p className="text-xs font-medium" style={{ color: darkMode ? '#64748B' : '#9ca3af' }}>
          3D workspace
        </p>
      </div>
    </div>
  )
}

/* ─── WebGL Check ──────────────────────────────────────────────── */
function checkWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('webgl2'))
  } catch {
    return false
  }
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function Experience3DScene({ className = '' }) {
  const isMobile = useIsMobile()
  const darkMode = useDarkModeScene()
  const [webglOk] = useState(() => checkWebGL())
  const [loadError, setLoadError] = useState(false)
  const [modelReady, setModelReady] = useState(false)

  const hasModelUrl = Boolean(MODEL_URL)

  useEffect(() => {
    if (!hasModelUrl) return
    const timer = setTimeout(() => {
      if (!modelReady) {
        console.warn('[Experience3DScene] GLB model load timeout, falling back to procedural scene')
        setLoadError(true)
      }
    }, 15000)
    return () => clearTimeout(timer)
  }, [hasModelUrl, modelReady])

  const handleCreated = useCallback(() => {
    setModelReady(true)
  }, [])

  if (!webglOk) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <ErrorFallback darkMode={darkMode} />
      </div>
    )
  }

  const cameraConfig = isMobile
    ? { position: [2.2, 1.4, 4.2], fov: 38, near: 0.1, far: 20 }
    : { position: [2.8, 2.0, 4.5], fov: 32, near: 0.1, far: 25 }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <SceneErrorBoundary fallback={<ErrorFallback darkMode={darkMode} />}>
        <Suspense fallback={<LoadingIndicator darkMode={darkMode} />}>
          <Canvas
            camera={cameraConfig}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            gl={{
              antialias: !isMobile,
              alpha: true,
              powerPreference: 'default',
              stencil: false,
              depth: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: darkMode ? 1.1 : 1.0,
            }}
            onCreated={handleCreated}
            style={{ background: 'transparent' }}
          >
            {hasModelUrl && !loadError ? (
              <Suspense fallback={null}>
                <SceneErrorBoundary fallback={null}>
                  <GLBModel url={MODEL_URL} darkMode={darkMode} isMobile={isMobile} />
                </SceneErrorBoundary>
              </Suspense>
            ) : (
              <ProceduralScene darkMode={darkMode} isMobile={isMobile} />
            )}
          </Canvas>
        </Suspense>
      </SceneErrorBoundary>
    </div>
  )
}
