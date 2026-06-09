const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken, authorizeSuperAdmin } = require('../middleware/auth')
const upload = require('../config/upload')
const {
  createCertificate,
  getCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController')

const router = Router()

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((e) => e.msg).join(', '),
    })
  }
  next()
}

const certificateValidation = [
  body('title').trim().notEmpty().withMessage('Certificate title is required'),
  body('issuingOrganization').trim().notEmpty().withMessage('Issuing organization is required'),
  body('issueDate').notEmpty().withMessage('Issue date is required'),
]

router.post(
  '/',
  authenticateToken,
  authorizeSuperAdmin,
  upload.single('certificateImage'),
  certificateValidation,
  handleValidation,
  createCertificate,
)

router.get('/', getCertificates)

router.get('/:id', getCertificate)

router.put(
  '/:id',
  authenticateToken,
  authorizeSuperAdmin,
  upload.single('certificateImage'),
  certificateValidation,
  handleValidation,
  updateCertificate,
)

router.delete('/:id', authenticateToken, authorizeSuperAdmin, deleteCertificate)

module.exports = router
