import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../../admin-manager/authentication/AuthContext'

const SocketContext = createContext(null)

const localHosts = ['localhost', '127.0.0.1', '[::1]']
const isProduction = import.meta.env.PROD || !localHosts.includes(window.location.hostname)
const SOCKET_URL = isProduction
  ? 'https://portfolio-backend-lgvk.onrender.com'
  : import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000'

export function SocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth()
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const listenersRef = useRef(new Map())

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setConnected(false)
      }
      return
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', (err) => console.warn('[socket] Connection error:', err.message))

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
      setConnected(false)
    }
  }, [isAuthenticated, token])

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

  const value = { socket: socketRef.current, connected, on, off }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}
