import { motion } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'

export default function ScrollProgressBar() {
  const scrollProgress = useScrollProgress()

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-primary z-[9999] transition-all duration-100"
      style={{ width: `${scrollProgress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  )
}
