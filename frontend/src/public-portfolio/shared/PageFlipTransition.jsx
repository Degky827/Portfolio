import { useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export default function PageFlipTransition() {
  const location = useLocation()
  const prefersReduced = useReducedMotion()

  return (
    <div className="relative w-full">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={location.pathname}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
          className="w-full relative"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
