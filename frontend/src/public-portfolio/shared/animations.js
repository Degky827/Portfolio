/**
 * Shared Framer Motion animation variants for premium section reveals.
 *
 * All animations use GPU-accelerated transform/opacity only.
 * All animations trigger once on viewport entry.
 * Supports reduced motion preferences.
 */

// Base timing constants
const STAGGER_DELAY = 0.12
const SPRING_TRANSITION = { type: 'spring', stiffness: 120, damping: 20 }
const PREMIUM_EASE = [0.16, 1, 0.3, 1]

/**
 * Premium section entrance — opacity + translateY + scale + subtle rotation
 */
export const sectionEntrance = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.98,
    rotateX: 2,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: PREMIUM_EASE,
    },
  },
}

/**
 * Section header variants — heading + description stagger
 */
export const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: PREMIUM_EASE },
  },
}

/**
 * Section description — slightly delayed fade up
 */
export const sectionDescriptionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1, ease: PREMIUM_EASE },
  },
}

/**
 * Container variants for staggering children
 */
export const createContainerVariants = (shouldReduceMotion = false, stagger = STAGGER_DELAY) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: shouldReduceMotion ? 0 : stagger,
      delayChildren: shouldReduceMotion ? 0 : 0.1,
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
    x: shouldReduceMotion ? 0 : (index % 2 === 0 ? -50 : 50),
    y: 0,
    scale: 0.97,
  }),
  visible: (index) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 18,
      delay: shouldReduceMotion ? 0 : index * STAGGER_DELAY,
    },
  }),
})

/**
 * Simple bottom-up card variants (for uniform entrance)
 */
export const createBottomUpCardVariants = (shouldReduceMotion = false) => ({
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
    },
  },
})

/**
 * Fade up — for text elements
 */
export const createFadeUpVariants = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: PREMIUM_EASE },
})

/**
 * Fade in — for opacity-only transitions
 */
export const createFadeInVariants = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, delay },
})

/**
 * Viewport config for triggering animations once
 */
export const defaultViewport = { once: true, amount: 0.15 }

/**
 * Helper to create alternating card variants for specific sections
 */
export const getAlternatingVariants = (index, shouldReduceMotion = false) => ({
  hidden: {
    opacity: 0,
    x: shouldReduceMotion ? 0 : (index % 2 === 0 ? -50 : 50),
    y: 0,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 18,
    },
  },
})

/**
 * Hero-specific animations — stronger entrance with depth
 */
export const heroEntrance = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay,
      ease: PREMIUM_EASE,
    },
  }),
}
