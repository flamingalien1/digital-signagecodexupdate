const fs = require('fs')
const { execSync } = require('child_process')

if (!fs.existsSync('.env')) {
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env')
    // eslint-disable-next-line no-console
    console.log('Created .env from .env.example')
  } else {
    const command = 'npx -y makeconf'
    execSync(command, { stdio: 'inherit', shell: true })
  }
}
