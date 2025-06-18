const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const { User } = require('../../db')

router.get('/demo', async function(req, res) {
  const existing = await User.findOne({ username: 'demo' })
  if (!existing) {
    await User.create({ username: 'demo', password: await bcrypt.hash('demo', 10) })
  }
  res.redirect('/')
})

router.post('/login', async function(req, res) {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.status(401).json({ success: false })
  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({ success: false })
  res.cookie('loggedIn', true, { httpOnly: false })
  res.json({ success: true })
})

router.get('/logout', (req, res) => {
  res.clearCookie('loggedIn')
  res.redirect('/login')
})

module.exports = router
