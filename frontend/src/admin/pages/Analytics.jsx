import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'

export default function Analytics() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [visits, setVisits] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get('/analytics/metrics?limit=100')
      if (data.success) {
        setVisits(data.visits || [])
        setTotalCount(data.totalCount || 0)
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout()
        navigate('/login', { replace: true })
        return
      }
      setError('Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }, [logout, navigate])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    fetchVisits()
  }, [isAuthenticated, navigate, fetchVisits])

  if (!isAuthenticated) return null

  const columns = [
    {
      header: 'When',
      accessor: 'timestamp',
      render: (row) => (
        <div>
          <span className="font-medium">
            {new Date(row.timestamp).toLocaleDateString()}
          </span>
          <span className="text-gray-400 ml-2">
            {new Date(row.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ),
    },
    {
      header: 'Who',
      accessor: 'visitorName',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.visitorName}
        </span>
      ),
    },
    {
      header: 'Where',
      accessor: 'location',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.location
            ? [row.location.city, row.location.region, row.location.country]
                .filter(Boolean)
                .join(', ') || 'Unknown'
            : 'Unknown'}
        </span>
      ),
    },
    {
      header: 'Device',
      accessor: 'deviceType',
      className: 'hidden md:table-cell',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.deviceInfo?.deviceType || 'Unknown'}
        </span>
      ),
    },
    {
      header: 'Browser / OS',
      accessor: 'browserOs',
      className: 'hidden lg:table-cell',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {[row.deviceInfo?.browser, row.deviceInfo?.os].filter(Boolean).join(' / ') || 'Unknown'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle={`${totalCount.toLocaleString()} total visits recorded`}
        actions={
          <button
            onClick={fetchVisits}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
          <button onClick={fetchVisits} className="ml-3 underline font-medium">
            Retry
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={visits}
        searchable
        pageSize={10}
        loading={loading}
      />
    </div>
  )
}
