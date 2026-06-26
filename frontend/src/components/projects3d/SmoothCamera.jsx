import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function SmoothCamera({ isMobile }) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 2, z: 10 })
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0))

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (isMobile) {
      const driftX = Math.sin(time * 0.1) * 0.3
      const driftY = 2 + Math.sin(time * 0.08) * 0.2
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, driftX, delta * 0.5)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, driftY, delta * 0.5)
      camera.position.z = 10
    } else {
      const parallaxX = mouse.current.x * 0.6
      const parallaxY = 2 + mouse.current.y * 0.4
      const driftX = Math.sin(time * 0.08) * 0.15
      const driftY = Math.cos(time * 0.06) * 0.1

      target.current.x = parallaxX + driftX
      target.current.y = parallaxY + driftY

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.current.x, delta * 1.8)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, target.current.y, delta * 1.8)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 10, delta * 1.5)
    }

    const lookAtTarget = new THREE.Vector3(
      camera.position.x * 0.15,
      1 + camera.position.y * 0.08,
      0
    )
    currentLookAt.current.lerp(lookAtTarget, delta * 2)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
