import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'

export default function DataTable({
  columns, data, searchable = true, pageSize = 10, loading = false,
  selectable = false, onSelect, selectedIds = [], filters, emptyMessage = 'No data found.',
}) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})

  const filtered = useMemo(() => {
    let result = data || []
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((row) =>
        columns.some((col) => {
          const val = col.accessor ? row[col.accessor] : ''
          return String(val || '').toLowerCase().includes(q)
        }),
      )
    }
    Object.entries(activeFilters).forEach(([key, val]) => {
      if (val) result = result.filter((row) => String(row[key] || '').toLowerCase() === String(val).toLowerCase())
    })
    return result
  }, [data, search, columns, activeFilters])

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const allSelected = data && data.length > 0 && selectedIds.length === data.length
  const someSelected = selectedIds.length > 0 && !allSelected

  function toggleAll() {
    if (!onSelect) return
    if (allSelected) onSelect([])
    else onSelect(data.map((r) => r._id || r.id))
  }

  function toggleRow(id) {
    if (!onSelect) return
    onSelect(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id])
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm"
    >
      {(searchable || filters) && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center gap-3">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>
          )}
          {filters && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-gray-200 dark:border-slate-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
              aria-label="Toggle filters"
            >
              <Filter size={16} />
            </motion.button>
          )}
        </div>
      )}

      {showFilters && filters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30"
        >
          <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
              <div key={f.accessor} className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{f.label}</label>
                <select
                  value={activeFilters[f.accessor] || ''}
                  onChange={(e) => {
                    setActiveFilters((prev) => ({ ...prev, [f.accessor]: e.target.value }))
                    setCurrentPage(1)
                  }}
                  className="text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All</option>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            ))}
            <button
              onClick={() => { setActiveFilters({}); setShowFilters(false) }}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          </div>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800/50 sticky top-0 z-10">
              {selectable && (
                <th className="px-4 sm:px-6 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected }}
                    onChange={toggleAll}
                    className="rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary"
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.accessor || col.header}
                  className={`text-left px-4 sm:px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {paginated.length ? (
              paginated.map((row, i) => {
                const rowId = row._id || row.id || i
                return (
                  <motion.tr
                    key={rowId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    className={`group transition-colors ${
                      selectedIds.includes(rowId)
                        ? 'bg-primary/5 dark:bg-primary/10'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    {selectable && (
                      <td className="px-4 sm:px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(rowId)}
                          onChange={() => toggleRow(rowId)}
                          className="rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary"
                          aria-label={`Select row ${i + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.accessor || col.header}
                        className={`px-4 sm:px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap ${col.className || ''}`}
                      >
                        {col.render ? col.render(row) : row[col.accessor] ?? '-'}
                      </td>
                    ))}
                  </motion.tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search size={24} className="opacity-40" />
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {filtered.length > 0
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}${selectedIds.length ? ` (${selectedIds.length} selected)` : ''}`
            : 'No results'}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </motion.button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
              const page = start + i
              if (page > totalPages) return null
              return (
                <motion.button
                  key={page}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {page}
                </motion.button>
              )
            })}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
