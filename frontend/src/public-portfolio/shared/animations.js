/**
 * Shared Framer Motion animation variants for staggered card reveals.
 * 
 * Cards alternate left/right entrance with 0.1-0.2s stagger.
 * All animations use GPU-accelerated transform/opacity only.
 * All animations trigger once on viewport entry.
 */

// Base timing constants
const STAGGER_DELAY = 0.15
const SPRING_TRANSITION = { type: 'spring', stiffness: 100, damping: 15 }
const TWEEN_TRANSITION = { type: 'tween', duration: 0.5 }

/**
 * Container variants for staggering children
 */
export const createContainerVariants = (shouldReduceMotion = false, stagger = STAGGER_DELAY) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: shouldReduceMotion ? 0 : stagger,
    },
  },
})

/**
 * Left-Right alternating card variants
 * Cards slide in from left on even indices, right on odd indices
 */
export const createAlternatingCardVariants = (shouldReduceMotion = false) => ({
  hidden: (index) => ({
    opacity: 0,
    x: shouldReduceMotion ? 0 : (index % 2 === 0 ? -60 : 60),
    y: 0,
  }),
  visible: (index) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      ...SPRING_TRANSITION,
      delay: shouldReduceMotion ? 0 : index * STAGGER_DELAY,
    },
  }),
})

/**
 * Simple bottom-up card variants (for sections that need uniform entrance)
 */
export const createBottomUpCardVariants = (shouldReduceMotion = false) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_TRANSITION,
  },
})

/**
 * Section header variants
 */
export const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/**
 * Viewport config for triggering animations once
 */
export const defaultViewport = { once: true, amount: 0.2 }

/**
 * Helper to create alternating card variants for specific sections
 * Returns variants object compatible with motion.div
 */
export const getAlternatingVariants = (index, shouldReduceMotion = false) => ({
  hidden: {
    opacity: 0,
    x: shouldReduceMotion ? 0 : (index % 2 === 0 ? -60 : 60),
    y: 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: SPRING_TRANSITION,
  },
})
