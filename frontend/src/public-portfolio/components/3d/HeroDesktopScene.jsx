import { Suspense, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
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
    positionX: 0.35, positionY: 1.6, positionZ: 5.1,
    rotationX: 0, rotationY: 0, rotationZ: 0,
    fov: 36, zoom: 1,
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

/* ─── Demand-based renderer ─── */
function DemandRenderer() {
  const { invalidate, gl } = useThree()
  useEffect(() => { gl.setAnimationLoop(null) }, [gl])
  useFrame(() => { invalidate() })
  return null
}

/* ─── Scene Content ─── */
function SceneContent({ darkMode, isMobile, profileData, canvasRef, showBackground = true, s3 }) {
  const desktopGroupRef = useRef()

  const bgColor = darkMode ? '#1a1a2e' : '#ffffff'
  const fogColor = useMemo(() => new THREE.Color(bgColor), [bgColor])
  const floorColor = darkMode ? '#1a1a2e' : '#ffffff'
  const wallColor = darkMode ? '#1a1a2e' : '#ffffff'
  const accentColor = darkMode ? '#6366f1' : '#4f46e5'
  const ambientColor = darkMode ? '#1a1a2e' : '#ffffff'
  const dirColor = darkMode ? '#818cf8' : '#6366f1'
  const ambientIntensity = darkMode ? 0.6 : 0.75
  const dirIntensity = darkMode ? 1.2 : 1.0
  const floorRoughness = darkMode ? 0.8 : 0.9
  const floorMetalness = darkMode ? 0.1 : 0.05

  const castShadows = s3.shadows && !isMobile
  const shadowSize = s3.performance.shadowQuality === 'high' ? 1024 : s3.performance.shadowQuality === 'low' ? 256 : 512

  /* Object lookup from admin */
  const objMap = useMemo(() => {
    const m = {}
    if (Array.isArray(s3.objects)) {
      s3.objects.forEach((o) => { if (o.name) m[o.name.toLowerCase()] = o })
    }
    return m
  }, [s3.objects])

  function getObj(name) {
    return objMap[name.toLowerCase()] || null
  }
  function pos(defaults, name) {
    const o = getObj(name)
    if (!o || !o.position) return defaults
    return [o.position.x ?? defaults[0], o.position.y ?? defaults[1], o.position.z ?? defaults[2]]
  }
  function vis(name, fallback = true) {
    const o = getObj(name)
    return o ? o.visible !== false : fallback
  }
  function scl(name, fallback = 0.82) {
    const o = getObj(name)
    return o ? (typeof o.scale === 'number' ? o.scale : fallback) : fallback
  }

  const groupPos = pos([0.2, -0.05, 0], 'group')
  const groupScale = scl('group', 0.82)
  const deskPos = pos([0, 0, 0], 'desk')
  const monitorPos = pos([0, 0, -0.3], 'monitor')
  const keyboardPos = pos([0, 0, 0.25], 'keyboard')
  const mousePos = pos([0.9, 0.78, 0.3], 'mouse')
  const pcPos = pos([-2.2, 0, 0.3], 'pc')
  const speakerLeftPos = pos([-1.8, 0.78, 0.1], 'speaker-left')
  const speakerRightPos = pos([1.8, 0.78, 0.1], 'speaker-right')

  return (
    <>
      {showBackground && <color attach="background" args={[bgColor]} />}
      <fog attach="fog" args={[fogColor, 10, 28]} />

      <ambientLight intensity={ambientIntensity} color={ambientColor} />

      <directionalLight
        position={[4, 6, 4]}
        intensity={dirIntensity}
        color={dirColor}
        castShadow={castShadows}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0005}
      />

      <directionalLight
        position={[-3, 3, 2]}
        intensity={darkMode ? 0.25 : 0.15}
        color={darkMode ? '#4f46e5' : '#93c5fd'}
      />

      {darkMode && (
        <pointLight position={[0.5, 1.6, -0.1]} intensity={0.6} color="#818cf8" distance={5} decay={2} />
      )}

      <Suspense fallback={null}>
        <ProfessionalBackground key={isMobile ? 'mobile' : 'desktop'} darkMode={darkMode} isMobile={isMobile} />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={floorColor} roughness={floorRoughness} metalness={floorMetalness} envMapIntensity={darkMode ? 0.3 : 0.1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 1.2]}>
        <planeGeometry args={[3.2, 0.3]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={darkMode ? 0.2 : 0.08} transparent opacity={darkMode ? 0.12 : 0.05} />
      </mesh>

      <mesh position={[0, 2.5, -2]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.98} metalness={0.0} />
      </mesh>

      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={s3.autoRotate ? 0.3 : 0} floatIntensity={0.05}>
          <group ref={desktopGroupRef} position={groupPos} scale={groupScale}>
            {vis('desk') && <Desk position={deskPos} />}
            {vis('monitor') && <Monitor position={monitorPos} screenMode="preview" profileData={profileData} />}
            {vis('keyboard') && <Keyboard position={keyboardPos} />}

            {!isMobile && vis('mouse') && (
              <group position={mousePos}>
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

            {!isMobile && vis('pc') && <PC position={pcPos} />}
            {vis('speaker-left') && <Speaker position={speakerLeftPos} side="left" />}
            {!isMobile && vis('speaker-right') && <Speaker position={speakerRightPos} side="right" />}
          </group>
        </Float>
      </Suspense>

      <OrbitControls
        target={[0.2, 1.0, -0.2]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minAzimuthAngle={-Math.PI / 2.5}
        maxAzimuthAngle={Math.PI / 2.5}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.7}
        autoRotate={s3.autoRotate}
      />
    </>
  )
}

/* ─── Expand Button ─── */
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

/* ─── Main Component ─── */
export default function HeroDesktopScene({ className = '', profileData, scene3D }) {
  const isMobile = useIsMobile()
  const darkMode = useDarkModeScene()
  const [expanded, setExpanded] = useState(false)
  const [cameraKey, setCameraKey] = useState(0)
  const canvasRef = useRef(null)
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

  /* Device-level toggle */
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024
  if (isMobile && !s3.performance.mobile) {
    return <div className={`relative w-full h-full ${className}`}><FallbackScene darkMode={darkMode} /></div>
  }
  if (isTablet && !s3.performance.tablet) {
    return <div className={`relative w-full h-full ${className}`}><FallbackScene darkMode={darkMode} /></div>
  }

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev)
    setCameraKey((k) => k + 1)
  }, [])

  const handleResetCamera = useCallback(() => {
    setCameraKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (!expanded) return
    const handleKeyDown = (e) => { if (e.key === 'Escape') { setExpanded(false); setCameraKey((k) => k + 1) } }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [expanded])

  const cam = s3.camera
  const inlineCamera = useMemo(() => {
    if (isMobile) {
      return { position: [cam.positionX || 0.2, cam.positionY || 1.5, cam.positionZ || 5.6], fov: cam.fov || 42, near: 0.1, far: 25 }
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return { position: [cam.positionX || 0.3, cam.positionY || 1.7, cam.positionZ || 6.2], fov: cam.fov || 38, near: 0.1, far: 25 }
    }
    return { position: [cam.positionX || 0.35, cam.positionY || 1.6, cam.positionZ || 5.1], fov: cam.fov || 36, near: 0.1, far: 25 }
  }, [isMobile, cam.positionX, cam.positionY, cam.positionZ, cam.fov])

  const maxDpr = s3.performance.maxDpr || 2
  const inlineGl = useMemo(() => ({
    antialias: !isMobile,
    alpha: true,
    powerPreference: s3.performance.lightweightMobile && isMobile ? 'low-power' : 'default',
    stencil: false,
    depth: true,
    failIfMajorPerformanceCaveat: false,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: darkMode ? 1.1 : 1.0,
  }), [isMobile, darkMode, s3.performance.lightweightMobile])

  return (
    <>
      <div className={`relative w-full h-full ${className}`}>
        <Canvas
          ref={canvasRef}
          key={`inline-${cameraKey}`}
          camera={inlineCamera}
          dpr={isMobile ? [1, Math.min(maxDpr, 1.5)] : [1, maxDpr]}
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
            s3={s3}
          />
        </Canvas>

        {!isMobile && s3.interaction && (
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
            style={{ background: darkMode ? '#1a1a2e' : '#ffffff' }}
            onClick={(e) => { if (e.target === e.currentTarget) { setExpanded(false); setCameraKey((k) => k + 1) } }}
          >
            <div className="absolute top-0 left-0 right-0 z-[100000] flex items-center justify-between px-6 py-4 bg-slate-900/60 dark:bg-black/60 backdrop-blur-md border-b border-white/10 text-white">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">3D Workspace (Interactive View)</span>
              <div className="flex items-center gap-2">
                <motion.button onClick={handleResetCamera} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all cursor-pointer" title="Reset camera" aria-label="Reset camera">
                  <RotateCcw size={16} />
                </motion.button>
                <motion.button onClick={handleToggle} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all cursor-pointer" title="Collapse" aria-label="Collapse 3D workspace">
                  <Minimize2 size={16} />
                </motion.button>
              </div>
            </div>

            <Canvas
              key={`expanded-${cameraKey}`}
              camera={{ position: [cam.positionX || 0, 2.2, 8], fov: cam.fov || 40, near: 0.1, far: 100 }}
              dpr={[1, Math.min(maxDpr, 1.5)]}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: darkMode ? 1.1 : 1.0,
              }}
              shadows={s3.shadows}
              frameloop="demand"
              style={{ background: darkMode ? '#1a1a2e' : '#ffffff', width: '100%', height: '100%' }}
            >
              <SceneContent darkMode={darkMode} isMobile={false} profileData={profileData} canvasRef={canvasRef} s3={s3} />
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
