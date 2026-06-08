import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({ columns, data, searchable = true, pageSize = 10, loading = false }) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search || !data) return data || []
    const q = search.toLowerCase()
    return data.filter((row) =>
      columns.some((col) => {
        const val = col.accessor ? row[col.accessor] : ''
        return String(val || '').toLowerCase().includes(q)
      }),
    )
  }, [data, search, columns])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-gray-200 dark:border-slate-800">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800/50">
              {columns.map((col) => (
                <th
                  key={col.accessor || col.header}
                  className={`text-left px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {paginated.length ? (
              paginated.map((row, i) => (
                <tr
                  key={row._id || i}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.accessor || col.header}
                      className={`px-4 sm:px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap ${col.className || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
