import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HeartPulse, HardDrive, Database, TableProperties, FileWarning, RefreshCw,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import { getHealth, getStorage, getCollections, getIndexes, getOrphanFiles } from '../../shared/services/maintenanceService'

const tabs = [
  { id: 'health', label: 'Health Check', icon: HeartPulse },
  { id: 'storage', label: 'Storage Usage', icon: HardDrive },
  { id: 'collections', label: 'Collection Stats', icon: Database },
  { id: 'indexes', label: 'Index Status', icon: TableProperties },
  { id: 'orphan', label: 'Orphan Files', icon: FileWarning },
]

function fmtBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState('health')
  const [loading, setLoading] = useState(false)
  const [health, setHealth] = useState(null)
  const [storage, setStorage] = useState(null)
  const [collections, setCollections] = useState([])
  const [indexData, setIndexData] = useState([])
  const [orphanFiles, setOrphanFiles] = useState([])
  const [orphanTotal, setOrphanTotal] = useState(0)
  const [toast, setToast] = useState(null)

  const fetchData = async (tab) => {
    setLoading(true)
    try {
      if (tab === 'health') { const r = await getHealth(); setHealth(r.health) }
      if (tab === 'storage') { const r = await getStorage(); setStorage(r.storage) }
      if (tab === 'collections') { const r = await getCollections(); setCollections(r.collections || []) }
      if (tab === 'indexes') { const r = await getIndexes(); setIndexData(r.collections || []) }
      if (tab === 'orphan') { const r = await getOrphanFiles(); setOrphanFiles(r.orphanFiles || []); setOrphanTotal(r.totalCount || 0) }
    } catch {
      setToast({ message: 'Failed to load data', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData(activeTab) }, [activeTab])

  return (
    <div>
      <PageHeader
        title="Database Maintenance"
        subtitle="Monitor database health, storage, collections, indexes, and orphan files."
      />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
        <button
          onClick={() => fetchData(activeTab)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === 'health' && health && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Database Health</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(health).map(([key, val]) => (
                  <div key={key} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className={`text-sm font-medium break-all ${key === 'status' ? (val === 'healthy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600') : 'text-gray-900 dark:text-white'}`}>
                      {String(val)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'storage' && storage && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Storage Usage</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(storage)
                  .filter(([k]) => !k.endsWith('Formatted'))
                  .map(([key, val]) => (
                    <div key={key} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {typeof val === 'number' ? fmtBytes(val) : String(val)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800">
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Collection</th>
                      <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Documents</th>
                      <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Size</th>
                      <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Avg Size</th>
                      <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Storage</th>
                      <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Indexes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {collections.map((col) => (
                      <tr key={col.name} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{col.name}</td>
                        <td className="px-4 py-3.5 text-right text-gray-700 dark:text-gray-300">{col.documentCount?.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-right text-gray-600 dark:text-gray-400">{col.sizeFormatted}</td>
                        <td className="px-4 py-3.5 text-right text-gray-500 dark:text-gray-400">{col.avgObjSize}</td>
                        <td className="px-4 py-3.5 text-right text-gray-500 dark:text-gray-400">{col.storageSizeFormatted}</td>
                        <td className="px-5 py-3.5 text-right text-gray-600 dark:text-gray-400">{col.indexes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'indexes' && (
            <div className="space-y-4">
              {indexData.map((col) => (
                <div key={col.collection} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{col.collection} ({col.indexes.length} indexes)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-slate-800">
                          <th className="text-left px-3 py-2 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                          <th className="text-left px-3 py-2 font-semibold text-gray-600 dark:text-gray-400">Key</th>
                          <th className="text-center px-3 py-2 font-semibold text-gray-600 dark:text-gray-400">Unique</th>
                          <th className="text-center px-3 py-2 font-semibold text-gray-600 dark:text-gray-400">Sparse</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {col.indexes.map((idx) => (
                          <tr key={idx.name}>
                            <td className="px-3 py-2 font-medium text-gray-900 dark:text-white font-mono text-xs">{idx.name}</td>
                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400 font-mono text-xs">{idx.key}</td>
                            <td className="px-3 py-2 text-center">{idx.unique ? <span className="text-emerald-600">Yes</span> : <span className="text-gray-400">No</span>}</td>
                            <td className="px-3 py-2 text-center">{idx.sparse ? <span className="text-amber-600">Yes</span> : <span className="text-gray-400">No</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'orphan' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Orphan Files</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {orphanTotal} file{orphanTotal !== 1 ? 's' : ''} ({fmtBytes(orphanTotal ? orphanFiles.reduce((s, f) => s + f.size, 0) : 0)}) not referenced by any record
                  </p>
                </div>
              </div>
              {orphanFiles.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  No orphan files detected. All files in uploads are referenced by database records.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-800">
                        <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Filename</th>
                        <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Size</th>
                        <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Modified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {orphanFiles.map((f) => (
                        <tr key={f.name} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white font-mono text-xs">{f.name}</td>
                          <td className="px-4 py-3.5 text-right text-gray-600 dark:text-gray-400">{f.sizeFormatted}</td>
                          <td className="px-5 py-3.5 text-right text-gray-500 dark:text-gray-400">{new Date(f.modified).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
