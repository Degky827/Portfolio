import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, MessageSquare, Inbox, Trash2, RefreshCw,
  ChevronLeft, CheckCheck, Eye, X,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ConfirmModal from '../shared/ConfirmModal'
import Toast from '../shared/Toast'
import {
  listMessages, markMessageRead, markMessageUnread, deleteMessage,
} from '../../shared/services/contactService'
import { useSocket } from '../../shared/context/SocketContext'

export default function ContactInbox() {
  const [messages, setMessages] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [readFilter, setReadFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { on } = useSocket()
  const fetchRef = useRef(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit }
      if (readFilter) params.read = readFilter
      const data = await listMessages(params)
      setMessages(data.messages || [])
      setTotalCount(data.totalCount || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch {
      setToast({ message: 'Failed to load messages', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [page, limit, readFilter])

  useEffect(() => { fetchRef.current = fetch })
  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    const cleanup = on('new_contact_message', () => {
      if (page === 1 && !readFilter) {
        fetchRef.current?.()
      }
    })
    return cleanup
  }, [on, page, readFilter])

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id)
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m))
      if (selected?._id === id) setSelected((prev) => ({ ...prev, read: true }))
    } catch { /* noop */ }
  }

  const handleMarkUnread = async (id) => {
    try {
      await markMessageUnread(id)
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: false } : m))
      if (selected?._id === id) setSelected((prev) => ({ ...prev, read: false }))
    } catch { /* noop */ }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMessage(deleteTarget._id)
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id))
      if (selected?._id === deleteTarget._id) setSelected(null)
      setDeleteTarget(null)
      setTotalCount((prev) => prev - 1)
      setToast({ message: 'Message deleted', type: 'success' })
    } catch {
      setToast({ message: 'Failed to delete message', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div>
      <PageHeader
        title="Contact Inbox"
        subtitle={`${totalCount} message${totalCount !== 1 ? 's' : ''}${unreadCount ? ` · ${unreadCount} unread` : ''}`}
        actions={
          selected ? (
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-colors"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          ) : (
            <button
              onClick={fetch}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          )
        }
      />

      {/* Filters — hidden when viewing a single message */}
      {!selected && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 mb-6">
          <div className="flex gap-2">
            <select
              value={readFilter}
              onChange={(e) => { setReadFilter(e.target.value); setPage(1) }}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Messages</option>
              <option value="false">Unread Only</option>
              <option value="true">Read Only</option>
            </select>
          </div>
        </div>
      )}

      {/* List / Detail */}
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <a href={`mailto:${selected.email}`} className="hover:text-primary transition-colors">{selected.email}</a>
                    {selected.phone && <span>· {selected.phone}</span>}
                  </div>
                  {selected.subject && (
                    <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="text-gray-400">Subject:</span> {selected.subject}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!selected.read ? (
                    <button
                      onClick={() => handleMarkRead(selected._id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkUnread(selected._id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
                      title="Mark as unread"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(selected)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-[11px] text-gray-400">{new Date(selected.createdAt).toLocaleString()}</span>
                {!selected.read && (
                  <span className="ml-3 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                    New
                  </span>
                )}
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Inbox size={48} className="text-gray-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Inbox Empty</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {readFilter === 'false' ? 'No unread messages' : 'No messages yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {messages.map((msg) => (
                    <motion.button
                      key={msg._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelected(msg)}
                      className={`w-full flex items-start gap-4 px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${!msg.read ? 'bg-primary/[0.02] dark:bg-primary/[0.05]' : ''}`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {msg.read ? (
                          <Mail size={18} className="text-gray-400" />
                        ) : (
                          <div className="relative">
                            <Mail size={18} className="text-primary" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white dark:border-slate-900" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm ${!msg.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                            {msg.name}
                          </span>
                          <span className="text-[11px] text-gray-400 ml-auto shrink-0">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                          {msg.subject && <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{msg.subject}</p>}
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{msg.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-400">{msg.email}</span>
                          {msg.phone && <span className="text-[11px] text-gray-400">· {msg.phone}</span>}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  Showing {Math.min((page - 1) * limit + 1, totalCount)}-{Math.min(page * limit, totalCount)} of {totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 text-sm font-medium transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <span key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            p === page ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 text-sm font-medium transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Message"
        message={`Delete message from "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
