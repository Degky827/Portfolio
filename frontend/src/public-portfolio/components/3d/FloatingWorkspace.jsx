import { useState, useCallback, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, MonitorDown, X } from 'lucide-react'

const HeroDesktopScene = lazy(() => import('./HeroDesktopScene'))

export default function FloatingWorkspace({ profileData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const panelRef = useRef(null)

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleMouseDown = useCallback((e) => {
    dragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...position }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [position])

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPosition({
      x: posStart.current.x + dx,
      y: posStart.current.y + dy,
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    dragging.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const widgetStyle = {
    position: 'fixed',
    bottom: position.y || 24,
    right: position.x || 24,
    zIndex: 9999,
  }

  return (
    <>
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center transition-shadow"
        title={isOpen ? 'Close 3D workspace' : 'Open 3D workspace'}
        aria-label="Toggle 3D workspace"
      >
        {isOpen ? <X size={20} /> : <Monitor size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={widgetStyle}
            className="w-[280px] h-[200px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/80 backdrop-blur-xl"
          >
            <div
              className="h-8 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing select-none"
              style={{ background: 'rgba(99,102,241,0.15)' }}
              onMouseDown={handleMouseDown}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">3D Desk</span>
              <button
                onClick={handleToggle}
                className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <MonitorDown size={12} className="text-indigo-300" />
              </button>
            </div>
            <div className="w-full h-[calc(100%-32px)]">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center" style={{ background: '#0B0D10' }}>
                  <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              }>
                <HeroDesktopScene profileData={profileData} />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}