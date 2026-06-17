import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Trash2 } from 'lucide-react'
import useChat from '../hooks/useChat'
import Message from './Message'
import TypingIndicator from './TypingIndicator'

export default function ChatWindow({ isOpen, onClose }) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()
  const [input, setInput] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-24 right-4 sm:right-6 z-[999] w-[calc(100%-32px)] sm:w-96 h-[520px] sm:h-[560px] flex flex-col rounded-2xl overflow-hidden shadow-glass dark:shadow-glass-dark border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles size={15} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  AI Assistant
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Ask me about Desalegn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  aria-label="Clear chat"
                >
                  <Trash2 size={15} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-thin"
          >
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles size={28} className="text-primary" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Hi, I'm Desalegn's AI Assistant
                </h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  Ask me about his skills, projects, experience, education, or anything in his portfolio.
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {[
                    'What skills does he have?',
                    'List his projects',
                    'What is his experience?',
                    'His education?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        sendMessage(q)
                      }}
                      className="px-3 py-1.5 text-[11px] font-semibold rounded-full border border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}

            {isLoading && <TypingIndicator />}

            {error && !isLoading && (
              <div className="px-4 py-2">
                <div className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-2.5 pr-2 text-sm rounded-xl bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                style={{ minHeight: 40, maxHeight: 120 }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
