import { useRef, useMemo, useEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 600
const SYMBOL_COLORS = [
  '#06b6d4', '#8b5cf6', '#4ade80', '#f59e0b',
  '#ec4899', '#61dafb', '#68a063', '#ffffff',
  '#3178c6', '#f05032', '#47a248', '#ff9900',
]

function SceneKnowledge({ progress, onComplete }) {
  const pointsRef = useRef()
  const symbolsRef = useRef()
  const linesRef = useRef()

  const { positions, velocities, colors, targetPositions } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    const tgt = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 0.3
      pos[i3 + 1] = (Math.random() - 0.5) * 0.3
      pos[i3 + 2] = (Math.random() - 0.5) * 0.3

      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.5 + Math.random() * 4
      tgt[i3] = r * Math.sin(phi) * Math.cos(theta)
      tgt[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      tgt[i3 + 2] = r * Math.cos(phi)

      vel[i3] = (Math.random() - 0.5) * 0.01
      vel[i3 + 1] = (Math.random() - 0.5) * 0.01
      vel[i3 + 2] = (Math.random() - 0.5) * 0.01

      const c = new THREE.Color(SYMBOL_COLORS[i % SYMBOL_COLORS.length])
      col[i3] = c.r
      col[i3 + 1] = c.g
      col[i3 + 2] = c.b
    }
    return { positions: pos, velocities: vel, colors: col, targetPositions: tgt }
  }, [])

  const linePositions = useMemo(() => new Float32Array(300 * 6), [])

  useEffect(() => {
    if (progress >= 1) onComplete?.()
  }, [progress, onComplete])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.getElapsedTime()
    const posAttr = pointsRef.current.geometry.attributes.position
    const expand = Math.min(progress * 2, 1)
    const drift = progress > 0.5

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      posAttr.array[i3] = THREE.MathUtils.lerp(posAttr.array[i3], targetPositions[i3], expand * 0.025)
      posAttr.array[i3 + 1] = THREE.MathUtils.lerp(posAttr.array[i3 + 1], targetPositions[i3 + 1], expand * 0.025)
      posAttr.array[i3 + 2] = THREE.MathUtils.lerp(posAttr.array[i3 + 2], targetPositions[i3 + 2], expand * 0.025)

      if (drift) {
        posAttr.array[i3] += Math.sin(t * 0.2 + i * 0.08) * 0.003
        posAttr.array[i3 + 1] += Math.cos(t * 0.15 + i * 0.12) * 0.003
        posAttr.array[i3 + 2] += Math.sin(t * 0.18 + i * 0.1) * 0.003
      }
    }
    posAttr.needsUpdate = true

    if (linesRef.current && expand > 0.3) {
      const lineAttr = linesRef.current.geometry.attributes.position
      let idx = 0
      for (let i = 0; i < 150 && idx < 300; i++) {
        const a = Math.floor(Math.random() * PARTICLE_COUNT)
        const b = Math.floor(Math.random() * PARTICLE_COUNT)
        if (a === b) continue
        const a3 = a * 3, b3 = b * 3
        const dx = posAttr.array[a3] - posAttr.array[b3]
        const dy = posAttr.array[a3 + 1] - posAttr.array[b3 + 1]
        const dz = posAttr.array[a3 + 2] - posAttr.array[b3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 1.8) {
          lineAttr.array[idx * 6] = posAttr.array[a3]
          lineAttr.array[idx * 6 + 1] = posAttr.array[a3 + 1]
          lineAttr.array[idx * 6 + 2] = posAttr.array[a3 + 2]
          lineAttr.array[idx * 6 + 3] = posAttr.array[b3]
          lineAttr.array[idx * 6 + 4] = posAttr.array[b3 + 1]
          lineAttr.array[idx * 6 + 5] = posAttr.array[b3 + 2]
          idx++
        }
      }
      lineAttr.needsUpdate = true
      linesRef.current.geometry.setDrawRange(0, idx * 2)
    }
  })

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={PARTICLE_COUNT} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={colors} count={PARTICLE_COUNT} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          transparent
          opacity={Math.min(progress * 2.5, 0.85)}
          vertexColors
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={linePositions} count={300 * 2} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#06b6d4" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </lineSegments>

      <pointLight color="#06b6d4" intensity={1.2} distance={10} decay={2} />
      <pointLight color="#8b5cf6" intensity={0.6} distance={8} decay={2} position={[4, 3, -3]} />
      <pointLight color="#4ade80" intensity={0.3} distance={6} decay={2} position={[-3, -2, 2]} />
    </group>
  )
}

export default memo(SceneKnowledge)
