
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const packageInfo = require('./package.json')
const CFonts = require('cfonts')

console.log('[HaSSaN BrOvHi MD BoT]')

CFonts.say('HaSSaN\nBrOvHi MD BoT', {
  colors: ['#ff33cc'],
  font: 'block',
  align: 'center'
})

CFonts.say(`'${packageInfo.name}' By Hassan Brovhi`, {
  colors: ['#ff33cc'],
  font: 'console',
  align: 'center'
})

let isRunning = false

function start(file) {
  if (isRunning) return

  isRunning = true

  const args = [
    path.join(__dirname, file),
    ...process.argv.slice(2)
  ]

  const child = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  })

  child.on('message', message => {
    console.log('[RECEIVED]', message)

    switch (message) {
      case 'reset':
        child.kill()
        break

      case 'uptime':
        child.send(process.uptime())
        break
    }
  })

  child.on('exit', code => {
    isRunning = false

    console.log('Exited with code:', code)

    if (code === 0) return

    fs.watchFile(args[0], () => {
      fs.unwatchFile(args[0])
      start(file)
    })
  })

  child.on('error', error => {
    isRunning = false
    console.error('Startup error:', error)
  })
}

start('main.js')
