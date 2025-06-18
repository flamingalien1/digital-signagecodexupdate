const fs = require('fs')
const { spawnSync } = require('child_process')

if (!fs.existsSync('.env')) {
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  spawnSync(cmd, ['makeconf'], { stdio: 'inherit' })
}
