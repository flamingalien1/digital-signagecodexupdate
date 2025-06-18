const boxen = require('boxen')
const dotenv = process.env.ENVIRON !== 'HEROKU' ? require('dotenv').config() : { parsed: {} }

if (dotenv.error) {
  console.error(
    `Welcome to digital-signage!\n
You have not configured your installation yet, please run the setup utility by executing:\n` +
      boxen('$   npm run setup', { padding: 1, margin: 1, borderStyle: 'double' })
  )
  process.exit()
}

const PORT = process.env.PORT || dotenv.parsed.PORT || 3001
const ENVIRON = process.env.ENVIRON || dotenv.parsed.ENVIRON || 'DEV'
const HOST_URL = process.env.SERVER_HOST || dotenv.parsed.SERVER_HOST || 'http://localhost:3000/'
const USE_FILE_DB = (process.env.USE_FILE_DB || dotenv.parsed.USE_FILE_DB || 'true') === 'true'

module.exports = {
  ENVIRON,
  PORT,
  HOST_URL,
  USE_FILE_DB
}
