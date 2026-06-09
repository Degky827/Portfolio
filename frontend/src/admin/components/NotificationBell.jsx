import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCheck, Trash2, ExternalLink } from 'lucide-react'
import { getUnreadCount, listNotifications, markRead, markAllRead, deleteNotification } from '../../services/notificationService'

const typeIcons = {
  contact_submission: '📬',
  failed_login: '🔒',
  backup_completed: '💾',
  restore_completed: '🔄',
  system_warning: '⚠️',
}

export default function NotificationBell() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const panelRef = useRef(null)

  const fetchUnread = async () => {
    try {
      const { count } = await getUnreadCount()
      setUnread(count)
    } catch { /* noop */ }
  }

  const fetchRecent = async () => {
    setLoading(true)
    try {
      const { notifications: list } = await listNotifications({ limit: 5 })
      setNotifications(list || [])
    } catch { /* noop */ }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (open) fetchRecent()
  }, [open])

  const handleMarkRead = async (id) => {
    await markRead(id)
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n))
    fetchUnread()
  }

  const handleMarkAllRead = async () => {
    await markAllRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnread(0)
  }

  const handleDelete = async (id) => {
    await deleteNotification(id)
    setNotifications((prev) => prev.filter((n) => n._id !== id))
    fetchUnread()
  }

  return (
    <div className="relative" ref={panelRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            style={{ minWidth: 18, height: 18 }}
          >
            {unread > 9 ? '9+' : unread}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-80 z-40 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                <div className="flex gap-1">
                  {unread > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => { setOpen(false); navigate('/admin/notifications') }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    title="View all"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`flex gap-3 px-4 py-3 border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${!n.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                    >
                      <span className="text-lg shrink-0 mt-0.5">{typeIcons[n.type] || '🔔'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{n.title}</p>
                        {n.message && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>}
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        {!n.read && (
                          <button
                            onClick={() => handleMarkRead(n._id)}
                            className="p-1 rounded text-gray-400 hover:text-primary transition-colors"
                            title="Mark read"
                          >
                            <CheckCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
