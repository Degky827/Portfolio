const AuditLog = require('../../shared/models/AuditLog')
const User = require('../../shared/models/User')

async function listLogs(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 100)
    const search = req.query.search || ''
    const action = req.query.action || ''
    const resource = req.query.resource || ''
    const startDate = req.query.startDate || ''
    const endDate = req.query.endDate || ''

    const query = {}

    if (action) query.action = action
    if (resource) query.resource = { $regex: resource, $options: 'i' }

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        query.createdAt.$lte = end
      }
    }

    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id').lean()

      const userIds = matchingUsers.map((u) => u._id)

      query.$or = [
        { user: { $in: userIds } },
        { action: { $regex: search, $options: 'i' } },
        { resource: { $regex: search, $options: 'i' } },
        { ipAddress: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit

    const [totalCount, logs] = await Promise.all([
      AuditLog.countDocuments(query),
      AuditLog.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ])

    res.json({
      success: true,
      totalCount,
      logs,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        hasMore: skip + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('[activityLog] list error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch activity logs' })
  }
}

async function getLog(req, res) {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('user', 'name email')
      .lean()
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log not found' })
    }
    res.json({ success: true, log })
  } catch (error) {
    console.error('[activityLog] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch log' })
  }
}

async function exportLogs(req, res) {
  try {
    const format = req.query.format || 'json'
    const action = req.query.action || ''
    const resource = req.query.resource || ''
    const startDate = req.query.startDate || ''
    const endDate = req.query.endDate || ''

    const query = {}
    if (action) query.action = action
    if (resource) query.resource = { $regex: resource, $options: 'i' }
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        query.createdAt.$lte = end
      }
    }

    const logs = await AuditLog.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    const rows = logs.map((l) => ({
      user: l.user?.name || l.user?.email || 'System',
      action: l.action,
      resource: l.resource,
      resourceId: l.resourceId,
      ipAddress: l.ipAddress,
      timestamp: l.createdAt,
      success: l.success,
    }))

    if (format === 'csv') {
      const header = 'User,Action,Resource,Resource ID,IP Address,Timestamp,Success'
      const csvRows = rows.map((r) =>
        [
          `"${(r.user || '').replace(/"/g, '""')}"`,
          `"${r.action}"`,
          `"${(r.resource || '').replace(/"/g, '""')}"`,
          `"${(r.resourceId || '').replace(/"/g, '""')}"`,
          `"${(r.ipAddress || '').replace(/"/g, '""')}"`,
          `"${new Date(r.timestamp).toISOString()}"`,
          r.success ? 'Yes' : 'No',
        ].join(','),
      )
      const csv = [header, ...csvRows].join('\n')
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="activity-logs.csv"')
      return res.send(csv)
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', 'attachment; filename="activity-logs.json"')
    res.json(rows)
  } catch (error) {
    console.error('[activityLog] export error:', error)
    res.status(500).json({ success: false, message: 'Failed to export logs' })
  }
}

async function getActions(_req, res) {
  try {
    const actions = await AuditLog.distinct('action')
    res.json({ success: true, actions: actions.sort() })
  } catch (error) {
    console.error('[activityLog] actions error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch actions' })
  }
}

module.exports = { listLogs, getLog, exportLogs, getActions }
