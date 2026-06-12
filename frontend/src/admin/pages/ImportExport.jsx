import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, Upload, FileJson, FileText, Database, AlertTriangle, Check, X, RefreshCw,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Toast from '../components/Toast'
import { exportData, previewImport, executeImport, importUPSSnapshot } from '../../services/importExportService'

const EXPORT_TYPES = [
  { value: 'projects', label: 'Projects' },
  { value: 'skills', label: 'Skills' },
  { value: 'all', label: 'Complete Portfolio' },
]

const IMPORT_TYPES = [
  { value: 'projects', label: 'Projects', desc: 'Title, description, technologies, URLs, category, status' },
  { value: 'skills', label: 'Skills', desc: 'Name, category, proficiency, display order, certificate fields' },
]

export default function ImportExport() {
  const fileRef = useRef(null)
  const upsFileRef = useRef(null)
  const [exportType, setExportType] = useState('all')
  const [exportFormat, setExportFormat] = useState('json')
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState(null)

  const [importType, setImportType] = useState('projects')
  const [importing, setImporting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportData({ type: exportType, format: exportFormat })
      const ext = exportFormat === 'csv' ? 'csv' : 'json'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `portfolio-${exportType}-export.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      setToast({ message: 'Export downloaded successfully', type: 'success' })
    } catch {
      setToast({ message: 'Failed to export data', type: 'error' })
    } finally {
      setExporting(false)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setPreview(null)
    try {
      const res = await previewImport(file, importType)
      if (res.success) {
        setPreview(res)
      } else {
        setToast({ message: res.message || 'Failed to preview import', type: 'error' })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to preview import', type: 'error' })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleImport = async () => {
    if (!preview || preview.valid.length === 0) return
    setImporting(true)
    try {
      const res = await executeImport(importType, preview.valid)
      setToast({ message: res.message || 'Import successful', type: 'success' })
      setPreview(null)
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to import data', type: 'error' })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Import / Export"
        subtitle="Export portfolio data or import from JSON/CSV files."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Download size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Export Data</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Download your portfolio data as JSON or CSV</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Content to Export
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EXPORT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setExportType(t.value)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-colors text-left ${
                    exportType === t.value
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Format
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setExportFormat('json')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors flex-1 justify-center ${
                  exportFormat === 'json'
                    ? 'bg-primary/5 border-primary text-primary'
                    : 'border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <FileJson size={18} />
                JSON
              </button>
              <button
                onClick={() => setExportFormat('csv')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors flex-1 justify-center ${
                  exportFormat === 'csv'
                    ? 'bg-primary/5 border-primary text-primary'
                    : 'border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <FileText size={18} />
                CSV
              </button>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            Download Export
          </button>
        </motion.div>

        {/* Import Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <Upload size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Import Data</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upload a JSON or CSV file to import data</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Import Type
            </label>
            <div className="space-y-2">
              {IMPORT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => { setImportType(t.value); setPreview(null) }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-colors text-left ${
                    importType === t.value
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="font-medium">{t.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".json,.csv"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            {uploading ? 'Processing...' : 'Select File to Import'}
          </button>

          {/* Preview Results */}
          {preview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-2 border-t border-gray-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Import Preview</h3>
                <button
                  onClick={() => setPreview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{preview.summary?.total || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{preview.summary?.valid || 0}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Valid</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{preview.summary?.duplicates || 0}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">Duplicates</p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-center">
                  <p className="text-lg font-bold text-red-700 dark:text-red-400">{preview.summary?.invalid || 0}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">Invalid</p>
                </div>
              </div>

              {preview.duplicates?.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">
                    {preview.duplicates.length} duplicate(s) found — will be skipped
                  </p>
                  <ul className="text-xs text-amber-700 dark:text-amber-400 list-disc list-inside max-h-24 overflow-y-auto">
                    {preview.duplicates.slice(0, 10).map((d, i) => (
                      <li key={i}>{d.title}</li>
                    ))}
                    {preview.duplicates.length > 10 && <li>...and {preview.duplicates.length - 10} more</li>}
                  </ul>
                </div>
              )}

              {preview.invalid?.length > 0 && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-xs font-medium text-red-800 dark:text-red-300 mb-1">
                    {preview.invalid.length} invalid row(s) — will be skipped
                  </p>
                  <ul className="text-xs text-red-700 dark:text-red-400 list-disc list-inside max-h-24 overflow-y-auto">
                    {preview.invalid.slice(0, 5).map((d, i) => (
                      <li key={i}>Row {d.row}: {d.errors?.join(', ')}</li>
                    ))}
                  </ul>
                </div>
              )}

              {preview.valid.length > 0 && (
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {importing ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Database size={18} />
                  )}
                  {importing ? 'Importing...' : `Import ${preview.valid.length} ${importType}`}
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ─── UPS Snapshot Section ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
            <Database size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">UPS Snapshot</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Unified Portfolio State — export or import your full portfolio state as a single .ups file
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export UPS */}
          <button
            onClick={async () => {
              setExporting(true)
              try {
                const blob = await exportData({ type: 'ups', format: 'ups' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `portfolio-snapshot.ups`
                a.click()
                URL.revokeObjectURL(url)
                setToast({ message: 'UPS snapshot exported successfully', type: 'success' })
              } catch {
                setToast({ message: 'Failed to export UPS snapshot', type: 'error' })
              } finally {
                setExporting(false)
              }
            }}
            disabled={exporting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {exporting ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
            {exporting ? 'Exporting...' : 'Export UPS Snapshot'}
          </button>

          {/* Import UPS */}
          <div className="flex gap-2">
            <input
              ref={upsFileRef}
              type="file"
              accept=".ups"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setUploading(true)
                try {
                  const res = await importUPSSnapshot(file)
                  setToast({ message: res.message || 'UPS snapshot imported successfully', type: 'success' })
                } catch (err) {
                  setToast({ message: err.response?.data?.message || 'Failed to import UPS snapshot', type: 'error' })
                } finally {
                  setUploading(false)
                  if (upsFileRef.current) upsFileRef.current.value = ''
                }
              }}
            />
            <button
              onClick={() => upsFileRef.current?.click()}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:border-purple-500 hover:text-purple-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {uploading ? <RefreshCw size={18} className="animate-spin" /> : <Upload size={18} />}
              {uploading ? 'Importing...' : 'Import UPS Snapshot'}
            </button>
          </div>
        </div>
      </motion.div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
