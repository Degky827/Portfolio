import { useRef, useMemo, useEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WINDOWS = [
  { name: 'GitHub', color: '#ffffff', angle: 0 },
  { name: 'Projects', color: '#06b6d4', angle: 0.785 },
  { name: 'Experience', color: '#8b5cf6', angle: 1.57 },
  { name: 'Skills', color: '#4ade80', angle: 2.356 },
  { name: 'Certifications', color: '#f59e0b', angle: 3.14 },
  { name: 'Education', color: '#ec4899', angle: 3.927 },
  { name: 'Timeline', color: '#06b6d4', angle: 4.712 },
  { name: 'Open Source', color: '#6366f1', angle: 5.497 },
]

const RADIUS = 3.2

function EnergyLines({ windows, progress }) {
  const linesRef = useRef()
  const lineCount = windows.length * 2

  const positions = useMemo(() => new Float32Array(lineCount * 6), [lineCount])

  useFrame((state) => {
    if (!linesRef.current) return
    const t = state.clock.getElapsedTime()
    const attr = linesRef.current.geometry.attributes.position
    let idx = 0

    for (let i = 0; i < windows.length && idx < lineCount; i++) {
      const angle = windows[i].angle + t * 0.1
      const x = Math.cos(angle) * RADIUS
      const z = Math.sin(angle) * RADIUS
      const y = Math.sin(t * 0.3 + i) * 0.1

      attr.array[idx * 6] = 0
      attr.array[idx * 6 + 1] = 0
      attr.array[idx * 6 + 2] = 0
      attr.array[idx * 6 + 3] = x
      attr.array[idx * 6 + 4] = y
      attr.array[idx * 6 + 5] = z
      idx++
    }

    for (let i = 0; i < windows.length - 1 && idx < lineCount; i++) {
      const a1 = windows[i].angle + t * 0.1
      const a2 = windows[i + 1].angle + t * 0.1
      const x1 = Math.cos(a1) * RADIUS
      const z1 = Math.sin(a1) * RADIUS
      const x2 = Math.cos(a2) * RADIUS
      const z2 = Math.sin(a2) * RADIUS
      const y1 = Math.sin(t * 0.3 + i) * 0.1
      const y2 = Math.sin(t * 0.3 + i + 1) * 0.1

      attr.array[idx * 6] = x1
      attr.array[idx * 6 + 1] = y1
      attr.array[idx * 6 + 2] = z1
      attr.array[idx * 6 + 3] = x2
      attr.array[idx * 6 + 4] = y2
      attr.array[idx * 6 + 5] = z2
      idx++
    }

    attr.needsUpdate = true
    linesRef.current.geometry.setDrawRange(0, idx * 2)
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={lineCount * 2} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#06b6d4"
        transparent
        opacity={Math.min(progress * 2, 0.2)}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

function HoloWindow({ window, index, progress }) {
  const groupRef = useRef()
  const appear = Math.min(Math.max(progress * WINDOWS.length - index * 0.5, 0), 1)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    const angle = window.angle + t * 0.08
    groupRef.current.position.x = Math.cos(angle) * RADIUS
    groupRef.current.position.z = Math.sin(angle) * RADIUS
    groupRef.current.position.y = Math.sin(t * 0.25 + index * 0.5) * 0.12
    groupRef.current.lookAt(0, groupRef.current.position.y, 0)
  })

  return (
    <group ref={groupRef}>
      <mesh scale={appear}>
        <planeGeometry args={[0.65, 0.45]} />
        <meshBasicMaterial
          color={window.color}
          transparent
          opacity={appear * 0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <lineSegments scale={appear}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([
              -0.325, -0.225, 0, 0.325, -0.225, 0,
              0.325, -0.225, 0, 0.325, 0.225, 0,
              0.325, 0.225, 0, -0.325, 0.225, 0,
              -0.325, 0.225, 0, -0.325, -0.225, 0,
            ])}
            count={8}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={window.color} transparent opacity={appear * 0.45} />
      </lineSegments>

      <mesh scale={appear * 1.3}>
        <planeGeometry args={[0.75, 0.55]} />
        <meshBasicMaterial
          color={window.color}
          transparent
          opacity={appear * 0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function SceneDigitalEcosystem({ progress, onComplete }) {
  const groupRef = useRef()

  useEffect(() => {
    if (progress >= 1) onComplete?.()
  }, [progress, onComplete])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.04
  })

  return (
    <group ref={groupRef}>
      {WINDOWS.map((w, i) => (
        <HoloWindow key={w.name} window={w} index={i} progress={progress} />
      ))}

      <EnergyLines windows={WINDOWS} progress={progress} />

      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={progress * 0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <ambientLight intensity={0.04} color="#06b6d4" />
      <pointLight color="#06b6d4" intensity={1} distance={10} decay={2} />
      <pointLight color="#8b5cf6" intensity={0.5} distance={8} decay={2} position={[4, 3, -3]} />
    </group>
  )
}

export default memo(SceneDigitalEcosystem)
