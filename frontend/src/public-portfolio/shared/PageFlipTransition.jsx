import { useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export default function PageFlipTransition() {
  const location = useLocation()
  const prefersReduced = useReducedMotion()

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-full relative"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
