import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * HeroAnimation
 *
 * Controls camera movement based on scroll and mouse input.
 * Provides smooth transitions and parallax effects.
 */

export default function HeroAnimation({ sectionProgress = 0, mouseRef }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 0, 5))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const mx = mouseRef?.current?.x || 0
    const my = mouseRef?.current?.y || 0

    // Camera moves forward as user scrolls
    const scrollZ = 5 - sectionProgress * 3
    const scrollY = -sectionProgress * 1.5

    // Mouse parallax
    const mouseX = mx * 0.3
    const mouseY = my * 0.2

    targetPos.current.set(
      mouseX,
      scrollY + mouseY,
      scrollZ
    )

    targetLookAt.current.set(
      mouseX * 0.3,
      scrollY * 0.5 + mouseY * 0.3,
      -5
    )

    camera.position.lerp(targetPos.current, 0.04)
    const currentLookAt = new THREE.Vector3()
    camera.getWorldDirection(currentLookAt)
    camera.lookAt(targetLookAt.current)
  })

  return null
}

/**
 * useMousePosition
 *
 * Tracks normalized mouse position (-1 to 1) for parallax.
 * Returns a ref for zero-rerender performance.
 */
export function useMousePosition() {
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return mouseRef
}
