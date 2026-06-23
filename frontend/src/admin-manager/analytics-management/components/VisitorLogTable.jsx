import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Monitor, Search, Server, Link, Clock, ChevronDown, ChevronRight } from 'lucide-react'

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent`

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-slate-800/60">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className={`h-4 rounded ${shimmer} bg-gray-100 dark:bg-slate-800`} style={{ width: `${[30, 25, 20, 20, 25, 28][i]}%` }} />
        </td>
      ))}
    </tr>
  )
}

const cellClass = 'px-4 py-3 text-sm whitespace-nowrap'

export default function VisitorLogTable({ visits, loading, totalCount }) {
  const [expandedRow, setExpandedRow] = useState(null)

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Visitor Log</h2>
          <span className="text-xs text-gray-400">Loading...</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-800/20">
                {['IP Address', 'Country', 'Device', 'Browser', 'Source', 'Timestamp'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (!visits || visits.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Visitor Log</h2>
          <span className="text-xs text-gray-400">0 visits</span>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No results found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            No visitor records match your current filters. Try adjusting or clearing the filters above.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Visitor Log</h2>
        <span className="text-xs text-gray-400">
          {(totalCount || 0).toLocaleString()} total {(totalCount || 0) === 1 ? 'visit' : 'visits'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-800/20">
                {[
                  { label: 'IP Address', icon: Server },
                  { label: 'Country', icon: Globe },
                  { label: 'Device', icon: Monitor },
                  { label: 'Browser', icon: Monitor },
                  { label: 'Source', icon: Link },
                  { label: 'Pages', icon: ChevronRight },
                  { label: 'Timestamp', icon: Clock },
                ].map(({ label, icon: Icon }) => (
                  <th key={label} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Icon size={11} className="text-gray-400" />
                      {label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visits.map((visit, i) => {
                const pagesViewed = visit.pagesViewed || []
                const isExpanded = expandedRow === visit._id
                return (
                  <>
                    <motion.tr
                      key={visit._id || i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.25 }}
                      className="border-b border-gray-100 dark:border-slate-800/60 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className={cellClass}>
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                          {visit.ipAddress || '—'}
                        </span>
                      </td>
                      <td className={cellClass}>
                        <span className="text-gray-700 dark:text-gray-300">
                          {visit.location?.country || visit.location?.city || '—'}
                        </span>
                      </td>
                      <td className={cellClass}>
                        <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                          <Monitor size={13} className="text-gray-400" />
                          {(visit.deviceInfo?.deviceType || 'Desktop').charAt(0).toUpperCase() + (visit.deviceInfo?.deviceType || 'Desktop').slice(1)}
                        </span>
                      </td>
                      <td className={cellClass}>
                        <span className="text-gray-600 dark:text-gray-400">
                          {visit.deviceInfo?.browser || '—'}
                        </span>
                      </td>
                      <td className={cellClass}>
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          visit.referrer === 'Direct Link / Bookmarks'
                            ? 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                        }`}>
                          {visit.referrer || 'Direct Link / Bookmarks'}
                        </span>
                      </td>
                      <td className={cellClass}>
                        {pagesViewed.length > 0 ? (
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : visit._id)}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                          >
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            {pagesViewed.length} page{pagesViewed.length !== 1 ? 's' : ''}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className={cellClass}>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {new Date(visit.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                    {isExpanded && pagesViewed.length > 0 && (
                      <tr className="bg-gray-50/50 dark:bg-slate-800/20">
                        <td colSpan={7} className="px-6 py-3">
                          <div className="flex flex-wrap gap-2">
                            {pagesViewed.map((page, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                                {page}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
      </div>
    </div>
  )
}
