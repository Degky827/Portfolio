import { useState, useEffect, useCallback } from 'react'
import api from '../../../shared/services/api'

const initialFilters = { dateFrom: '', dateTo: '', country: '', deviceType: '', browser: '', source: '' }

export default function useAnalyticsFilters() {
  const [data, setData] = useState(null)
  const [visits, setVisits] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [visitsLoading, setVisitsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(initialFilters)

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      const { data: res } = await api.get(`/analytics/analytics-dashboard?${params}`)
      if (res.success) setData(res)
      setError('')
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please refresh the page.')
        return
      }
      setError('Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchVisits = useCallback(async () => {
    try {
      setVisitsLoading(true)
      const params = new URLSearchParams({ limit: '100' })
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      const { data: res } = await api.get(`/analytics/metrics?${params}`)
      if (res.success) {
        setVisits(res.visits || [])
        setTotalCount(res.totalCount || 0)
      }
    } catch { /* noop */ } finally {
      setVisitsLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  useEffect(() => { fetchVisits() }, [fetchVisits])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters(initialFilters)
  }

  function refresh() {
    fetchDashboard()
    fetchVisits()
  }

  return {
    data,
    visits,
    totalCount,
    loading,
    visitsLoading,
    error,
    filters,
    activeFilterCount,
    handleFilterChange,
    clearFilters,
    refresh,
  }
}
