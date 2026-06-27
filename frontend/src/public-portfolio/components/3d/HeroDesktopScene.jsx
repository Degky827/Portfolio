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

function useDarkMode() {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  )
  useEffect(() => {
    const el = document.documentElement
    const obs = new MutationObserver(() => {
      setDark(el.classList.contains('dark'))
    })
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

function SceneContent({ darkMode }) {
  const bgColor = darkMode ? '#0891b2' : '#ecfeff'
  const fogColor = useMemo(() => new THREE.Color(bgColor), [bgColor])
  const cyanColor = useMemo(() => new THREE.Color('#06b6d4'), [])

  const floorColor = darkMode ? '#065f73' : '#cffafe'
  const wallColor = darkMode ? '#065f73' : '#e0f7fa'
  const stripEmissiveIntensity = darkMode ? 2.5 : 0.8
  const ambientColor = darkMode ? '#cffafe' : '#e0f2fe'
  const dirColor = darkMode ? '#22d3ee' : '#0891b2'
  const ambientIntensity = darkMode ? 0.12 : 0.5
  const dirIntensity = darkMode ? 1.0 : 1.3

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 6, 18]} />

      <ambientLight intensity={ambientIntensity} color={ambientColor} />

      <directionalLight
        position={[3, 5, 4]}
        intensity={dirIntensity}
        color={dirColor}
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

      <pointLight position={[-4, 2, -2]} intensity={darkMode ? 1.2 : 0.4} color={cyanColor} distance={15} />
      <pointLight position={[4, 1, -1]} intensity={darkMode ? 0.6 : 0.2} color={cyanColor} distance={12} />
      <pointLight position={[0, -1, 2]} intensity={darkMode ? 0.3 : 0.1} color={cyanColor} distance={8} />
      <pointLight position={[0, 0.3, 0.5]} intensity={darkMode ? 0.4 : 0.15} color={cyanColor} distance={3} />

      {darkMode && (
        <Suspense fallback={null}>
          <NeonBackground />
        </Suspense>
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} metalness={0.2} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 1.5]}>
        <planeGeometry args={[4, 0.5]} />
        <meshStandardMaterial
          color={cyanColor}
          emissive={cyanColor}
          emissiveIntensity={darkMode ? 0.5 : 0.2}
          transparent
          opacity={darkMode ? 0.3 : 0.15}
        />
      </mesh>

      <mesh position={[0, 2.5, -2]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh position={[0, 3.5, -1.99]}>
        <boxGeometry args={[8, 0.02, 0.01]} />
        <meshStandardMaterial color={cyanColor} emissive={cyanColor} emissiveIntensity={stripEmissiveIntensity} />
      </mesh>

      <mesh position={[0, 1.5, -1.99]}>
        <boxGeometry args={[6, 0.01, 0.01]} />
        <meshStandardMaterial color={cyanColor} emissive={cyanColor} emissiveIntensity={darkMode ? 1.5 : 0.4} />
      </mesh>

      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.03} floatIntensity={0.08}>
          <group>
            <Desk position={[0, 0, 0]} />
            <Monitor position={[0, 0, -0.3]} screenMode="code" />
            <Keyboard position={[0, 0, 0.25]} />

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

            <PC position={[-2.2, 0, 0.3]} />
            <Speaker position={[-1.8, 0.78, 0.1]} side="left" />
            <Speaker position={[1.8, 0.78, 0.1]} side="right" />
          </group>
        </Float>
      </Suspense>

      <Preload all />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate
        autoRotateSpeed={0.4}
        target={[0, 0.8, 0]}
      />
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
          ? 'bg-black/60 border-white/10 text-white/70 hover:text-white hover:bg-black/80'
          : 'bg-white/60 border-black/10 text-black/50 hover:text-black/80 hover:bg-white/80'
      }`}
      title={label}
      aria-label={label}
    >
      <Icon size={16} />
    </motion.button>
  )
}

export default function HeroDesktopScene({ className = '' }) {
  const isMobile = useIsMobile()
  const darkMode = useDarkMode()
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
          <SceneContent darkMode={darkMode} />
        </Canvas>

        <ExpandButton onClick={handleToggle} icon={Maximize2} label="Expand 3D workspace" darkMode={darkMode} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            style={{ background: darkMode ? '#0891b2' : '#ecfeff' }}
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
              style={{ background: darkMode ? '#0891b2' : '#ecfeff' }}
            >
              <SceneContent darkMode={darkMode} />
            </Canvas>

            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
              <span className={`text-xs font-bold uppercase tracking-[0.2em] ${
                darkMode ? 'text-white/40' : 'text-black/40'
              }`}>
                3D Workspace
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleResetCamera}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                    darkMode
                      ? 'bg-white/10 border-white/10 text-white/70 hover:text-white hover:bg-white/20'
                      : 'bg-black/10 border-black/10 text-black/50 hover:text-black/80 hover:bg-black/20'
                  }`}
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
                      ? 'bg-white/10 border-white/10 text-white/70 hover:text-white hover:bg-white/20'
                      : 'bg-black/10 border-black/10 text-black/50 hover:text-black/80 hover:bg-black/20'
                  }`}
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
