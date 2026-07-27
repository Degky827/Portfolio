import { useRef, useEffect, memo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function SceneTransition({ progress, onComplete }) {
  const { camera } = useThree()
  const lightRef = useRef()
  const flashRef = useRef()
  const initialPos = useRef(null)

  useEffect(() => {
    if (!initialPos.current) {
      initialPos.current = camera.position.clone()
    }
  }, [camera])

  useEffect(() => {
    if (progress >= 1) onComplete?.()
  }, [progress, onComplete])

  useFrame((state) => {
    if (!initialPos.current) return
    const t = state.clock.getElapsedTime()

    const moveForward = Math.min(progress * 1.8, 1)
    camera.position.z = THREE.MathUtils.lerp(
      initialPos.current.z,
      initialPos.current.z - 10,
      moveForward
    )
    camera.position.x = THREE.MathUtils.lerp(initialPos.current.x, 0, moveForward)
    camera.position.y = THREE.MathUtils.lerp(initialPos.current.y, 0.6, moveForward)
    camera.lookAt(0, 0.6, -2)

    if (lightRef.current) {
      const flash = progress > 0.6 ? (progress - 0.6) / 0.4 : 0
      lightRef.current.intensity = flash * 8
    }

    if (flashRef.current) {
      const flashOpacity = progress > 0.7 ? Math.min((progress - 0.7) / 0.15, 1) : 0
      const fadeOut = progress > 0.85 ? Math.max(1 - (progress - 0.85) / 0.15, 0) : 1
      flashRef.current.material.opacity = flashOpacity * fadeOut * 0.6
    }
  })

  return (
    <group>
      <pointLight
        ref={lightRef}
        color="#06b6d4"
        intensity={0}
        distance={25}
        decay={2}
        position={[0, 0.6, -2]}
      />

      {/* Flash overlay */}
      <mesh ref={flashRef} position={[0, 0.6, -1]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <ambientLight intensity={0.01} color="#06b6d4" />
    </group>
  )
}

export default memo(SceneTransition)
