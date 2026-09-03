const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  getUsers, getUser, createUser, updateUser, deleteUser,
} = require('./users.controller')

const router = Router()

router.use(authenticateToken)

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
