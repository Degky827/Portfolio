import { useState, useEffect, useRef, memo, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useIntroAudio } from '../audio/useIntroAudio'
import ScanlineOverlay from '../components/ScanlineOverlay'

const OBJECTS = [
  { name: 'Desk', color: '#06b6d4', position: [0, -0.5, 0], delay: 0 },
  { name: 'Monitor', color: '#8b5cf6', position: [0, 0.3, -0.3], delay: 400 },
  { name: 'Keyboard', color: '#06b6d4', position: [0, 0, 0.3], delay: 700 },
  { name: 'Mouse', color: '#4ade80', position: [0.5, 0, 0.3], delay: 900 },
  { name: 'PC', color: '#f59e0b', position: [-1.5, -0.2, 0.2], delay: 1100 },
  { name: 'Lights', color: '#ec4899', position: [0, 1.5, 0], delay: 1300 },
]

function AssemblyParticles({ color, position, progress, count = 200 }) {
  const mesh = useRef()
  const targetPositions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const shape = Math.random() > 0.5 ? 'box' : 'sphere'
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      if (shape === 'box') {
        pos[i3] = (Math.random() - 0.5) * 0.8
        pos[i3 + 1] = (Math.random() - 0.5) * 0.5
        pos[i3 + 2] = (Math.random() - 0.5) * 0.6
      } else {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const r = 0.3 + Math.random() * 0.15
        pos[i3] = r * Math.sin(phi) * Math.cos(theta)
        pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
        pos[i3 + 2] = r * Math.cos(phi)
      }
    }
    return pos
  }, [count])

  const scatteredPositions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [count])

  useFrame(() => {
    if (!mesh.current) return
    const posAttr = mesh.current.geometry.attributes.position
    const t = Math.min(progress, 1)

    for (let i = 0; i < count * 3; i++) {
      posAttr.array[i] = scatteredPositions[i] + (targetPositions[i] - scatteredPositions[i]) * t
    }
    posAttr.needsUpdate = true
  })

  return (
    <group position={position}>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={new Float32Array(scatteredPositions)} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.03}
          transparent
          opacity={0.7 * progress}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {progress > 0.9 && (
        <mesh visible={progress > 0.95}>
          <boxGeometry args={[0.8, 0.5, 0.6]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={(progress - 0.9) * 3}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  )
}

function AssemblyScene({ objectProgress }) {
  return (
    <>
      <ambientLight intensity={0.3} color="#06b6d4" />
      <pointLight position={[3, 3, 3]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[-3, 2, -2]} intensity={0.4} color="#8b5cf6" />
      {OBJECTS.map((obj, i) => (
        <AssemblyParticles
          key={obj.name}
          color={obj.color}
          position={obj.position}
          progress={objectProgress[i] || 0}
        />
      ))}
    </>
  )
}

function Phase5WorkspaceConstruction({ onComplete }) {
  const [objectProgress, setObjectProgress] = useState(OBJECTS.map(() => 0))
  const [activeIndex, setActiveIndex] = useState(-1)
  const { playRelayClick, playPowerOn } = useIntroAudio()
  const startRef = useRef(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      setObjectProgress((prev) =>
        prev.map((p, i) => {
          const obj = OBJECTS[i]
          const objStart = obj.delay
          const objDuration = 600
          const t = Math.max(0, Math.min((elapsed - objStart) / objDuration, 1))
          if (t > 0 && t < 1 && p === 0 && i !== activeIndex) {
            setActiveIndex(i)
            playRelayClick()
          }
          return t
        })
      )

      if (elapsed > 2500) {
        clearInterval(interval)
        playPowerOn()
        setTimeout(() => onComplete?.(), 500)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete, playRelayClick, playPowerOn, activeIndex])

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 1, 4], fov: 50 }}
          dpr={[1, 1]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <AssemblyScene objectProgress={objectProgress} />
        </Canvas>
      </div>

      {/* Object labels */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <div className="flex gap-3">
          {OBJECTS.map((obj, i) => (
            <motion.div
              key={obj.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: objectProgress[i] > 0 ? 1 : 0.2, y: 0 }}
              className="font-mono text-[10px] tracking-wider text-center"
            >
              <div
                className="w-2 h-2 rounded-full mx-auto mb-1"
                style={{
                  backgroundColor: obj.color,
                  opacity: objectProgress[i] >= 1 ? 1 : 0.3,
                  boxShadow: objectProgress[i] >= 1 ? `0 0 8px ${obj.color}60` : 'none',
                }}
              />
              <span style={{ color: objectProgress[i] >= 1 ? obj.color : '#ffffff30' }}>
                {obj.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 font-mono text-xs tracking-[0.3em] uppercase" style={{ color: '#06b6d460' }}>
        Constructing Workspace
      </div>

      <ScanlineOverlay opacity={0.015} />
    </div>
  )
}

export default memo(Phase5WorkspaceConstruction)
