import { useRef, useCallback, useState, memo, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import MonitorFrame from './MonitorFrame'
import MonitorScreen from './MonitorScreen'
import ScreenEffects from './ScreenEffects'
import CodeEditor from './CodeEditor'

/**
 * DeveloperWorkstation
 *
 * Premium futuristic developer workstation with true drag-to-rotate.
 * Click and drag anywhere on the monitor to rotate it freely in 3D.
 *
 * Features:
 * - True drag-to-rotate (click + move = rotate)
 * - Smooth spring physics
 * - Returns to center when released
 * - Subtle floating animation
 * - Layered shadows
 * - GPU-accelerated transforms
 */

const DeveloperWorkstation = memo(function DeveloperWorkstation({
  fullName,
  roleTitle,
  locationText,
  skills,
  available,
}) {
  const containerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, rotateX: 0, rotateY: 0 })

  // Rotation values
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  // Smooth springs for rotation
  const smoothRotateX = useSpring(rotateX, { stiffness: 60, damping: 12 })
  const smoothRotateY = useSpring(rotateY, { stiffness: 60, damping: 12 })

  // Handle pointer down - start dragging
  const handlePointerDown = useCallback((e) => {
    if (!containerRef.current) return
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotateX: rotateX.get(),
      rotateY: rotateY.get(),
    }
    containerRef.current.setPointerCapture(e.pointerId)
  }, [rotateX, rotateY])

  // Handle pointer move - rotate based on drag distance
  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStartRef.current.x
    const deltaY = e.clientY - dragStartRef.current.y

    // Scale factors for rotation (degrees per pixel)
    const scaleX = 0.3 // horizontal mouse = Y rotation
    const scaleY = 0.2 // vertical mouse = X rotation

    const newRotateY = dragStartRef.current.rotateY + deltaX * scaleX
    const newRotateX = dragStartRef.current.rotateX - deltaY * scaleY

    // Clamp X rotation to prevent flipping
    const clampedX = Math.max(-45, Math.min(45, newRotateX))

    rotateY.set(newRotateY)
    rotateX.set(clampedX)
  }, [isDragging, rotateX, rotateY])

  // Handle pointer up - stop dragging, spring back to center
  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    // Spring back to center position
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      rotateX.destroy()
      rotateY.destroy()
    }
  }, [])

  return (
    <div className="relative">
      {/* ── Monitor with 3D Rotation ── */}
      <motion.div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: 'preserve-3d',
          perspective: '1200px',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none', // Prevent scroll on touch devices
          userSelect: 'none', // Prevent text selection while dragging
        }}
      >
        {/* Floating animation wrapper */}
        <motion.div
          animate={{
            y: [0, -2, 0, -1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Layered shadow */}
          <div className="relative">
            {/* Background shadow (soft, distant) */}
            <div
              className="absolute -inset-[20px] rounded-[24px] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)',
                filter: 'blur(20px)',
                opacity: isDragging ? 0.4 : 0.3,
                transition: 'opacity 0.3s ease',
              }}
              aria-hidden="true"
            />

            {/* Mid shadow */}
            <div
              className="absolute -inset-[10px] rounded-[20px] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center bottom, rgba(0,0,0,0.2) 0%, transparent 60%)',
                filter: 'blur(12px)',
              }}
              aria-hidden="true"
            />

            {/* Contact shadow */}
            <div
              className="absolute -bottom-4 left-[10%] right-[10%] h-8 rounded-[20px] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(139,92,246,0.1), transparent 70%)',
                filter: 'blur(8px)',
              }}
              aria-hidden="true"
            />

            {/* Monitor with frame, screen, and effects */}
            <div className="relative">
              <ScreenEffects />
              <MonitorFrame>
                <MonitorScreen>
                  <CodeEditor
                    fullName={fullName}
                    roleTitle={roleTitle}
                    locationText={locationText}
                    skills={skills}
                    available={available}
                  />
                </MonitorScreen>
              </MonitorFrame>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
})

export default DeveloperWorkstation
