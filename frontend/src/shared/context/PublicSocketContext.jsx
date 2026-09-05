import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { io } from 'socket.io-client'

const PublicSocketContext = createContext(null)

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin

export function PublicSocketProvider({ children }) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const listenersRef = useRef(new Map())

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', () => {})

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
      setConnected(false)
    }
  }, [])

  const on = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler)
    }
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set())
    }
    listenersRef.current.get(event).add(handler)
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, handler)
      }
      listenersRef.current.get(event)?.delete(handler)
    }
  }, [])

  const off = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler)
    }
  }, [])

  const value = useMemo(() => ({ socket: socketRef.current, connected, on, off }), [connected, on, off])

  return <PublicSocketContext.Provider value={value}>{children}</PublicSocketContext.Provider>
}

export function usePublicSocket() {
  const ctx = useContext(PublicSocketContext)
  if (!ctx) throw new Error('usePublicSocket must be used within PublicSocketProvider')
  return ctx
}
