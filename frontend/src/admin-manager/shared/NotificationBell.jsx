import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, CheckCheck, Trash2, ExternalLink, Mail, Shield, Download,
  RefreshCw, AlertTriangle, Info,
} from 'lucide-react'
import { getUnreadCount, listNotifications, markRead, markAllRead, deleteNotification } from '../../shared/services/notificationService'

const typeConfig = {
  contact_submission: { icon: Mail, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  failed_login: { icon: Shield, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  backup_completed: { icon: Download, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  restore_completed: { icon: RefreshCw, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  content_updated: { icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  system_warning: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
}

export default function NotificationBell() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('all')
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
      const { notifications: list } = await listNotifications({ limit: 10 })
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

  const displayed = tab === 'unread' ? notifications.filter((n) => !n.read) : notifications

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
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
      >
        <Bell size={20} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm"
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
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleMarkAllRead}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck size={16} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setOpen(false); navigate('/admin/notifications') }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    title="View all"
                  >
                    <ExternalLink size={16} />
                  </motion.button>
                </div>
              </div>

              {notifications.length > 0 && (
                <div className="flex border-b border-gray-200 dark:border-slate-800">
                  {['all', 'unread'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 py-2 text-xs font-medium transition-colors relative ${
                        tab === t
                          ? 'text-primary'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {t === 'all' ? 'All' : `Unread${unread > 0 ? ` (${unread})` : ''}`}
                      {tab === t && (
                        <motion.div
                          layoutId="notifTab"
                          className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : displayed.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    <Bell size={24} className="mx-auto mb-2 opacity-40" />
                    {tab === 'unread' ? 'No unread notifications' : 'No notifications'}
                  </div>
                ) : (
                  displayed.map((n) => {
                    const cfg = typeConfig[n.type] || { icon: Info, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-slate-800' }
                    const Icon = cfg.icon
                    return (
                      <motion.div
                        key={n._id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 px-4 py-3 border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${
                          !n.read ? 'bg-primary/[0.03] dark:bg-primary/[0.06]' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
                          <Icon size={14} className={cfg.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm truncate ${n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-semibold'}`}>
                              {n.title}
                            </p>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                          </div>
                          {n.message && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          {!n.read && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleMarkRead(n._id)}
                              className="p-1 rounded text-gray-400 hover:text-primary transition-colors"
                              title="Mark read"
                            >
                              <CheckCheck size={14} />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(n._id)}
                            className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
