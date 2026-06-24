import { useRef, useEffect } from 'react'

/**
 * useMousePosition — tracks normalized mouse position for 3D parallax.
 * Returns a ref that updates in real-time without rerenders.
 */
export default function useMousePosition() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return mouseRef
}
