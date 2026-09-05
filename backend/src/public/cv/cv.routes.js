const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../../shared/middleware/auth')
const { getCVContent, updateCVContent } = require('./cv.controller')

router.get('/', getCVContent)
router.put('/', authenticateToken, updateCVContent)

module.exports = router
