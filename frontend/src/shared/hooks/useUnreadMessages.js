import { useState, useEffect, useCallback, useRef } from 'react'
import { getUnreadMessageCount } from '../services/contactService'
import { useSocket } from '../context/SocketContext'

export default function useUnreadMessages() {
  const [count, setCount] = useState(0)
  const { on } = useSocket()
  const countRef = useRef(count)

  const refresh = useCallback(async () => {
    try {
      const data = await getUnreadMessageCount()
      setCount(data.count || 0)
    } catch { /* noop */ }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const cleanup = on('new_contact_message', () => {
      setCount((prev) => prev + 1)
    })
    return cleanup
  }, [on])

  return { count, refresh }
}
