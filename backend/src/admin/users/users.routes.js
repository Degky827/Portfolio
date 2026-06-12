const { Router } = require('express')
const { authenticateToken, authorizeSuperAdmin } = require('../../shared/middleware/auth')
const {
  getUsers, getUser, createUser, updateUser, deleteUser,
} = require('./users.controller')

const router = Router()

router.use(authenticateToken)
router.use(authorizeSuperAdmin)

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
