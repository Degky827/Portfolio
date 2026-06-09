const fs = require('fs')
const path = require('path')
const Certificate = require('../models/Certificate')

async function createCertificate(req, res) {
  try {
    const {
      title, issuingOrganization, issueDate, expirationDate,
      credentialId, verificationUrl, description, skillsCovered,
      featured, status,
    } = req.body

    const certificate = await Certificate.create({
      title,
      issuingOrganization,
      issueDate,
      expirationDate: expirationDate || null,
      credentialId: credentialId || '',
      verificationUrl: verificationUrl || '',
      certificateImage: req.file ? `/uploads/${req.file.filename}` : req.body.certificateImageUrl || '',
      description: description || '',
      skillsCovered: skillsCovered || [],
      featured: featured === true || featured === 'true',
      status: status || 'active',
    })

    res.status(201).json({ success: true, certificate })
  } catch (error) {
    console.error('[certificates] createCertificate error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to create certificate' })
  }
}

async function getCertificates(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 50)
    const search = req.query.search || ''
    const featured = req.query.featured || ''
    const statusFilter = req.query.status || ''

    const skip = (page - 1) * limit
    const query = {}

    if (statusFilter) {
      query.status = statusFilter
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { issuingOrganization: { $regex: search, $options: 'i' } },
        { skillsCovered: { $regex: search, $options: 'i' } },
      ]
    }

    if (featured === 'true') {
      query.featured = true
    } else if (featured === 'false') {
      query.featured = false
    }

    const [totalCount, certificates] = await Promise.all([
      Certificate.countDocuments(query),
      Certificate.find(query).sort({ issueDate: -1 }).skip(skip).limit(limit).lean(),
    ])

    res.json({
      success: true,
      totalCount,
      certificates,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        hasMore: skip + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('[certificates] getCertificates error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch certificates' })
  }
}

async function getCertificate(req, res) {
  try {
    const certificate = await Certificate.findById(req.params.id).lean()
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' })
    }
    res.json({ success: true, certificate })
  } catch (error) {
    console.error('[certificates] getCertificate error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch certificate' })
  }
}

async function updateCertificate(req, res) {
  try {
    const certificate = await Certificate.findById(req.params.id)
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' })
    }

    const fields = [
      'title', 'issuingOrganization', 'issueDate', 'expirationDate',
      'credentialId', 'verificationUrl', 'description', 'skillsCovered',
      'featured', 'status',
    ]

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'featured') {
          certificate[field] = req.body[field] === true || req.body[field] === 'true'
        } else if (field === 'skillsCovered') {
          certificate[field] = typeof req.body[field] === 'string'
            ? req.body[field].split(',').map((s) => s.trim()).filter(Boolean)
            : req.body[field] || []
        } else {
          certificate[field] = req.body[field]
        }
      }
    })

    if (req.file) {
      if (certificate.certificateImage && certificate.certificateImage.startsWith('/uploads/')) {
        const oldPath = path.resolve(__dirname, '..', certificate.certificateImage)
        try { fs.unlinkSync(oldPath) } catch { /* file may not exist */ }
      }
      certificate.certificateImage = `/uploads/${req.file.filename}`
    } else if (req.body.certificateImageUrl) {
      certificate.certificateImage = req.body.certificateImageUrl
    }

    await certificate.save()

    res.json({ success: true, certificate })
  } catch (error) {
    console.error('[certificates] updateCertificate error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to update certificate' })
  }
}

async function deleteCertificate(req, res) {
  try {
    const certificate = await Certificate.findById(req.params.id)
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' })
    }

    if (certificate.certificateImage && certificate.certificateImage.startsWith('/uploads/')) {
      const filePath = path.resolve(__dirname, '..', certificate.certificateImage)
      try { fs.unlinkSync(filePath) } catch { /* file may not exist */ }
    }

    await Certificate.findByIdAndDelete(req.params.id)

    res.json({ success: true, message: 'Certificate deleted successfully' })
  } catch (error) {
    console.error('[certificates] deleteCertificate error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete certificate' })
  }
}

module.exports = { createCertificate, getCertificates, getCertificate, updateCertificate, deleteCertificate }
