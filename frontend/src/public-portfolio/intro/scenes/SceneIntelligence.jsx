import { useRef, useMemo, useEffect, memo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_COUNT = 120
const CONNECTION_DIST = 2.2

function SceneIntelligence({ progress, onComplete }) {
  const { camera } = useThree()
  const nodesRef = useRef()
  const linesRef = useRef()
  const groupRef = useRef()
  const pulseRef = useRef()

  const { nodePositions, nodeColors, linePositions } = useMemo(() => {
    const nPos = new Float32Array(NODE_COUNT * 3)
    const nCol = new Float32Array(NODE_COUNT * 3)
    const lPos = new Float32Array(NODE_COUNT * NODE_COUNT * 6)

    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1 + Math.random() * 3
      nPos[i3] = r * Math.sin(phi) * Math.cos(theta)
      nPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      nPos[i3 + 2] = r * Math.cos(phi)

      const brightness = 0.4 + Math.random() * 0.6
      nCol[i3] = 0.024 * brightness
      nCol[i3 + 1] = 0.714 * brightness
      nCol[i3 + 2] = 0.831 * brightness
    }
    return { nodePositions: nPos, nodeColors: nCol, linePositions: lPos }
  }, [])

  useEffect(() => {
    if (progress >= 1) onComplete?.()
  }, [progress, onComplete])

  useFrame((state) => {
    if (!nodesRef.current || !groupRef.current) return
    const t = state.clock.getElapsedTime()
    const activate = Math.min(progress * 2, 1)
    const posAttr = nodesRef.current.geometry.attributes.position

    groupRef.current.rotation.y = t * 0.08 * activate

    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3
      posAttr.array[i3 + 1] += Math.sin(t * 0.4 + i * 0.25) * 0.001 * activate
    }
    posAttr.needsUpdate = true

    if (linesRef.current && activate > 0.2) {
      const lineAttr = linesRef.current.geometry.attributes.position
      let idx = 0
      for (let i = 0; i < NODE_COUNT && idx < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT && idx < NODE_COUNT; j++) {
          const i3 = i * 3, j3 = j * 3
          const dx = posAttr.array[i3] - posAttr.array[j3]
          const dy = posAttr.array[i3 + 1] - posAttr.array[j3 + 1]
          const dz = posAttr.array[i3 + 2] - posAttr.array[j3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < CONNECTION_DIST) {
            lineAttr.array[idx * 6] = posAttr.array[i3]
            lineAttr.array[idx * 6 + 1] = posAttr.array[i3 + 1]
            lineAttr.array[idx * 6 + 2] = posAttr.array[i3 + 2]
            lineAttr.array[idx * 6 + 3] = posAttr.array[j3]
            lineAttr.array[idx * 6 + 4] = posAttr.array[j3 + 1]
            lineAttr.array[idx * 6 + 5] = posAttr.array[j3 + 2]
            idx++
          }
        }
      }
      lineAttr.needsUpdate = true
      linesRef.current.geometry.setDrawRange(0, idx * 2)
    }

    const camDist = 6 - progress * 3
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camDist, 0.015)
    camera.position.x = Math.sin(t * 0.15) * 0.8 * activate
    camera.position.y = 0.3 + Math.sin(t * 0.1) * 0.2
    camera.lookAt(0, 0, 0)

    if (pulseRef.current) {
      const pulseScale = 1 + Math.sin(t * 3) * 0.3 * activate
      pulseRef.current.scale.setScalar(pulseScale)
      pulseRef.current.material.opacity = activate * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={nodePositions} count={NODE_COUNT} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={nodeColors} count={NODE_COUNT} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          transparent
          opacity={Math.min(progress * 2, 0.9)}
          vertexColors
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={linePositions} count={NODE_COUNT * 2} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#06b6d4"
          transparent
          opacity={Math.min(progress * 1.5, 0.35)}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Central glow sphere */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight color="#06b6d4" intensity={2} distance={10} decay={2} />
      <pointLight color="#8b5cf6" intensity={1} distance={8} decay={2} position={[3, 3, -2]} />
      <pointLight color="#4ade80" intensity={0.5} distance={6} decay={2} position={[-2, -2, 3]} />
    </group>
  )
}

export default memo(SceneIntelligence)
