import { useRef, useMemo, useEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SceneBeginning({ progress, onComplete }) {
  const pointsRef = useRef()
  const materialRef = useRef()
  const glowRef = useRef()
  const ringRef = useRef()

  const positions = useMemo(() => new Float32Array([0, 0, 0]), [])
  const sizes = useMemo(() => new Float32Array([0]), [])

  useEffect(() => {
    if (progress >= 1) onComplete?.()
  }, [progress, onComplete])

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return
    const t = state.clock.getElapsedTime()

    const appear = Math.min(progress * 2.5, 1)
    const pulse = 1 + Math.sin(t * 6) * 0.4 * appear

    sizes[0] = appear * 0.12 * pulse
    pointsRef.current.geometry.attributes.size.needsUpdate = true
    materialRef.current.size = 0.12 * pulse * appear
    materialRef.current.opacity = appear * 0.95

    pointsRef.current.position.y = Math.sin(t * 0.8) * 0.05 * appear

    if (glowRef.current) {
      glowRef.current.scale.setScalar(appear * pulse * 1.5)
      glowRef.current.material.opacity = appear * 0.15 * pulse
    }

    if (ringRef.current) {
      const ringAppear = Math.min(Math.max(progress * 3 - 0.5, 0), 1)
      ringRef.current.rotation.z = t * 0.5
      ringRef.current.scale.setScalar(ringAppear * pulse * 0.8)
      ringRef.current.material.opacity = ringAppear * 0.2
    }
  })

  return (
    <group>
      {/* The single particle - an idea born */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={1} itemSize={3} />
          <bufferAttribute attach="attributes-size" array={sizes} count={1} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          color="#06b6d4"
          size={0}
          transparent
          opacity={0}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glow halo around particle */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Energy ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.3, 0.32, 64]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Point light from particle */}
      <pointLight color="#06b6d4" intensity={progress * 3} distance={8} decay={2} />
      <pointLight color="#8b5cf6" intensity={progress * 0.5} distance={5} decay={2} position={[1, 0.5, -1]} />
    </group>
  )
}

export default memo(SceneBeginning)
