import { Suspense, useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Float } from '@react-three/drei'
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

const cyanColor = new THREE.Color('#22d3ee')

const MAX_DRAG_X = 12 * (Math.PI / 180)
const MAX_DRAG_Y = 35 * (Math.PI / 180)
const RETURN_LERP = 0.05
const IDLE_WOBBLE_SPEED = 0.3
const IDLE_WOBBLE_AMP = 0.02

function DesktopDragController({ groupRef, canvasRef }) {
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const rotationOffset = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })
  const idlePhase = useRef(0)

  useEffect(() => {
    const canvas = canvasRef?.current
    if (!canvas) return

    const handlePointerDown = (e) => {
      isDragging.current = true
      dragStart.current.x = e.clientX
      dragStart.current.y = e.clientY
      canvas.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e) => {
      if (!isDragging.current) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      rotationOffset.current.y = THREE.MathUtils.clamp(
        (dx / window.innerWidth) * Math.PI * 0.5,
        -MAX_DRAG_Y,
        MAX_DRAG_Y
      )
      rotationOffset.current.x = THREE.MathUtils.clamp(
        (dy / window.innerHeight) * Math.PI * 0.3,
        -MAX_DRAG_X,
        MAX_DRAG_X
      )
    }

    const handlePointerUp = (e) => {
      isDragging.current = false
      rotationOffset.current.x = 0
      rotationOffset.current.y = 0
      canvas.releasePointerCapture(e.pointerId)
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
    }
  }, [canvasRef])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const targetX = rotationOffset.current.x
    const targetY = rotationOffset.current.y

    if (isDragging.current) {
      currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetX, 0.15)
      currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetY, 0.15)
    } else {
      idlePhase.current += delta * IDLE_WOBBLE_SPEED
      const idleX = Math.sin(idlePhase.current) * IDLE_WOBBLE_AMP
      const idleY = Math.cos(idlePhase.current * 0.7) * IDLE_WOBBLE_AMP * 0.5

      currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, idleX, RETURN_LERP)
      currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, idleY, RETURN_LERP)
    }

    groupRef.current.rotation.x = currentRotation.current.x
    groupRef.current.rotation.y = currentRotation.current.y
  })

  return null
}

function SceneContent({ darkMode, isMobile, profileData, canvasRef }) {
  const desktopGroupRef = useRef()

  const bgColor = darkMode ? '#0B0D10' : '#ffffff'
  const fogColor = useMemo(() => new THREE.Color(bgColor), [bgColor])

  const floorColor = darkMode ? '#13161B' : '#f9fafb'
  const wallColor = darkMode ? '#1C2028' : '#f3f4f6'
  const accentColor = darkMode ? '#6366f1' : '#3b82f6'
  const ambientColor = darkMode ? '#1E1E1E' : '#f0f0f0'
  const dirColor = darkMode ? '#818cf8' : '#6366f1'
  const ambientIntensity = darkMode ? 0.4 : 0.6
  const dirIntensity = darkMode ? 1.2 : 1.0

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 15, 30]} />

      <ambientLight intensity={ambientIntensity} color={ambientColor} />

      <directionalLight
        position={[3, 5, 4]}
        intensity={dirIntensity}
        color={dirColor}
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 256 : 512}
        shadow-mapSize-height={isMobile ? 256 : 512}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      <Suspense fallback={null}>
        <ProfessionalBackground darkMode={darkMode} isMobile={isMobile} />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} metalness={0.2} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 1.5]}>
        <planeGeometry args={[4, 0.5]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={darkMode ? 0.3 : 0.15}
          transparent
          opacity={darkMode ? 0.2 : 0.1}
        />
      </mesh>

      <mesh position={[0, 2.5, -2]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh position={[0, 3.5, -1.99]}>
        <boxGeometry args={[8, 0.02, 0.01]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={darkMode ? 0.8 : 0.3} />
      </mesh>

      <mesh position={[0, 1.5, -1.99]}>
        <boxGeometry args={[6, 0.01, 0.01]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={darkMode ? 0.5 : 0.2} />
      </mesh>

      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.08}>
          <group ref={desktopGroupRef} position={[0.5, 0, 0]}>
            <DesktopDragController groupRef={desktopGroupRef} canvasRef={canvasRef} />
            <Desk position={[0, 0, 0]} />
            <Monitor
              position={[0, 0, -0.3]}
              screenMode="dashboard"
              profileData={profileData}
            />
            <Keyboard position={[0, 0, 0.25]} />

            {!isMobile && (
              <group position={[0.9, 0.78, 0.3]}>
                <mesh castShadow>
                  <boxGeometry args={[0.12, 0.03, 0.18]} />
                  <meshStandardMaterial color="#0f0a2a" roughness={0.2} metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.02, -0.03]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
                  <meshStandardMaterial color={cyanColor} emissive={cyanColor} emissiveIntensity={2} />
                </mesh>
                <mesh position={[0, -0.01, 0]}>
                  <boxGeometry args={[0.1, 0.005, 0.16]} />
                  <meshStandardMaterial color={cyanColor} emissive={cyanColor} emissiveIntensity={1} transparent opacity={0.5} />
                </mesh>
              </group>
            )}

            {!isMobile && <PC position={[-2.2, 0, 0.3]} />}
            <Speaker position={[-1.8, 0.78, 0.1]} side="left" />
            {!isMobile && <Speaker position={[1.8, 0.78, 0.1]} side="right" />}
          </group>
        </Float>
      </Suspense>

      <Preload all />
    </>
  )
}

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

export default function HeroDesktopScene({ className = '', profileData }) {
  const isMobile = useIsMobile()
  const darkMode = useDarkModeScene()
  const [expanded, setExpanded] = useState(false)
  const [cameraKey, setCameraKey] = useState(0)
  const canvasRef = useRef(null)

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev)
    setCameraKey((k) => k + 1)
  }, [])

  const handleResetCamera = useCallback(() => {
    setCameraKey((k) => k + 1)
  }, [])

  const inlineCamera = isMobile
    ? { position: [2.5, 2.2, 5], fov: 45, near: 0.1, far: 100 }
    : { position: [3.5, 2.8, 5.5], fov: 35, near: 0.1, far: 100 }

  return (
    <>
      <div className={`relative w-full h-full ${className}`}>
        <Canvas
          ref={canvasRef}
          key={`inline-${cameraKey}`}
          camera={inlineCamera}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          style={{ background: 'transparent' }}
        >
          <SceneContent
            darkMode={darkMode}
            isMobile={isMobile}
            profileData={profileData}
            canvasRef={canvasRef}
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
            style={{ background: darkMode ? '#0B0D10' : '#F3F4F6' }}
          >
            <Canvas
              key={`expanded-${cameraKey}`}
              camera={{ position: [0, 2.2, 8], fov: 40, near: 0.1, far: 100 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
              }}
              shadows
              style={{ background: darkMode ? '#0B0D10' : '#F3F4F6' }}
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
