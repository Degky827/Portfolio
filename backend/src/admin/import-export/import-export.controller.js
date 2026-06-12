const Project = require('../../shared/models/Project')
const Skill = require('../../shared/models/Skill')
const Settings = require('../../shared/models/Settings')
const HomeContent = require('../../shared/models/HomeContent')
const AboutContent = require('../../shared/models/AboutContent')

function toCSV(items, fields) {
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return `"${s.replace(/"/g, '""')}"`
  }
  const header = fields.map((f) => `"${f.label}"`).join(',')
  const rows = items.map((item) =>
    fields.map((f) => esc(f.get ? f.get(item) : item[f.key])).join(','),
  )
  return [header, ...rows].join('\n')
}

const EXPORT_CONFIG = {
  projects: {
    model: Project,
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'shortDescription', label: 'Short Description' },
      { key: 'fullDescription', label: 'Full Description' },
      {
        label: 'Technologies',
        get: (p) => (Array.isArray(p.technologies) ? p.technologies.join(';') : ''),
      },
      { key: 'githubUrl', label: 'GitHub URL' },
      { key: 'liveDemoUrl', label: 'Live Demo URL' },
      { key: 'category', label: 'Category' },
      { key: 'featured', label: 'Featured' },
      { key: 'displayOrder', label: 'Display Order' },
      { key: 'status', label: 'Status' },
    ],
  },
  skills: {
    model: Skill,
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'proficiency', label: 'Proficiency' },
      { key: 'displayOrder', label: 'Display Order' },
    ],
  },
}

const IMPORT_CONFIG = {
  projects: {
    model: Project,
    titleField: 'title',
    parseRow: (row) => ({
      title: row.title,
      shortDescription: row.shortDescription || '',
      fullDescription: row.fullDescription || '',
      technologies: row.technologies
        ? row.technologies.split(';').map((s) => s.trim()).filter(Boolean)
        : [],
      githubUrl: row.githubUrl || '',
      liveDemoUrl: row.liveDemoUrl || '',
      category: row.category || '',
      featured: row.featured === true || row.featured === 'true' || row.featured === 'Yes',
      displayOrder: parseInt(row.displayOrder, 10) || 0,
      status: row.status || 'active',
    }),
  },
  skills: {
    model: Skill,
    titleField: 'name',
    parseRow: (row) => ({
      name: row.name,
      category: row.category || '',
      proficiency: parseInt(row.proficiency, 10) || 50,
      displayOrder: parseInt(row.displayOrder, 10) || 0,
    }),
  },
}

const UPS_COLLECTIONS = [
  { model: Settings, key: 'settings' },
  { model: Skill, key: 'skills' },
  { model: Project, key: 'projects' },
  { model: HomeContent, key: 'homeContent' },
  { model: AboutContent, key: 'aboutContent' },
]

async function buildUPSSnapshot() {
  const results = await Promise.all(
    UPS_COLLECTIONS.map(({ model }) => model.find().lean()),
  )

  const snapshot = {
    format: 'ups',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    summary: {},
    data: {},
  }

  UPS_COLLECTIONS.forEach(({ key }, i) => {
    snapshot.data[key] = results[i]
    snapshot.summary[key] = results[i].length
  })

  return snapshot
}

async function restoreFromUPSSnapshot(data) {
  const results = []
  for (const { model, key } of UPS_COLLECTIONS) {
    const docs = data[key]
    if (Array.isArray(docs) && docs.length > 0) {
      await model.collection.deleteMany({})
      const inserted = await model.collection.insertMany(
        docs.map((d) => {
          if (d._id) delete d._id
          return d
        }),
      )
      results.push({ collection: key, count: inserted.length })
    }
  }
  return results
}

async function exportData(req, res) {
  try {
    const type = req.query.type || 'all'
    const format = req.query.format || 'json'

    if (type === 'ups') {
      const snapshot = await buildUPSSnapshot()
      const json = JSON.stringify(snapshot, null, 2)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', 'attachment; filename="portfolio-snapshot.ups"')
      return res.send(json)
    }

    const types = type === 'all'
      ? ['projects', 'skills']
      : [type]

    const result = {}

    for (const t of types) {
      const cfg = EXPORT_CONFIG[t]
      if (!cfg) continue
      const items = await cfg.model.find().lean()
      result[t] = items
    }

    if (format === 'csv') {
      const parts = []
      for (const t of types) {
        const cfg = EXPORT_CONFIG[t]
        if (!cfg) continue
        const items = result[t] || []
        parts.push(`--- ${t.toUpperCase()} ---`)
        parts.push(toCSV(items, cfg.fields))
      }
      const csv = parts.join('\n\n')
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="portfolio-${type}-export.csv"`)
      return res.send(csv)
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="portfolio-${type}-export.json"`)
    res.json(type === 'all' ? result : result[type])
  } catch (error) {
    console.error('[importExport] export error:', error)
    res.status(500).json({ success: false, message: 'Failed to export data' })
  }
}

async function importUPSSnapshot(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    let parsed
    try {
      parsed = JSON.parse(req.file.buffer.toString('utf8'))
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid JSON file' })
    }

    if (parsed.format !== 'ups') {
      return res.status(400).json({ success: false, message: 'Not a valid .ups snapshot file' })
    }

    const results = await restoreFromUPSSnapshot(parsed.data)

    res.json({
      success: true,
      message: 'Unified Portfolio State Snapshot restored successfully',
      results,
    })
  } catch (error) {
    console.error('[importExport] UPS import error:', error)
    res.status(500).json({ success: false, message: 'Failed to import snapshot' })
  }
}

async function previewImport(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const type = req.body.type
    if (!type || !IMPORT_CONFIG[type]) {
      return res.status(400).json({ success: false, message: 'Invalid or missing import type' })
    }

    const cfg = IMPORT_CONFIG[type]
    const raw = req.file.buffer.toString('utf8')
    const isCSV = req.file.originalname.endsWith('.csv')
    let rows

    try {
      if (isCSV) {
        rows = parseCSV(raw)
      } else {
        const parsed = JSON.parse(raw)
        rows = Array.isArray(parsed) ? parsed : [parsed]
      }
    } catch {
      return res.status(400).json({ success: false, message: `Invalid ${isCSV ? 'CSV' : 'JSON'} file format` })
    }

    const existing = await cfg.model.find().select(cfg.titleField).lean()
    const existingTitles = new Set(
      existing.map((e) => (e[cfg.titleField] || '').toLowerCase().trim()),
    )

    const valid = []
    const invalid = []
    const duplicates = []

    rows.forEach((row, i) => {
      const title = (row[cfg.titleField] || '').trim()
      if (!title) {
        invalid.push({ row: i + 1, errors: [`Missing required field: ${cfg.titleField}`] })
        return
      }
      if (existingTitles.has(title.toLowerCase())) {
        duplicates.push({ row: i + 1, title })
        return
      }
      try {
        const parsed = cfg.parseRow(row)
        valid.push(parsed)
      } catch {
        invalid.push({ row: i + 1, errors: ['Failed to parse row'] })
      }
    })

    const summary = {
      total: rows.length,
      valid: valid.length,
      invalid: invalid.length,
      duplicates: duplicates.length,
    }

    res.json({ success: true, summary, valid, invalid, duplicates, type })
  } catch (error) {
    console.error('[importExport] preview error:', error)
    res.status(500).json({ success: false, message: 'Failed to preview import' })
  }
}

async function executeImport(req, res) {
  try {
    const { type, items } = req.body
    if (!type || !IMPORT_CONFIG[type]) {
      return res.status(400).json({ success: false, message: 'Invalid import type' })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items to import' })
    }

    const cfg = IMPORT_CONFIG[type]
    const parsed = items.map((item) => cfg.parseRow(item))
    const created = await cfg.model.insertMany(parsed)

    res.json({
      success: true,
      message: `Successfully imported ${created.length} ${type}`,
      count: created.length,
    })
  } catch (error) {
    console.error('[importExport] import error:', error)
    res.status(500).json({ success: false, message: 'Failed to import data' })
  }
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const parseLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseLine(lines[0])
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i])
    const row = {}
    headers.forEach((h, j) => {
      row[h] = values[j] || ''
    })
    rows.push(row)
  }

  return rows
}

module.exports = { exportData, previewImport, executeImport, importUPSSnapshot, buildUPSSnapshot }
