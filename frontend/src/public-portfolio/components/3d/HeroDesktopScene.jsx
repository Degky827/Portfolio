import { Suspense, useMemo, useState, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import { useIsMobile, useDarkModeScene } from '../../../shared/hooks/useSceneHooks'
import * as THREE from 'three'
import Desk from './Desk'
import Monitor from './Monitor'
import Keyboard from './Keyboard'
import PC from './PC'
import Speaker from './Speaker'
import ProfessionalBackground from './ProfessionalBackground'

const CYAN = new THREE.Color('#22d3ee')

/* ────────────────────────────────────────────────────────────────
   Demand-based renderer — only re-renders when something changes
   ──────────────────────────────────────────────────────────────── */
function DemandRenderer() {
  const { invalidate, gl } = useThree()

  useEffect(() => {
    gl.setAnimationLoop(null)
  }, [gl])

  useFrame(() => {
    invalidate()
  })

  return null
}

/* ────────────────────────────────────────────────────────────────
   Scene Content
   ──────────────────────────────────────────────────────────────── */
function SceneContent({ darkMode, isMobile, profileData, canvasRef, showBackground = true }) {
  const desktopGroupRef = useRef()

  const bgColor = darkMode ? '#080B14' : '#ffffff'
  const fogColor = useMemo(() => new THREE.Color(bgColor), [bgColor])

  const floorColor = darkMode ? '#080B14' : '#ffffff'
  const wallColor = darkMode ? '#080B14' : '#ffffff'
  const accentColor = darkMode ? '#6366f1' : '#4f46e5'
  const ambientColor = darkMode ? '#080B14' : '#ffffff'
  const dirColor = darkMode ? '#818cf8' : '#6366f1'

  const ambientIntensity = darkMode ? 0.6 : 0.75
  const dirIntensity = darkMode ? 1.2 : 1.0

  const floorRoughness = darkMode ? 0.8 : 0.9
  const floorMetalness = darkMode ? 0.1 : 0.05

  return (
    <>
      {showBackground && <color attach="background" args={[bgColor]} />}
      <fog attach="fog" args={[fogColor, 10, 28]} />

      {/* Ambient fill */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />

      {/* Key light — main directional */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={dirIntensity}
        color={dirColor}
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 256 : 512}
        shadow-mapSize-height={isMobile ? 256 : 512}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0005}
      />

      {/* Fill light — softer, from opposite side */}
      <directionalLight
        position={[-3, 3, 2]}
        intensity={darkMode ? 0.25 : 0.15}
        color={darkMode ? '#4f46e5' : '#93c5fd'}
      />

      {/* Screen glow — point light in dark mode */}
      {darkMode && (
        <pointLight
          position={[0.5, 1.6, -0.1]}
          intensity={0.6}
          color="#818cf8"
          distance={5}
          decay={2}
        />
      )}

      <Suspense fallback={null}>
        <ProfessionalBackground darkMode={darkMode} isMobile={isMobile} />
      </Suspense>

      {/* Floor - matches exact page background */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={floorRoughness}
          metalness={floorMetalness}
          envMapIntensity={darkMode ? 0.3 : 0.1}
        />
      </mesh>

      {/* Subtle Accent strip under desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 1.2]}>
        <planeGeometry args={[3.2, 0.3]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={darkMode ? 0.2 : 0.08}
          transparent
          opacity={darkMode ? 0.12 : 0.05}
        />
      </mesh>

      {/* Back wall - matches exact page background */}
      <mesh position={[0, 2.5, -2]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.98} metalness={0.0} />
      </mesh>

      {/* Desktop assembly scaled & centered appropriately */}
      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.05}>
          <group ref={desktopGroupRef} position={[0.2, -0.05, 0]} scale={0.82}>
            <Desk position={[0, 0, 0]} />
            <Monitor position={[0, 0, -0.3]} screenMode="code" profileData={profileData} />
            <Keyboard position={[0, 0, 0.25]} />

            {!isMobile && (
              <group position={[0.9, 0.78, 0.3]}>
                <mesh castShadow>
                  <boxGeometry args={[0.12, 0.03, 0.18]} />
                  <meshStandardMaterial color="#0f0a2a" roughness={0.15} metalness={0.85} />
                </mesh>
                <mesh position={[0, 0.02, -0.03]}>
                  <cylinderGeometry args={[0.008, 0.008, 0.02, 8]} />
                  <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.5} />
                </mesh>
                <mesh position={[0, -0.01, 0]}>
                  <boxGeometry args={[0.1, 0.004, 0.16]} />
                  <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.2} transparent opacity={0.45} />
                </mesh>
              </group>
            )}

            {!isMobile && <PC position={[-2.2, 0, 0.3]} />}
            <Speaker position={[-1.8, 0.78, 0.1]} side="left" />
            {!isMobile && <Speaker position={[1.8, 0.78, 0.1]} side="right" />}
          </group>
        </Float>
      </Suspense>

      {/* Orbit Controls for interactive mouse drag & rotation */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minAzimuthAngle={-Math.PI / 2.5}
        maxAzimuthAngle={Math.PI / 2.5}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.7}
        autoRotate={!isMobile}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

/* ────────────────────────────────────────────────────────────────
   Expand / Collapse Button
   ──────────────────────────────────────────────────────────────── */
function ExpandButton({ onClick, icon: Icon, label, darkMode }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`absolute top-3 right-3 z-30 p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-lg cursor-pointer ${
        darkMode
          ? 'bg-black/60 border-white/10 text-white hover:bg-black/80'
          : 'bg-white/80 border-black/10 text-slate-900 hover:bg-white'
      }`}
      title={label}
      aria-label={label}
    >
      <Icon size={16} />
    </motion.button>
  )
}

/* ────────────────────────────────────────────────────────────────
   WebGL availability check
   ──────────────────────────────────────────────────────────────── */
function checkWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('webgl2') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/* ────────────────────────────────────────────────────────────────
   Fallback UI when WebGL is not available
   ──────────────────────────────────────────────────────────────── */
function FallbackScene({ darkMode }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: darkMode ? '#080B14' : '#ffffff' }}
    >
      <div className="text-center max-w-xs px-4">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: darkMode ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M6 10l4 4 4-4" />
          </svg>
        </div>
        <p className="text-xs font-medium" style={{ color: darkMode ? '#A8B0C0' : '#64748B' }}>
          3D workspace requires WebGL
        </p>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────────── */
export default function HeroDesktopScene({ className = '', profileData }) {
  const isMobile = useIsMobile()
  const darkMode = useDarkModeScene()
  const [expanded, setExpanded] = useState(false)
  const [cameraKey, setCameraKey] = useState(0)
  const canvasRef = useRef(null)
  const [webglSupported] = useState(() => checkWebGL())

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev)
    setCameraKey((k) => k + 1)
  }, [])

  const handleResetCamera = useCallback(() => {
    setCameraKey((k) => k + 1)
  }, [])

  const inlineCamera = useMemo(() => {
    if (isMobile) {
      return { position: [2.5, 1.5, 5.0], fov: 42, near: 0.1, far: 25 }
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return { position: [3.0, 2.4, 5.5], fov: 38, near: 0.1, far: 25 }
    }
    return { position: [3.5, 2.8, 5.5], fov: 35, near: 0.1, far: 25 }
  }, [isMobile])

  const inlineGl = useMemo(() => ({
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'default',
    stencil: false,
    depth: true,
    failIfMajorPerformanceCaveat: false,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: darkMode ? 1.1 : 1.0,
  }), [isMobile, darkMode])

  if (!webglSupported) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <FallbackScene darkMode={darkMode} />
      </div>
    )
  }

  return (
    <>
      <div className={`relative w-full h-full ${className}`}>
        <Canvas
          ref={canvasRef}
          key={`inline-${cameraKey}`}
          camera={inlineCamera}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={inlineGl}
          frameloop="demand"
          style={{ background: 'transparent' }}
        >
          <SceneContent
            darkMode={darkMode}
            isMobile={isMobile}
            profileData={profileData}
            canvasRef={canvasRef}
            showBackground={false}
          />
        </Canvas>

        {!isMobile && (
          <ExpandButton onClick={handleToggle} icon={Maximize2} label="Expand 3D workspace" darkMode={darkMode} />
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex flex-col"
            style={{ background: darkMode ? '#080B14' : '#ffffff' }}
          >
            <div className="absolute top-0 left-0 right-0 z-[100000] flex items-center justify-between px-6 py-4 bg-slate-900/60 dark:bg-black/60 backdrop-blur-md border-b border-white/10 text-white">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                3D Workspace (Interactive View)
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleResetCamera}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Reset camera"
                  aria-label="Reset camera"
                >
                  <RotateCcw size={16} />
                </motion.button>
                <motion.button
                  onClick={handleToggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Collapse"
                  aria-label="Collapse 3D workspace"
                >
                  <Minimize2 size={16} />
                </motion.button>
              </div>
            </div>

            <Canvas
              key={`expanded-${cameraKey}`}
              camera={{ position: [0, 2.2, 8], fov: 40, near: 0.1, far: 100 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: darkMode ? 1.1 : 1.0,
              }}
              shadows
              frameloop="demand"
              style={{ background: darkMode ? '#080B14' : '#ffffff', width: '100%', height: '100%' }}
            >
              <SceneContent darkMode={darkMode} isMobile={false} profileData={profileData} canvasRef={canvasRef} />
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
