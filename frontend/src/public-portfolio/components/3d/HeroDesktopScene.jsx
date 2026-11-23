import { Suspense, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2, ZoomIn, ZoomOut } from 'lucide-react'
import { useDarkModeScene } from '../../../shared/hooks/useSceneHooks'
import * as THREE from 'three'
import Desk from './Desk'
import Monitor from './Monitor'
import Keyboard from './Keyboard'
import PC from './PC'
import Speaker from './Speaker'
import Plant from './Plant'
import CoffeeMug from './CoffeeMug'

const BLUE_PRIMARY = new THREE.Color('#0088FF')
const BLUE_CYAN = new THREE.Color('#00C8FF')

/* Safe defaults — used when API data is missing or invalid */
const SAFE_DEFAULTS = {
  enabled: true,
  interaction: true,
  autoRotate: false,
  shadows: true,
  particles: false,
  postProcessing: false,
  cursorInteraction: true,
  performance: {
    desktop: true,
    tablet: true,
    mobile: true,
    lightweightMobile: false,
    maxDpr: 2,
    shadowQuality: 'medium',
    particleCount: 50,
  },
  camera: {
    positionX: 0.0, positionY: 0.90, positionZ: 2.05,
    rotationX: 0, rotationY: 0, rotationZ: 0,
    fov: 42, zoom: 1,
  },
  objects: [],
}

function getS3(scene3D) {
  if (!scene3D || typeof scene3D !== 'object') return SAFE_DEFAULTS
  const s = { ...SAFE_DEFAULTS, ...scene3D }
  s.performance = { ...SAFE_DEFAULTS.performance, ...(scene3D.performance || {}) }
  s.camera = { ...SAFE_DEFAULTS.camera, ...(scene3D.camera || {}) }
  if (Array.isArray(scene3D.objects)) s.objects = scene3D.objects
  return s
}

/* ─── Scene Content ─── */
function SceneContent({ darkMode, profileData, s3, controlsRef }) {
  const desktopGroupRef = useRef()

  const castShadows = s3.shadows !== false
  const shadowSize = s3.performance.shadowQuality === 'high' ? 2048 : s3.performance.shadowQuality === 'low' ? 512 : 1024

  /* Object lookup from admin */
  const objMap = useMemo(() => {
    const m = {}
    if (Array.isArray(s3.objects)) {
      s3.objects.forEach((o) => { if (o.name) m[o.name.toLowerCase()] = o })
    }
    return m
  }, [s3.objects])

  function vis(name, fallback = true) {
    const o = objMap[name.toLowerCase()]
    return o ? o.visible !== false : fallback
  }

  // Baseline zoom-out scale: 0.88 (the existing baseline view)
  const baseScale = 0.88
  // Maximum zoom-in scale: 1.05 (magnifies all parts together by ~20% from floor base)
  const maxScale = 1.05

  useFrame(({ clock }) => {
    // Smooth ~12-second sinusoidal breathing cycle: 0 -> 1 -> 0
    const t = clock.getElapsedTime()
    const cycleSpeed = 0.52
    const progress = (1 - Math.cos(t * cycleSpeed)) / 2

    // Scale all workstation parts proportionally from the floor anchor:
    // - Group origin is at floorY so the table legs stay firmly planted and visible
    // - Tabletop, monitor, plant, mug, speakers, PC, and legs all increase in size together
    const currentScale = baseScale + progress * (maxScale - baseScale)
    if (desktopGroupRef.current) {
      desktopGroupRef.current.scale.setScalar(currentScale)
    }
  })

  // Group position: grounded at floorY = -0.46 so the desktop and table workstation are shifted down cleanly
  const floorY = -0.46
  const groupPos = [0, floorY, 0]

  // Tabletop surface at y = 0.72 inside the group
  const deskPos = [0, 0, 0]
  const monitorPos = [0.0, 0.72, -0.06]
  const keyboardPos = [-0.14, 0.722, 0.30]
  const mousepadPos = [0.0, 0.72, 0.30]
  const plantPos = [-1.52, 0.72, 0.06]
  const coffeeMugPos = [-1.28, 0.72, 0.28]
  const speakerLeftPos = [-1.06, 0.72, 0.04]
  const speakerRightPos = [1.06, 0.72, 0.04]
  const pcPos = [1.52, 0.72, 0.04]

  return (
    <>
      <ambientLight intensity={darkMode ? 0.78 : 0.92} color="#ffffff" />

      {/* Primary Key Light - Crisp high-key studio light */}
      <directionalLight
        position={[2.5, 5.25, 3.0]}
        intensity={darkMode ? 1.20 : 1.30}
        color="#ffffff"
        castShadow={castShadows}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-near={0.5}
        shadow-camera-far={14}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
        shadow-bias={-0.0004}
      />

      {/* Secondary Soft Fill Light */}
      <directionalLight
        position={[-3.0, 3.75, 2.0]}
        intensity={darkMode ? 0.35 : 0.40}
        color="#f0f6ff"
      />

      {/* ── Floor Shadow Catcher (Positioned dynamically at floorY) ── */}
      <mesh position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <shadowMaterial transparent opacity={darkMode ? 0.55 : 0.25} />
      </mesh>

      {/* ── Soft Ambient Contact Shadow on Floor (Grounds the table legs at floorY) ── */}
      <ContactShadows
        position={[0, floorY + 0.001, 0]}
        opacity={darkMode ? 0.75 : 0.48}
        scale={9.6}
        blur={1.8}
        far={2.5}
        color={darkMode ? '#080810' : '#141824'}
      />

      {/* ── Workstation (Warm Oak Wood Table + Components + Blue Accents matching Image 1) ── */}
      <group ref={desktopGroupRef} position={groupPos} scale={baseScale}>
        {vis('desk') && <Desk position={deskPos} />}
        {vis('monitor') && <Monitor position={monitorPos} screenMode="code" profileData={profileData} />}
        {/* Potted Plant and Flutter Coffee Mug on left of desk */}
        <Plant position={plantPos} />
        <CoffeeMug position={coffeeMugPos} />

        {/* ── Wide Unified Black Desk Mat (XL Mat under Keyboard & Mouse matching Target Reference) ── */}
        <group position={[0.0, 0.72, 0.30]}>
          {/* Main woven charcoal black mat surface */}
          <mesh receiveShadow position={[0, 0.002, 0]}>
            <boxGeometry args={[1.38, 0.004, 0.36]} />
            <meshStandardMaterial color="#0b0c10" roughness={0.88} />
          </mesh>
          {/* Subtle anti-fray stitched perimeter border */}
          <mesh position={[0, 0.001, 0]}>
            <boxGeometry args={[1.386, 0.003, 0.366]} />
            <meshStandardMaterial color="#161922" roughness={0.9} />
          </mesh>
        </group>

        {vis('keyboard') && <Keyboard position={[-0.14, 0.722, 0.30]} />}

        {vis('mouse') && (
          <group position={[0.42, 0.722, 0.30]}>
            {/* Ergonomic Gaming Mouse in Matte Black */}
            <group position={[0, 0.014, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.078, 0.026, 0.124]} />
                <meshStandardMaterial color="#0d0e13" roughness={0.35} metalness={0.65} />
              </mesh>
              {/* Illuminated electric cyan scroll wheel */}
              <mesh position={[0, 0.013, -0.026]}>
                <cylinderGeometry args={[0.006, 0.006, 0.014, 16]} />
                <meshBasicMaterial color="#00A3FF" />
              </mesh>
              {/* Illuminated rear logo */}
              <mesh position={[0, 0.014, 0.032]}>
                <boxGeometry args={[0.018, 0.002, 0.018]} />
                <meshBasicMaterial color="#00A3FF" />
              </mesh>
            </group>
          </group>
        )}

        {vis('pc') && <PC position={pcPos} />}
        {vis('speaker-left') && <Speaker position={speakerLeftPos} side="left" />}
        {vis('speaker-right') && <Speaker position={speakerRightPos} side="right" />}

        {/* Accent Point Light at PC Fans (Electric Blue) */}
        <pointLight
          position={[1.52, 1.05, 0.34]}
          intensity={0.65}
          color={BLUE_PRIMARY}
          distance={2.2}
          decay={2}
        />

        {/* Soft ambient blue reflection pool under PC fans onto warm oak tabletop */}
        <pointLight
          position={[1.50, 0.76, 0.22]}
          intensity={0.55}
          color={BLUE_PRIMARY}
          distance={1.0}
          decay={2}
        />

        {/* Soft ambient blue reflection pool on tabletop under monitor & keyboard */}
        <pointLight
          position={[0.0, 0.76, 0.08]}
          intensity={0.45}
          color={BLUE_PRIMARY}
          distance={1.1}
          decay={2}
        />

        {/* Accent Point Light at Left Speaker (Electric Blue) */}
        <pointLight
          position={[-1.06, 0.82, 0.18]}
          intensity={0.25}
          color={BLUE_PRIMARY}
          distance={1.0}
          decay={2}
        />
      </group>

      {/* OrbitControls: Zoom disabled, aimed so workstation sits cleanly lower in frame */}
      <OrbitControls
        ref={controlsRef}
        target={[0.0, 0.58, 0.0]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.05}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.45}
        autoRotate={false}
      />
    </>
  )
}

/* ─── WebGL check ─── */
function checkWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('webgl2') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/* ─── Fallback UI ─── */
function FallbackScene({ darkMode }) {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: darkMode ? '#1a1a2e' : '#ffffff' }}>
      <div className="text-center max-w-xs px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: darkMode ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)' }}>
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

// Ensures camera position and orientation are firmly locked across HMR and viewport resizes
function CameraSync() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0.0, 1.28, 2.70)
    camera.fov = 43
    camera.lookAt(0.0, 0.58, 0.0)
    camera.updateProjectionMatrix()
  }, [camera])
  return null
}

/* ─── Main Component ─── */
export default function HeroDesktopScene({ className = '', profileData, scene3D }) {
  const darkMode = useDarkModeScene()
  const [expanded, setExpanded] = useState(false)
  const [cameraKey, setCameraKey] = useState(0)
  const canvasRef = useRef(null)
  const controlsRef = useRef(null)
  const [webglSupported] = useState(() => checkWebGL())

  const s3 = useMemo(() => getS3(scene3D), [scene3D])

  /* Respect enabled flag — if 3D is disabled, show fallback */
  if (!webglSupported || s3.enabled === false) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <FallbackScene darkMode={darkMode} />
      </div>
    )
  }

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.object.position.multiplyScalar(0.85)
      controlsRef.current.update()
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.object.position.multiplyScalar(1.18)
      controlsRef.current.update()
    }
  }, [])

  useEffect(() => {
    if (!expanded) return
    const handleKeyDown = (e) => { if (e.key === 'Escape') { setExpanded(false); setCameraKey((k) => k + 1) } }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [expanded])

  // Prominent close-up framing (~14.5° downward angle, workstation lowered significantly) matching Image 2
  const inlineCamera = useMemo(() => ({
    position: [0.0, 1.28, 2.70],
    fov: 43,
    near: 0.1,
    far: 25,
  }), [])

  const maxDpr = s3.performance.maxDpr || 2
  const inlineGl = useMemo(() => ({
    antialias: true,
    alpha: true,
    powerPreference: 'default',
    stencil: false,
    depth: true,
    failIfMajorPerformanceCaveat: false,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: darkMode ? 1.05 : 1.00,
  }), [darkMode])

  return (
    <>
      <div className={`relative w-full h-full ${className}`}>
        <Canvas
          shadows
          ref={canvasRef}
          key={`inline-${cameraKey}`}
          camera={inlineCamera}
          dpr={[1, maxDpr]}
          gl={inlineGl}
          frameloop="always"
          style={{ background: 'transparent' }}
        >
          <CameraSync />
          <SceneContent
            darkMode={darkMode}
            profileData={profileData}
            s3={s3}
            controlsRef={controlsRef}
          />
        </Canvas>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex flex-col"
            style={{ background: darkMode ? '#1a1a2e' : '#ffffff' }}
            onClick={(e) => { if (e.target === e.currentTarget) { setExpanded(false); setCameraKey((k) => k + 1) } }}
          >
            <div className="absolute top-0 left-0 right-0 z-[100000] flex items-center justify-between px-6 py-4 bg-slate-900/60 dark:bg-black/60 backdrop-blur-md border-b border-white/10 text-white">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">3D Workspace (Interactive View)</span>
              <div className="flex items-center gap-2">
                <motion.button onClick={handleZoomIn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all cursor-pointer" title="Zoom in" aria-label="Zoom in">
                  <ZoomIn size={16} />
                </motion.button>
                <motion.button onClick={handleZoomOut} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all cursor-pointer" title="Zoom out" aria-label="Zoom out">
                  <ZoomOut size={16} />
                </motion.button>
                <motion.button onClick={() => setExpanded(false)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all cursor-pointer" title="Close" aria-label="Close">
                  <Minimize2 size={16} />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 w-full h-full">
              <Canvas
                shadows
                key={`modal-${cameraKey}`}
                camera={{ position: [0.0, 1.36, 2.65], fov: 42, near: 0.1, far: 25 }}
                dpr={[1, maxDpr]}
                gl={inlineGl}
                style={{ background: 'transparent' }}
              >
                <SceneContent
                  darkMode={darkMode}
                  profileData={profileData}
                  s3={s3}
                  controlsRef={controlsRef}
                />
              </Canvas>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
