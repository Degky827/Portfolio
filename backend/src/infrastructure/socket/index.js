const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const config = require('../config')

let io = null

function initSocket(server) {
  const allowedOrigins = [
    ...config.corsOrigins,
    config.frontendUrl,
  ].filter(Boolean)

  io = new Server(server, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          console.warn(`[socket:cors] Blocked origin: ${origin}`)
          callback(null, false)
        }
      },
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token
    if (!token) {
      return next(new Error('Authentication required'))
    }
    try {
      const decoded = jwt.verify(token, config.jwtSecret)
      socket.adminUser = { id: decoded.id, email: decoded.email, role: decoded.role }
      next()
    } catch {
      next(new Error('Invalid or expired token'))
    }
  })

  io.on('connection', (socket) => {
    socket.join('admin')

    socket.on('disconnect', () => {
    })
  })

  return io
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}

function emitToAdmin(event, data) {
  if (!io) return
  io.to('admin').emit(event, data)
}

module.exports = { initSocket, getIO, emitToAdmin }
