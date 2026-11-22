import { Suspense, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2, ZoomIn, ZoomOut } from 'lucide-react'
import { useIsMobile, useDarkModeScene } from '../../../shared/hooks/useSceneHooks'
import { getHeroScrollProgress } from '../../shared/heroScrollStore'
import * as THREE from 'three'
import Desk from './Desk'
import Monitor from './Monitor'
import Keyboard from './Keyboard'
import PC from './PC'
import Speaker from './Speaker'

const PURPLE = new THREE.Color('#6C2BFF')
const PURPLE_VIBRANT = new THREE.Color('#A855F7')

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
    fov: 30, zoom: 1,
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

/* ─── Scroll-driven camera movement ─── */
function ScrollCamera() {
  const { camera } = useThree()
  const targetRef = useRef({ x: 0.35, y: 1.6, z: 5.1 })

  useFrame(() => {
    const scrollProgress = getHeroScrollProgress()

    // Subtle stable movement based on scroll
    const targetX = 0.35 + scrollProgress * 0.25
    const targetY = 1.6 - scrollProgress * 0.4
    const targetZ = 5.1 + scrollProgress * 1.2

    targetRef.current.x += (targetX - targetRef.current.x) * 0.03
    targetRef.current.y += (targetY - targetRef.current.y) * 0.03
    targetRef.current.z += (targetZ - targetRef.current.z) * 0.03

    camera.position.x = targetRef.current.x
    camera.position.y = targetRef.current.y
    camera.position.z = targetRef.current.z
    camera.lookAt(0.2, 1.0, -0.2)
  })

  return null
}

/* ─── Scene Content ─── */
function SceneContent({ darkMode, isMobile, profileData, s3, controlsRef }) {
  const { viewport } = useThree()
  const desktopGroupRef = useRef()

  const castShadows = s3.shadows !== false && !isMobile
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

  // Workstation base width is 3.55 units
  const workstationScale = Math.min(1.0, (viewport.width * 0.95) / 3.55)
  const groupScale = workstationScale
  const groupPos = [0, 0, 0]

  // Tabletop surface at y = 0.72 inside the scaled group
  const deskPos = [0, 0, 0]
  const monitorPos = [-0.14, 0.72, -0.06]
  const keyboardPos = [-0.14, 0.72, 0.28]
  const mousepadPos = [0.48, 0.72, 0.28]
  const speakerLeftPos = [-1.22, 0.72, 0.04]
  const speakerRightPos = [0.90, 0.72, 0.04]
  const pcPos = [1.38, 0.72, 0.04]

  return (
    <>
      <ambientLight intensity={darkMode ? 0.70 : 0.88} color="#ffffff" />

      {/* Primary Key Light - Balanced studio directional light casting crisp, realistic shadows */}
      <directionalLight
        position={[2.8, 6.8, 3.8]}
        intensity={darkMode ? 1.25 : 1.35}
        color={darkMode ? '#9a90f6' : '#ffffff'}
        castShadow={castShadows}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
      />

      {/* Secondary Fill Light - Soft studio ambient fill */}
      <directionalLight
        position={[-3.2, 5.0, 2.5]}
        intensity={darkMode ? 0.35 : 0.38}
        color={darkMode ? '#7c3aed' : '#edf0ff'}
      />

      {/* ── Floor Shadow Catcher (Receives directional shadows from white table slab & sled legs) ── */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <shadowMaterial transparent opacity={darkMode ? 0.65 : 0.35} />
      </mesh>

      {/* ── Soft Ambient Contact Shadow on Floor (Grounds the table legs and sled runners) ── */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={darkMode ? 0.85 : 0.65}
        scale={9.6}
        blur={2.4}
        far={2.8}
        color={darkMode ? '#080810' : '#140c24'}
      />

      {/* ── Workstation (White Table + Charcoal Black Components + Purple Accents) ── */}
      <group ref={desktopGroupRef} position={groupPos} scale={workstationScale}>
        {vis('desk') && <Desk position={deskPos} />}
        {vis('monitor') && <Monitor position={monitorPos} screenMode="code" profileData={profileData} />}
        {vis('keyboard') && <Keyboard position={keyboardPos} />}

        {vis('mouse') && (
          <group position={mousepadPos}>
            {/* Charcoal Black Mousepad with Glowing Purple Neon Trim */}
            <mesh receiveShadow position={[0, 0.002, 0]}>
              <boxGeometry args={[0.38, 0.004, 0.28]} />
              <meshStandardMaterial color="#0c0d11" roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.001, 0]}>
              <boxGeometry args={[0.388, 0.003, 0.288]} />
              <meshStandardMaterial
                color={PURPLE_VIBRANT}
                emissive={PURPLE}
                emissiveIntensity={2.2}
              />
            </mesh>

            {/* Ergonomic Gaming Mouse in Matte Charcoal Black */}
            <group position={[0, 0.016, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.080, 0.026, 0.126]} />
                <meshStandardMaterial color="#0e0f14" roughness={0.35} metalness={0.65} />
              </mesh>
              {/* Illuminated purple scroll wheel */}
              <mesh position={[0, 0.013, -0.026]}>
                <cylinderGeometry args={[0.006, 0.006, 0.014, 12]} />
                <meshStandardMaterial color={PURPLE_VIBRANT} emissive={PURPLE} emissiveIntensity={2.8} />
              </mesh>
              {/* Illuminated purple rear logo */}
              <mesh position={[0, 0.014, 0.032]}>
                <boxGeometry args={[0.020, 0.002, 0.020]} />
                <meshStandardMaterial color={PURPLE_VIBRANT} emissive={PURPLE} emissiveIntensity={2.5} />
              </mesh>
            </group>
          </group>
        )}

        {vis('pc') && <PC position={pcPos} />}
        {vis('speaker-left') && <Speaker position={speakerLeftPos} side="left" />}
        {vis('speaker-right') && <Speaker position={speakerRightPos} side="right" />}

        {/* Accent Point Light at PC Fans */}
        <pointLight
          position={[1.38, 1.06, 0.34]}
          intensity={0.70}
          color={PURPLE}
          distance={2.4}
          decay={2}
        />

        {/* Soft ambient purple reflection pool under PC fans onto satin white tabletop */}
        <pointLight
          position={[1.34, 0.76, 0.22]}
          intensity={0.65}
          color={PURPLE}
          distance={1.0}
          decay={2}
        />

        {/* Soft ambient purple reflection pool on satin white tabletop under monitor & keyboard */}
        <pointLight
          position={[-0.14, 0.76, 0.08]}
          intensity={0.55}
          color={PURPLE}
          distance={1.1}
          decay={2}
        />

        {/* Accent Point Light at Left Speaker */}
        <pointLight
          position={[-1.22, 0.82, 0.18]}
          intensity={0.25}
          color={PURPLE}
          distance={1.0}
          decay={2}
        />
      </group>

      <OrbitControls
        ref={controlsRef}
        target={[0.2, 1.0, -0.2]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4.2}
        maxPolarAngle={Math.PI / 2.05}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        autoRotate={false}
      />

      {getHeroScrollProgress() > 0 && <ScrollCamera />}
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

/* ─── Main Component ─── */
export default function HeroDesktopScene({ className = '', profileData, scene3D }) {
  const isMobile = useIsMobile()
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

  /* Device-level toggle */
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024
  if (isMobile && !s3.performance.mobile) {
    return <div className={`relative w-full h-full ${className}`}><FallbackScene darkMode={darkMode} /></div>
  }
  if (isTablet && !s3.performance.tablet) {
    return <div className={`relative w-full h-full ${className}`}><FallbackScene darkMode={darkMode} /></div>
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

  // Low FOV (28°) telephoto perspective frames the 3D wall text and reduced table cleanly
  const inlineCamera = useMemo(() => {
    if (isMobile) {
      return { position: [0.0, 1.60, 5.00], fov: 30, near: 0.1, far: 25 }
    }
    return { position: [0.0, 1.70, 4.80], fov: 28, near: 0.1, far: 25 }
  }, [isMobile])

  const maxDpr = s3.performance.maxDpr || 2
  const inlineGl = useMemo(() => ({
    antialias: !isMobile,
    alpha: true,
    powerPreference: s3.performance.lightweightMobile && isMobile ? 'low-power' : 'default',
    stencil: false,
    depth: true,
    failIfMajorPerformanceCaveat: false,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: darkMode ? 1.08 : 1.02,
  }), [isMobile, darkMode, s3.performance.lightweightMobile])

  return (
    <>
      <div className={`relative w-full h-full ${className}`}>
        <Canvas
          shadows
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
                camera={{ position: [0.0, 1.70, 4.80], fov: 28, near: 0.1, far: 25 }}
                dpr={[1, maxDpr]}
                gl={inlineGl}
                style={{ background: 'transparent' }}
              >
                <SceneContent
                  darkMode={darkMode}
                  isMobile={false}
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
