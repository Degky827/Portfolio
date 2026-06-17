import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

export default function AIButton({ isOpen, onClick }) {
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[999]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={onClick}
            className="relative w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:bg-secondary transition-all flex items-center justify-center group"
            aria-label="Open AI chat"
          >
            <MessageCircle size={24} />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={onClick}
          className="w-14 h-14 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 shadow-lg hover:bg-gray-300 dark:hover:bg-neutral-700 transition-all flex items-center justify-center"
          aria-label="Close AI chat"
        >
          <X size={24} />
        </motion.button>
      )}
    </div>
  )
}
