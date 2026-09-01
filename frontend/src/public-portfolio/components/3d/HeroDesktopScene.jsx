import { Suspense, useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
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
   Drag Controller
   - Auto-rotation on Y axis when idle
   - Pauses during interaction
   - Velocity-based inertia on release
   - Smooth damping back to idle
   ──────────────────────────────────────────────────────────────── */
const DRAG_SENSITIVITY = 0.005
const MAX_TILT_X = 0.25
const MAX_TILT_Y = 0.5
const AUTO_ROTATE_SPEED = 0.15
const INERTIA_DECAY = 0.92
const DAMPING_LERP = 0.04

function DesktopDragController({ groupRef, canvasRef }) {
  const isDragging = useRef(false)
  const prevPointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const autoAngle = useRef(0)
  const interactionTimeout = useRef(null)
  const isInteracting = useRef(false)

  useEffect(() => {
    const canvas = canvasRef?.current
    if (!canvas) return

    const handlePointerDown = (e) => {
      isDragging.current = true
      isInteracting.current = true
      prevPointer.current = { x: e.clientX, y: e.clientY }
      velocity.current = { x: 0, y: 0 }
      canvas.setPointerCapture(e.pointerId)
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current)
    }

    const handlePointerMove = (e) => {
      if (!isDragging.current) return
      const dx = e.clientX - prevPointer.current.x
      const dy = e.clientY - prevPointer.current.y
      prevPointer.current = { x: e.clientX, y: e.clientY }

      velocity.current.x = dy * DRAG_SENSITIVITY
      velocity.current.y = dx * DRAG_SENSITIVITY

      targetRotation.current.y = THREE.MathUtils.clamp(
        targetRotation.current.y + velocity.current.y,
        -MAX_TILT_Y,
        MAX_TILT_Y
      )
      targetRotation.current.x = THREE.MathUtils.clamp(
        targetRotation.current.x + velocity.current.x,
        -MAX_TILT_X,
        MAX_TILT_X
      )
    }

    const handlePointerUp = (e) => {
      isDragging.current = false
      canvas.releasePointerCapture(e.pointerId)
      interactionTimeout.current = setTimeout(() => {
        isInteracting.current = false
      }, 2000)
    }

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: true })
    canvas.addEventListener('pointermove', handlePointerMove, { passive: true })
    canvas.addEventListener('pointerup', handlePointerUp, { passive: true })
    canvas.addEventListener('pointercancel', handlePointerUp, { passive: true })

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerUp)
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current)
    }
  }, [canvasRef])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (!isInteracting.current) {
      autoAngle.current += delta * AUTO_ROTATE_SPEED
      targetRotation.current.y = Math.sin(autoAngle.current) * 0.15
      targetRotation.current.x = Math.sin(autoAngle.current * 0.7) * 0.03
    }

    if (!isDragging.current) {
      velocity.current.x *= INERTIA_DECAY
      velocity.current.y *= INERTIA_DECAY
      targetRotation.current.x += velocity.current.x
      targetRotation.current.y += velocity.current.y
      targetRotation.current.x = THREE.MathUtils.clamp(targetRotation.current.x, -MAX_TILT_X, MAX_TILT_X)
      targetRotation.current.y = THREE.MathUtils.clamp(targetRotation.current.y, -MAX_TILT_Y, MAX_TILT_Y)
    }

    rotation.current.x = THREE.MathUtils.lerp(rotation.current.x, targetRotation.current.x, DAMPING_LERP)
    rotation.current.y = THREE.MathUtils.lerp(rotation.current.y, targetRotation.current.y, DAMPING_LERP)

    groupRef.current.rotation.x = rotation.current.x
    groupRef.current.rotation.y = rotation.current.y
  })

  return null
}

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
  const { invalidate } = useThree()

  const bgColor = darkMode ? '#0B0D10' : '#ffffff'
  const fogColor = useMemo(() => new THREE.Color(bgColor), [bgColor])

  const floorColor = darkMode ? '#0d1117' : '#f8f9fa'
  const wallColor = darkMode ? '#141820' : '#f3f4f6'
  const accentColor = darkMode ? '#6366f1' : '#3b82f6'
  const ambientColor = darkMode ? '#1a1a2e' : '#f5f5f5'
  const dirColor = darkMode ? '#818cf8' : '#6366f1'

  const ambientIntensity = darkMode ? 0.35 : 0.5
  const dirIntensity = darkMode ? 1.0 : 0.8

  const floorRoughness = darkMode ? 0.6 : 0.85
  const floorMetalness = darkMode ? 0.35 : 0.1

  useEffect(() => {
    return () => {
      gl?.dispose()
    }
  }, [])

  return (
    <>
      {showBackground && <color attach="background" args={[bgColor]} />}
      <fog attach="fog" args={[fogColor, 12, 28]} />

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
        intensity={darkMode ? 0.15 : 0.1}
        color={darkMode ? '#4f46e5' : '#93c5fd'}
      />

      {/* Screen glow — subtle point light in dark mode */}
      {darkMode && (
        <pointLight
          position={[0.5, 1.6, -0.1]}
          intensity={0.4}
          color="#60a5fa"
          distance={4}
          decay={2}
        />
      )}

      <Suspense fallback={null}>
        <ProfessionalBackground darkMode={darkMode} isMobile={isMobile} />
      </Suspense>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={floorRoughness}
          metalness={floorMetalness}
          envMapIntensity={darkMode ? 0.5 : 0.2}
        />
      </mesh>

      {/* Accent strip under desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 1.2]}>
        <planeGeometry args={[3.5, 0.4]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={darkMode ? 0.25 : 0.1}
          transparent
          opacity={darkMode ? 0.15 : 0.08}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.5, -2]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={wallColor} roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Wall accent lines */}
      <mesh position={[0, 3.5, -1.99]}>
        <boxGeometry args={[8, 0.015, 0.01]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={darkMode ? 0.7 : 0.25} />
      </mesh>
      <mesh position={[0, 1.5, -1.99]}>
        <boxGeometry args={[6, 0.01, 0.01]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={darkMode ? 0.4 : 0.15} />
      </mesh>

      {/* Desktop assembly */}
      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.06}>
          <group ref={desktopGroupRef} position={[0.5, 0, 0]} scale={0.9}>
            <DesktopDragController groupRef={desktopGroupRef} canvasRef={canvasRef} />
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
      className={`absolute top-3 right-3 z-20 p-2 rounded-xl backdrop-blur-md border transition-all shadow-lg ${
        darkMode
          ? 'bg-black/60 border-white/10 hover:bg-black/80'
          : 'bg-white/60 border-black/10 hover:bg-white/80'
      }`}
      style={{ color: 'var(--text-primary)' }}
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
      style={{ backgroundColor: darkMode ? '#0B0D10' : '#ffffff' }}
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
        <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
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
      return { position: [2.0, 1.8, 5.5], fov: 48, near: 0.1, far: 20 }
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return { position: [3.0, 2.4, 5.5], fov: 38, near: 0.1, far: 20 }
    }
    return { position: [3.5, 2.8, 5.5], fov: 35, near: 0.1, far: 20 }
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
          dpr={isMobile ? [1, 1] : [1, 1.5]}
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
            className="fixed inset-0 z-50"
            style={{ background: darkMode ? '#0B0D10' : '#ffffff' }}
          >
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
              style={{ background: darkMode ? '#0B0D10' : '#ffffff' }}
            >
              <SceneContent darkMode={darkMode} isMobile={false} profileData={profileData} canvasRef={canvasRef} />
            </Canvas>

            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>
                3D Workspace
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleResetCamera}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                    darkMode
                      ? 'bg-white/10 border-white/10 hover:bg-white/20'
                      : 'bg-black/10 border-black/10 hover:bg-black/20'
                  }`}
                  style={{ color: 'var(--text-primary)' }}
                  title="Reset camera"
                  aria-label="Reset camera"
                >
                  <RotateCcw size={16} />
                </motion.button>
                <motion.button
                  onClick={handleToggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                    darkMode
                      ? 'bg-white/10 border-white/10 hover:bg-white/20'
                      : 'bg-black/10 border-black/10 hover:bg-black/20'
                  }`}
                  style={{ color: 'var(--text-primary)' }}
                  title="Collapse"
                  aria-label="Collapse 3D workspace"
                >
                  <Minimize2 size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
