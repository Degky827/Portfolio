import { useState, useCallback, useRef } from 'react'
import { sendChatMessage } from '../services/chat.api'

export default function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage = { id: Date.now().toString(), role: 'user', content: trimmed }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await sendChatMessage(trimmed)

      if (response.success && response.answer) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.answer,
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        setError(response.message || 'Failed to get response')
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, clearMessages }
}
