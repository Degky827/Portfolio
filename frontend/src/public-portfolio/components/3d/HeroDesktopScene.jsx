import { Suspense, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import * as THREE from 'three'
import Desk from './Desk'
import Monitor from './Monitor'
import Keyboard from './Keyboard'
import PC from './PC'
import Speaker from './Speaker'
import NeonBackground from './NeonBackground'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function SceneContent() {
  const fogColor = useMemo(() => new THREE.Color('#0a2a2a'), [])
  const purpleColor = useMemo(() => new THREE.Color('#8b5cf6'), [])
  const cyanColor = useMemo(() => new THREE.Color('#06b6d4'), [])

  return (
    <>
      <color attach="background" args={['#0a2a2a']} />
      <fog attach="fog" args={[fogColor, 6, 18]} />

      <ambientLight intensity={0.08} color="#cffafe" />

      <directionalLight
        position={[3, 5, 4]}
        intensity={0.8}
        color="#22d3ee"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      <pointLight position={[-4, 2, -2]} intensity={1.2} color={cyanColor} distance={15} />
      <pointLight position={[4, 1, -1]} intensity={0.6} color={cyanColor} distance={12} />
      <pointLight position={[0, -1, 2]} intensity={0.3} color={cyanColor} distance={8} />
      <pointLight position={[0, 0.3, 0.5]} intensity={0.4} color={cyanColor} distance={3} />

      <Suspense fallback={null}>
        <NeonBackground />
      </Suspense>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#051a1a" roughness={0.8} metalness={0.2} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 1.5]}>
          <planeGeometry args={[4, 0.5]} />
          <meshStandardMaterial
            color={cyanColor}
            emissive={cyanColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>

        <mesh position={[0, 2.5, -2]} receiveShadow>
          <planeGeometry args={[12, 6]} />
          <meshStandardMaterial color="#051a1a" roughness={0.9} metalness={0.1} />
        </mesh>

        <mesh position={[0, 3.5, -1.99]}>
          <boxGeometry args={[8, 0.02, 0.01]} />
          <meshStandardMaterial color={cyanColor} emissive={cyanColor} emissiveIntensity={2} />
        </mesh>

        <mesh position={[0, 1.5, -1.99]}>
          <boxGeometry args={[6, 0.01, 0.01]} />
          <meshStandardMaterial color={cyanColor} emissive={cyanColor} emissiveIntensity={1.5} />
        </mesh>

      <Suspense fallback={null}>
        <Desk position={[0, 0, 0]} />
        <Monitor position={[0, 0, -0.3]} />
        <Keyboard position={[0, 0, 0.25]} />

        <Float speed={2} rotationIntensity={0} floatIntensity={0.1}>
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
        </Float>

        <PC position={[-2.2, 0, 0.3]} />
        <Speaker position={[-1.8, 0.78, 0.1]} side="left" />
        <Speaker position={[1.8, 0.78, 0.1]} side="right" />
      </Suspense>

      <Preload all />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.3}
        autoRotate
        autoRotateSpeed={0.4}
        target={[0, 1, 0]}
      />
    </>
  )
}

function ExpandButton({ onClick, icon: Icon, label }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/80 transition-all shadow-lg"
      title={label}
      aria-label={label}
    >
      <Icon size={16} />
    </motion.button>
  )
}

export default function HeroDesktopScene({ className = '' }) {
  const isMobile = useIsMobile()
  const [expanded, setExpanded] = useState(false)
  const [cameraKey, setCameraKey] = useState(0)

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev)
    setCameraKey((k) => k + 1)
  }, [])

  const handleResetCamera = useCallback(() => {
    setCameraKey((k) => k + 1)
  }, [])

  if (isMobile) return null

  return (
    <>
      {/* Inline mode - fills the right column */}
      <div className={`relative w-full h-full ${className}`}>
        <Canvas
          key={`inline-${cameraKey}`}
          camera={{ position: [3.5, 2.8, 5.5], fov: 35, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          style={{ background: 'transparent' }}
        >
          <SceneContent />
        </Canvas>

        <ExpandButton onClick={handleToggle} icon={Maximize2} label="Expand 3D workspace" />
      </div>

      {/* Fullscreen overlay when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#0a2a2a]"
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
              style={{ background: '#0a2a2a' }}
            >
              <SceneContent />
            </Canvas>

            {/* Top bar with controls */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                3D Workspace
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleResetCamera}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
                  title="Reset camera"
                  aria-label="Reset camera"
                >
                  <RotateCcw size={16} />
                </motion.button>
                <motion.button
                  onClick={handleToggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
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
