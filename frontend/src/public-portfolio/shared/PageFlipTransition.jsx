import { useRef, useMemo } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const PAGE_ORDER = {
  '/': 0,
  '/home': 0,
  '/about': 1,
  '/skills': 2,
  '/experience': 3,
  '/projects': 4,
  '/contact': 5,
  '/cv': 6,
}

function getPageIndex(pathname) {
  const clean = pathname.replace(/\/$/, '') || '/'
  return PAGE_ORDER[clean] ?? 99
}

export default function PageFlipTransition() {
  const location = useLocation()
  const prefersReduced = useReducedMotion()
  const prevPathRef = useRef(location.pathname)

  const prevIdx = getPageIndex(prevPathRef.current)
  const nextIdx = getPageIndex(location.pathname)
  const direction = nextIdx >= prevIdx ? 1 : -1
  prevPathRef.current = location.pathname

  const flipVariants = useMemo(() => {
    if (prefersReduced) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    }

    return {
      initial: (dir) => ({
        opacity: 0,
        rotateY: dir > 0 ? 30 : -30,
        y: 10,
        scale: 0.98,
      }),
      animate: {
        opacity: 1,
        rotateY: 0,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        },
      },
      exit: (dir) => ({
        opacity: 0,
        rotateY: dir > 0 ? -30 : 30,
        y: -10,
        scale: 0.98,
        transition: {
          duration: 0.3,
          ease: [0.32, 0, 0.67, 0],
        },
      }),
    }
  }, [prefersReduced])

  return (
    <div className="relative w-full" style={{ perspective: '1200px' }}>
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={flipVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full relative"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity',
          }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
