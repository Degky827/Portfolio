import { useRef, useMemo, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 200, color = '#06b6d4', size = 0.02, speed = 0.3 }) {
  const mesh = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 20
    return pos
  }, [count])

  const sizes = useMemo(() => {
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) s[i] = Math.random() * size + size * 0.5
    return s
  }, [count, size])

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime()
    const posAttr = mesh.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      posAttr.array[i3 + 1] += Math.sin(t * speed + i * 0.1) * 0.001
      posAttr.array[i3] += Math.cos(t * speed * 0.5 + i * 0.05) * 0.0005
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-size" array={sizes} count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function ParticleField({ count = 200, color = '#06b6d4', className = '' }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles count={count} color={color} />
      </Canvas>
    </div>
  )
}

export default memo(ParticleField)
