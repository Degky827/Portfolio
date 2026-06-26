import { useRef, useCallback, useState, memo, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'
import MonitorFrame from './MonitorFrame'
import MonitorScreen from './MonitorScreen'
import ScreenEffects from './ScreenEffects'
import CodeEditor from './CodeEditor'

/**
 * DeveloperWorkstation
 *
 * Premium futuristic developer workstation with interactive 3D rotation.
 * Can show front, face, and side views like a desktop object.
 *
 * Features:
 * - Interactive 3D rotation (drag or buttons)
 * - Preset views: Front, Face, Side
 * - Subtle floating animation (1-2px, slow)
 * - Mouse-reactive rotation when in default mode
 * - Layered shadows
 * - GPU-accelerated transforms
 */

// Preset view angles (rotateX, rotateY, rotateZ)
const VIEWS = {
  front: { rotateX: 0, rotateY: 0, rotateZ: 0, label: 'Front' },
  face: { rotateX: -15, rotateY: 5, rotateZ: 0, label: 'Face' },
  side: { rotateX: -5, rotateY: 35, rotateZ: 2, label: 'Side' },
}

const VIEW_KEYS = ['front', 'face', 'side']

const DeveloperWorkstation = memo(function DeveloperWorkstation({
  fullName,
  roleTitle,
  locationText,
  skills,
  available,
}) {
  const containerRef = useRef(null)
  const [activeView, setActiveView] = useState('front')
  const [isDragging, setIsDragging] = useState(false)

  // Base rotation values (controlled by buttons or dragging)
  const baseRotateX = useMotionValue(VIEWS.front.rotateX)
  const baseRotateY = useMotionValue(VIEWS.front.rotateY)
  const baseRotateZ = useMotionValue(VIEWS.front.rotateZ)

  // Smooth springs for base rotation
  const smoothRotateX = useSpring(baseRotateX, { stiffness: 80, damping: 15 })
  const smoothRotateY = useSpring(baseRotateY, { stiffness: 80, damping: 15 })
  const smoothRotateZ = useSpring(baseRotateZ, { stiffness: 80, damping: 15 })

  // Mouse-tracking for subtle 3D rotation (only when in 'front' view and not dragging)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const mouseRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [3, -3]), {
    stiffness: 100,
    damping: 18,
  })
  const mouseRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-2, 2]), {
    stiffness: 100,
    damping: 18,
  })

  // Combined rotations (base + mouse)
  const combinedRotateX = useTransform([smoothRotateX, mouseRotateX], ([base, mouse]) => {
    return activeView === 'front' && !isDragging ? base + mouse : base
  })
  const combinedRotateY = useTransform([smoothRotateY, mouseRotateY], ([base, mouse]) => {
    return activeView === 'front' && !isDragging ? base + mouse : base
  })

  // Handle mouse movement for subtle rotation
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || isDragging) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY, isDragging])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Switch to a preset view
  const switchView = useCallback((viewKey) => {
    const view = VIEWS[viewKey]
    if (!view) return
    setActiveView(viewKey)
    animate(baseRotateX, view.rotateX, { duration: 0.8, ease: [0.16, 1, 0.3, 1] })
    animate(baseRotateY, view.rotateY, { duration: 0.8, ease: [0.16, 1, 0.3, 1] })
    animate(baseRotateZ, view.rotateZ, { duration: 0.8, ease: [0.16, 1, 0.3, 1] })
  }, [baseRotateX, baseRotateY, baseRotateZ])

  // Drag-to-rotate functionality
  const handlePointerDown = useCallback((e) => {
    if (activeView !== 'front') return
    setIsDragging(true)
    e.target.setPointerCapture(e.pointerId)
  }, [activeView])

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    // Scale the drag movement (max ~30° rotation)
    const newY = x * 60
    const newX = -y * 30

    baseRotateY.set(newY)
    baseRotateX.set(newX)
  }, [isDragging, baseRotateX, baseRotateY])

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    // Snap back to front view
    switchView('front')
  }, [isDragging, switchView])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mouseX.destroy()
      mouseY.destroy()
      baseRotateX.destroy()
      baseRotateY.destroy()
      baseRotateZ.destroy()
    }
  }, [])

  return (
    <div className="relative">
      {/* ── View Controls ── */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-5">
        {VIEW_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => switchView(key)}
            className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 outline-none focus:ring-2 focus:ring-purple-500/50"
            style={{
              color: activeView === key ? '#f8fafc' : '#94a3b8',
              background: activeView === key
                ? 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.15))'
                : 'rgba(30,30,50,0.5)',
              border: `1px solid ${activeView === key ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.1)'}`,
              boxShadow: activeView === key
                ? '0 0 12px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                : 'none',
            }}
          >
            {VIEWS[key].label}
            {activeView === key && (
              <motion.div
                layoutId="activeViewIndicator"
                className="absolute inset-0 rounded-full border border-purple-500/30"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}

        {/* Drag hint */}
        <div className="hidden sm:flex items-center gap-1.5 ml-2 text-[9px] text-slate-500 uppercase tracking-wider">
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm-.5 3.5a.5.5 0 00-1 0v4.793L5.354 6.146a.5.5 0 10-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 00-.708-.708L8.5 8.293V3.5z" />
          </svg>
          <span>Drag to rotate</span>
        </div>
      </div>

      {/* ── Monitor with 3D Rotation ── */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
        style={{
          rotateX: combinedRotateX,
          rotateY: combinedRotateY,
          rotateZ: smoothRotateZ,
          transformStyle: 'preserve-3d',
          perspective: '1200px',
          cursor: isDragging ? 'grabbing' : activeView === 'front' ? 'grab' : 'default',
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
