const { Router } = require('express')
const { authenticateToken, authorizeRoles } = require('../middleware/auth')
const {
  getUsers, getUser, createUser, updateUser, deleteUser,
} = require('../controllers/userController')

const router = Router()

router.use(authenticateToken)
router.use(authorizeRoles('super_admin'))

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
