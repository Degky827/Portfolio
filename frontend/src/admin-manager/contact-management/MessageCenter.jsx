import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Mail, MessageSquare, Inbox, Trash2, RefreshCw,
  ChevronLeft, ChevronRight, CheckCheck, Eye, X,
  Search, Clock, Phone, Mail as MailIcon, Reply,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ConfirmModal from '../shared/ConfirmModal'
import Toast from '../shared/Toast'
import {
  listMessages, markMessageRead, markMessageUnread, deleteMessage,
} from '../../shared/services/contactService'
import { useSocket } from '../../shared/context/SocketContext'

const ITEMS_PER_PAGE = 25

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / 86400000)

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function formatFullDate(dateString) {
  return new Date(dateString).toLocaleString([], {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function getInitials(name) {
  return (name || '?').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
}

function statusVariant(message) {
  if (!message) return 'bg-gray-100 dark:bg-slate-800'
  return message.read
    ? 'bg-gray-50 dark:bg-slate-800/50'
    : 'bg-indigo-50/50 dark:bg-indigo-500/[0.04]'
}

export default function MessageCenter() {
  const [messages, setMessages] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [readFilter, setReadFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showMobileList, setShowMobileList] = useState(true)
  const { on } = useSocket()
  const fetchRef = useRef(null)
  const searchInputRef = useRef(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: ITEMS_PER_PAGE }
      if (readFilter) params.read = readFilter
      if (searchQuery.trim()) params.search = searchQuery.trim()
      const data = await listMessages(params)
      setMessages(data.messages || [])
      setTotalCount(data.totalCount || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch {
      setToast({ message: 'Failed to load messages', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [page, readFilter, searchQuery])

  useEffect(() => { fetchRef.current = fetch })
  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    const cleanup = on('new_contact_message', () => {
      if (page === 1 && !readFilter && !searchQuery) {
        fetchRef.current?.()
      }
    })
    return cleanup
  }, [on, page, readFilter, searchQuery])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    setPage(1)
    fetchRef.current?.()
  }, [fetch])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setPage(1)
  }, [])

  const handleSelect = useCallback((msg) => {
    setSelected(msg)
    setShowMobileList(false)
    if (!msg.read) {
      markMessageRead(msg._id).catch(() => {})
      setMessages((prev) => prev.map(m => m._id === msg._id ? { ...m, read: true } : m))
    }
  }, [])

  const handleBackToList = useCallback(() => {
    setShowMobileList(true)
  }, [])

  const handleMarkRead = useCallback(async (id) => {
    try {
      await markMessageRead(id)
      setMessages((prev) => prev.map(m => m._id === id ? { ...m, read: true } : m))
      if (selected?._id === id) setSelected(prev => ({ ...prev, read: true }))
    } catch { /* noop */ }
  }, [selected])

  const handleMarkUnread = useCallback(async (id) => {
    try {
      await markMessageUnread(id)
      setMessages((prev) => prev.map(m => m._id === id ? { ...m, read: false } : m))
      if (selected?._id === id) setSelected(prev => ({ ...prev, read: false }))
    } catch { /* noop */ }
  }, [selected])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMessage(deleteTarget._id)
      setMessages((prev) => prev.filter(m => m._id !== deleteTarget._id))
      if (selected?._id === deleteTarget._id) {
        setSelected(null)
        setShowMobileList(true)
      }
      setDeleteTarget(null)
      setTotalCount((prev) => prev - 1)
      setToast({ message: 'Message deleted', type: 'success' })
    } catch {
      setToast({ message: 'Failed to delete message', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }, [deleteTarget, selected])

  const handleFilterChange = useCallback((e) => {
    setReadFilter(e.target.value)
    setPage(1)
    setSelected(null)
    setShowMobileList(true)
  }, [])

  const unreadCount = useMemo(
    () => messages.filter(m => !m.read).length,
    [messages],
  )

  const listedMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages
    const q = searchQuery.toLowerCase()
    return messages.filter(m =>
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.phone?.includes(q)
    )
  }, [messages, searchQuery])

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Message Center"
        subtitle={`${totalCount} message${totalCount !== 1 ? 's' : ''}${unreadCount ? ` \u00B7 ${unreadCount} unread` : ''}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetch}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        }
      />

      {/* ============================================================ */}
      {/* DESKTOP: two-pane layout                                     */}
      {/* MOBILE:   stacked, toggled via showMobileList                */}
      {/* ============================================================ */}
      <div className="flex-1 flex gap-5 min-h-0">
        {/* ─── Message List Pane ─── */}
        <motion.div
          layout
          className={`
            w-full lg:w-[380px] lg:min-w-[380px] shrink-0
            ${!showMobileList ? 'hidden lg:flex' : 'flex'}
            flex-col bg-white dark:bg-[#111111] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden
          `}
        >
          {/* Search + Filter */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-800 space-y-2">
            <form onSubmit={handleSearch} className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full h-9 pl-9 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                aria-label="Search messages"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            <div className="flex items-center gap-2">
              <select
                value={readFilter}
                onChange={handleFilterChange}
                className="flex-1 h-9 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 appearance-none cursor-pointer"
              >
                <option value="">All Messages</option>
                <option value="false">Unread</option>
                <option value="true">Read</option>
              </select>
            </div>
          </div>

          {/* Message count indicator */}
          <div className="px-3 py-2 text-[11px] font-medium text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800/50">
            {loading ? 'Loading...' : `${listedMessages.length} message${listedMessages.length !== 1 ? 's' : ''}`}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {loading && messages.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : listedMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <Inbox size={40} className="text-gray-300 dark:text-gray-700 mb-3" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-1">
                  {searchQuery ? 'No results' : readFilter === 'false' ? 'No unread messages' : 'Inbox empty'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {searchQuery ? 'Try a different search term' : readFilter === 'false' ? 'All caught up!' : 'Messages will appear here'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {listedMessages.map((msg) => {
                  const isActive = selected?._id === msg._id
                  return (
                    <button
                      key={msg._id}
                      onClick={() => handleSelect(msg)}
                      className={`
                        w-full text-left px-3 py-3.5 transition-colors relative
                        ${statusVariant(msg)}
                        ${isActive ? 'ring-1 ring-inset ring-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-500/[0.06]' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar / Icon */}
                        <div className="shrink-0 mt-0.5 relative">
                          {msg.read ? (
                            <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-bold">
                              {getInitials(msg.name)}
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                              {getInitials(msg.name)}
                            </div>
                          )}
                          {!msg.read && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white dark:border-[#111111]" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-sm truncate ${!msg.read ? 'font-bold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                              {msg.name}
                            </span>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500 ml-auto shrink-0">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                          {msg.subject && (
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mb-0.5">{msg.subject}</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-500">
                  {Math.min((page - 1) * ITEMS_PER_PAGE + 1, totalCount)}&ndash;{Math.min(page * ITEMS_PER_PAGE, totalCount)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-2 text-gray-400 dark:text-gray-500">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ─── Detail Pane ─── */}
        <motion.div
          layout
          className={`
            flex-1 min-w-0
            ${showMobileList && selected ? 'block' : ''}
            ${!selected ? 'hidden lg:flex' : 'flex'}
            flex-col bg-white dark:bg-[#111111] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden
          `}
        >
          {selected ? (
            <MessageDetail
              message={selected}
              onBack={handleBackToList}
              onMarkRead={() => handleMarkRead(selected._id)}
              onMarkUnread={() => handleMarkUnread(selected._id)}
              onDelete={() => setDeleteTarget(selected)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-200 mb-1">No message selected</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs">
                Select a message from the left panel to view its contents
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Message"
        message={`Delete message from "${deleteTarget?.name || 'unknown'}"? This cannot be undone.`}
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

function MessageDetail({ message, onBack, onMarkRead, onMarkUnread, onDelete }) {
  return (
    <div className="flex flex-col h-full">
      {/* Detail header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Back to list"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Message Detail
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!message.read ? (
            <ActionButton
              icon={CheckCheck}
              tooltip="Mark as read"
              onClick={onMarkRead}
              className="hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
            />
          ) : (
            <ActionButton
              icon={Eye}
              tooltip="Mark as unread"
              onClick={onMarkUnread}
              className="hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
            />
          )}
          <ActionButton
            icon={Trash2}
            tooltip="Delete"
            onClick={onDelete}
            className="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          />
        </div>
      </div>

      {/* Detail body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Sender info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold shrink-0">
            {getInitials(message.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
              {message.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <a
                href={`mailto:${message.email}`}
                className="inline-flex items-center gap-1.5 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              >
                <MailIcon size={14} />
                {message.email}
              </a>
              {message.phone && (
                <a
                  href={`tel:${message.phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  <Phone size={14} />
                  {message.phone}
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {formatFullDate(message.createdAt)}
              </span>
              {!message.read && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  New
                </span>
              )}
              {message.read && message.readAt && (
                <span className="inline-flex items-center gap-1">
                  <CheckCheck size={12} />
                  Read {formatDate(message.readAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subject line */}
        {message.subject && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-gray-800">
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Subject</span>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{message.subject}</p>
          </div>
        )}

        {/* Message body */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {message.message}
          </p>
        </div>
      </div>

      {/* Detail footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 shrink-0">
        {message.email && (
          <a
            href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your Message'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Reply size={16} />
            Reply via Email
          </a>
        )}
        <a
          href={`mailto:${message.email}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
        >
          <MailIcon size={16} />
          <span className="hidden sm:inline">Open in Mail</span>
        </a>
      </div>
    </div>
  )
}

function ActionButton({ icon: Icon, tooltip, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-lg text-gray-400 transition-colors ${className}`}
    >
      <Icon size={18} />
    </button>
  )
}
