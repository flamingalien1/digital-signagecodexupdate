/* eslint-disable multiline-comment-style */
const express = require('express')
const next = require('next')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const { Server: SocketIoServer } = require('socket.io')

const Keys = require('./keys')

const dev = Keys.ENVIRON !== 'PROD'
const app = next({ dev })
const handle = app.getRequestHandler()

const apiRoutes = require('./api/routes')
const { User } = require('./db')

const logDirectory = path.join(__dirname, 'logs')
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' }
)
const errorLogStream = fs.createWriteStream(
  path.join(logDirectory, 'error.log'),
  { flags: 'a' }
)

process.on('unhandledRejection', err => {
  const message = `${new Date().toISOString()} UnhandledRejection: ${err.stack}\n`
  errorLogStream.write(message)
  console.error(message)
})

process.on('uncaughtException', err => {
  const message = `${new Date().toISOString()} UncaughtException: ${err.stack}\n`
  errorLogStream.write(message)
  console.error(message)
  process.exit(1)
})

app
  .prepare()
  .then(() => {
    const server = express()

    if (dev) {
      server.use(morgan('dev'))
    }
    server.use(morgan('combined', { stream: accessLogStream }))

    // Allows for cross origin domain request:
    server.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })

    // Database
    if (!Keys.USE_FILE_DB) {
      mongoose.Promise = Promise
      mongoose.connect(Keys.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      const db = mongoose.connection
      db.on('error', console.error.bind(console, 'connection error:'))
    }

    // Parse application/x-www-form-urlencoded
    server.use(bodyParser.urlencoded({ extended: false }))
    // Parse application/json
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))
    // Parse cookies
    server.use(cookieParser())
    // Sessions
    server.use(
      session({
        secret: Keys.SESSION_SECRET,
        resave: true,
        saveUninitialized: false
      })
    )

    // Passport
    if (!Keys.USE_FILE_DB) {
      passport.use(User.createStrategy())
      passport.serializeUser(User.serializeUser())
      passport.deserializeUser(User.deserializeUser())
      server.use(passport.initialize())
      server.use(passport.session())
    }

    let io
    server.use(function(req, res, next) {
      res.io = io
      next()
    })

    // API routes
    server.use('/api/v1', apiRoutes)

    // Static routes
    server.use('/uploads', express.static('uploads'))

    // Error logger
    server.use(function(err, req, res) {
      const message = `${new Date().toISOString()} ${err.stack}\n`
      errorLogStream.write(message)
      console.error(message)
      res.status(err.status || 500).json({ error: err.message })
    })

    // Next.js routes
    server.get('*', (req, res) => {
      return handle(req, res)
    })

    const finalServer = server.listen(Keys.PORT, err => {
      if (err) throw err
      // eslint-disable-next-line
      console.log('> Ready on http://localhost:' + Keys.PORT)
    })

    // Socket.io
    io = new SocketIoServer(finalServer)
  })
  .catch(ex => {
    // eslint-disable-next-line
    console.error(ex.stack)
    process.exit(1)
  })
