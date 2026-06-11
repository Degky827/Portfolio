const User = require('../models/User')
const { createAuditLog, generate2FASecret, generateQRCodeDataURL } = require('./authController')

async function getUsers(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 50)
    const search = req.query.search || ''
    const role = req.query.role || ''
    const status = req.query.status || ''

    const skip = (page - 1) * limit
    const query = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }
    if (role) {
      query.role = role
    }
    if (status === 'active') {
      query.isActive = true
    } else if (status === 'disabled') {
      query.isActive = false
    }

    const [totalCount, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select('+twoFactorEnabled'),
    ])

    res.json({
      success: true,
      totalCount,
      users: users.map((u) => {
        const obj = u.toJSON()
        obj.twoFactorEnabled = u.twoFactorEnabled
        return obj
      }),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        hasMore: skip + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('[users] getUsers error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch users.' })
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).select('+twoFactorSecret +twoFactorEnabled +failedLoginAttempts +lockedUntil')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }
    const data = user.toJSON()
    data.twoFactorEnabled = user.twoFactorEnabled
    data.twoFactorSecret = user.twoFactorSecret || ''
    data.failedLoginAttempts = user.failedLoginAttempts
    data.lockedUntil = user.lockedUntil
    res.json({ success: true, user: data })
  } catch (error) {
    console.error('[users] getUser error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch user.' })
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
      })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists.' })
    }

    const { base32, otpauthUrl } = generate2FASecret(email)
    const qrCodeDataURL = await generateQRCodeDataURL(otpauthUrl)

    /*
     * TODO: Send the 2FA secret to the new user via email.
     *
     * Example using Nodemailer (install with: npm install nodemailer):
     *
     *   const transporter = nodemailer.createTransport({
     *     host: process.env.SMTP_HOST,
     *     port: process.env.SMTP_PORT,
     *     secure: true,
     *     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
     *   })
     *   await transporter.sendMail({
     *     from: '"Admin" <noreply@example.com>',
     *     to: email,
     *     subject: 'Your 2FA Setup for Portfolio Admin',
     *     html: `
     *       <h2>Welcome to the Portfolio Admin Panel</h2>
     *       <p>Your 2FA secret key is:</p>
     *       <code style="font-size:1.2em;background:#f0f0f0;padding:8px 12px;display:inline-block;border-radius:4px;">
     *         ${base32}
     *       </code>
     *       <p>Scan the QR code below with your authenticator app:</p>
     *       <p><img src="${qrCodeDataURL}" alt="QR Code" /></p>
     *       <p>Or use the OTP URL: <a href="${otpauthUrl}">${otpauthUrl}</a></p>
     *       <p>After setting up, log in at the admin panel and complete the two-step verification.</p>
     *     `,
     *   })
     */

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'editor',
      twoFactorSecret: base32,
      twoFactorEnabled: false,
    })

    await createAuditLog({
      user: req.user._id,
      action: 'CREATE',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email, role: user.role, twoFactorGenerated: true },
      req,
    })

    const responseData = user.toJSON()
    responseData.twoFactorEnabled = user.twoFactorEnabled
    responseData.twoFactorSecret = base32
    responseData.twoFactorQrCode = qrCodeDataURL

    res.status(201).json({ success: true, user: responseData })
  } catch (error) {
    console.error('[users] createUser error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to create user.' })
  }
}

async function updateUser(req, res) {
  try {
    const user = await User.findById(req.params.id).select('+twoFactorSecret +twoFactorEnabled')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    const {
      name, email, role, isActive, password, currentPassword,
      displayName, phone, bio, location, socialLinks, theme, avatar,
    } = req.body
    const changes = []

    if (name !== undefined) {
      user.name = name.trim()
      changes.push('name')
    }
    if (displayName !== undefined) {
      user.displayName = displayName.trim()
      changes.push('displayName')
    }
    if (phone !== undefined) {
      user.phone = phone.trim()
      changes.push('phone')
    }
    if (bio !== undefined) {
      user.bio = bio
      changes.push('bio')
    }
    if (location !== undefined) {
      user.location = location.trim()
      changes.push('location')
    }
    if (socialLinks !== undefined) {
      if (typeof socialLinks === 'object') {
        Object.assign(user.socialLinks, socialLinks)
        changes.push('socialLinks')
      }
    }
    if (theme !== undefined) {
      user.theme = theme
      changes.push('theme')
    }
    if (avatar !== undefined) {
      user.avatar = avatar
      changes.push('avatar')
    }
    if (email !== undefined) {
      user.email = email.toLowerCase().trim()
      changes.push('email')
    }
    if (role !== undefined) {
      if (!['super_admin', 'admin', 'editor'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role.' })
      }
      if (user.role !== role) {
        await createAuditLog({
          user: req.user._id,
          action: 'ROLE_CHANGE',
          resource: 'User',
          resourceId: user._id,
          details: { from: user.role, to: role },
          req,
        })
        user.role = role
        changes.push('role')
      }
    }
    if (isActive !== undefined) {
      user.isActive = isActive
      changes.push(isActive ? 'enabled' : 'disabled')
      await createAuditLog({
        user: req.user._id,
        action: isActive ? 'ACCOUNT_ENABLED' : 'ACCOUNT_DISABLED',
        resource: 'User',
        resourceId: user._id,
        details: { email: user.email },
        req,
      })
    }
    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
        })
      }
      if (req.user._id.toString() === req.params.id && currentPassword) {
        const isMatch = await user.comparePassword(currentPassword)
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Current password is incorrect.' })
        }
      }
      user.password = password
      changes.push('password')
      user.failedLoginAttempts = 0
      user.lockedUntil = null
      user.refreshTokens = []
    }

    await user.save()

    await createAuditLog({
      user: req.user._id,
      action: 'UPDATE',
      resource: 'User',
      resourceId: user._id,
      details: { changes },
      req,
    })

    const responseData = user.toJSON()
    responseData.twoFactorEnabled = user.twoFactorEnabled

    res.json({ success: true, user: responseData })
  } catch (error) {
    console.error('[users] updateUser error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Failed to update user.' })
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete a super admin.' })
    }

    const userEmail = user.email
    const userId = user._id
    await User.findByIdAndDelete(userId)

    await createAuditLog({
      user: req.user._id,
      action: 'DELETE',
      resource: 'User',
      resourceId: userId,
      details: { email: userEmail },
      req,
    })

    res.json({ success: true, message: 'User deleted successfully.' })
  } catch (error) {
    console.error('[users] deleteUser error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete user.' })
  }
}

async function updateMe(req, res) {
  try {
    const allowed = ['name', 'displayName', 'phone', 'bio', 'location', 'socialLinks', 'avatar', 'theme']
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' })

    const changes = []

    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        if (field === 'socialLinks' && typeof req.body.socialLinks === 'object') {
          Object.assign(user.socialLinks, req.body.socialLinks)
        } else if (field === 'name' || field === 'displayName' || field === 'phone' || field === 'location') {
          user[field] = String(req.body[field]).trim()
        } else {
          user[field] = req.body[field]
        }
        changes.push(field)
      }
    }

    if (req.body.currentPassword && req.body.password) {
      const isMatch = await user.comparePassword(req.body.currentPassword)
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' })
      }
      user.password = req.body.password
      changes.push('password')
    }

    if (changes.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update.' })
    }

    await user.save()

    await createAuditLog({
      user: req.user._id,
      action: 'UPDATE',
      resource: 'User',
      resourceId: user._id,
      details: { updatedFields: changes },
      req,
    })

    const json = user.toJSON()
    res.json({ success: true, user: json, message: 'Profile updated successfully.' })
  } catch (error) {
    console.error('[users] updateMe error:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already in use.' })
    }
    res.status(500).json({ success: false, message: 'Failed to update profile.' })
  }
}

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, updateMe }
