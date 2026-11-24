import { useState, useEffect, useRef, useMemo } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// Defined page order for determining 3D rotation direction
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
  const outlet = useOutlet()
  const prefersReduced = useReducedMotion()

  // Track previous path to compute 3D turn direction
  const prevPathRef = useRef(location.pathname)
  const [direction, setDirection] = useState(1) // 1: forward (flip left), -1: backward (flip right)

  // Cache outlets by path so outgoing page stays fully rendered during 3D rotation
  const [outlets, setOutlets] = useState({ [location.pathname]: outlet })

  useEffect(() => {
    const prevIdx = getPageIndex(prevPathRef.current)
    const nextIdx = getPageIndex(location.pathname)

    if (location.pathname !== prevPathRef.current) {
      setDirection(nextIdx >= prevIdx ? 1 : -1)
      prevPathRef.current = location.pathname
    }

    setOutlets((prev) => ({
      ...prev,
      [location.pathname]: outlet,
    }))
  }, [location.pathname, outlet])

  // 3D Flip Variants (Simulating rotating the page and revealing the other from its back)
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
        rotateY: dir > 0 ? 80 : -80,
        x: dir > 0 ? '15%' : '-15%',
        z: -280,
        scale: 0.92,
        transformOrigin: dir > 0 ? 'left center' : 'right center',
        filter: 'brightness(0.7) blur(2px)',
      }),
      animate: {
        opacity: 1,
        rotateY: 0,
        x: '0%',
        z: 0,
        scale: 1,
        filter: 'brightness(1) blur(0px)',
        transition: {
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier spring
        },
      },
      exit: (dir) => ({
        opacity: 0,
        rotateY: dir > 0 ? -80 : 80,
        x: dir > 0 ? '-15%' : '15%',
        z: -280,
        scale: 0.92,
        transformOrigin: dir > 0 ? 'right center' : 'left center',
        filter: 'brightness(0.5) blur(2px)',
        transition: {
          duration: 0.65,
          ease: [0.32, 0, 0.67, 0],
        },
      }),
    }
  }, [prefersReduced])

  return (
    <div
      className="relative w-full min-h-[calc(100vh-8rem)] overflow-hidden"
      style={{
        perspective: '1800px',
        perspectiveOrigin: '50% 40%',
        transformStyle: 'preserve-3d',
      }}
    >
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
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform, opacity',
          }}
        >
          {outlets[location.pathname] || outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
