import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function SmoothCamera({ isMobile }) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 2, z: 10 })
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0))

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (isMobile) {
      const driftX = Math.sin(time * 0.1) * 0.2
      const driftY = 2 + Math.sin(time * 0.08) * 0.15
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, driftX, Math.min(delta * 0.5, 0.1))
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, driftY, Math.min(delta * 0.5, 0.1))
      camera.position.z = 10
    } else {
      const parallaxX = mouse.current.x * 0.4
      const parallaxY = 2 + mouse.current.y * 0.25
      const driftX = Math.sin(time * 0.08) * 0.1
      const driftY = Math.cos(time * 0.06) * 0.08

      target.current.x = parallaxX + driftX
      target.current.y = parallaxY + driftY

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.current.x, Math.min(delta * 1.5, 0.1))
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, target.current.y, Math.min(delta * 1.5, 0.1))
      camera.position.z = 10
    }

    const lookAtTarget = new THREE.Vector3(
      camera.position.x * 0.1,
      1 + camera.position.y * 0.05,
      0
    )
    currentLookAt.current.lerp(lookAtTarget, Math.min(delta * 2, 0.1))
    camera.lookAt(currentLookAt.current)
  })

  return null
}
