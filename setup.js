const fs = require('fs')
const { execSync } = require('child_process')

if (!fs.existsSync('.env')) {
  const command = 'npx -y makeconf'
  execSync(command, { stdio: 'inherit', shell: true })
}
