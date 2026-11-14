
let fs = require('fs')

// BOT OWNER
global.owner = ['923373730931']

// MODERATORS & PREMIUM USERS
global.mods = JSON.parse(fs.readFileSync('./src/moderator.json'))
global.prems = JSON.parse(fs.readFileSync('./src/premium.json'))

// API PREFIXES
global.APIs = {
  bx: 'https://bx-hunter.herokuapp.com',
  amel: 'https://melcanz.com',
  hardianto: 'https://hardianto-chan.herokuapp.com',
  jonaz: 'https://jonaz-api-v2.herokuapp.com',
  neoxr: 'https://neoxr-api.herokuapp.com',
  nrtm: 'https://nurutomo.herokuapp.com',
  pencarikode: 'https://pencarikode.xyz',
  xteam: 'https://api.xteam.xyz',
  lolhum: 'https://api.lolhuman.xyz',
  zahir: 'https://zahirr-web.herokuapp.com',
  zekais: 'http://zekais-api.herokuapp.com',
  zeks: 'https://api.zeks.xyz'
}

// API KEYS
global.APIKeys = {
  // Add valid API keys privately here.
}

// STICKER WATERMARK
global.packname = 'HaSSaN BrOvHi MD BoT'
global.author = 'Hassan Brovhi'

// BRANDING
global.botname = 'HaSSaN BrOvHi MD BoT'
global.ownername = 'Hassan Brovhi'

global.fla = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=fluffy-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='

global.wait = '_*Please wait...*_'
global.eror = '*_Something went wrong_*'

global.tle = 'https://telegra.ph/file/ecb8f7d2c12d075fc4729.jpg'

global.multiplier = 69

// AUTO RELOAD CONFIG
let chalk = require('chalk')
let file = require.resolve(__filename)

fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Updated 'config.js'"))
  delete require.cache[file]
  require(file)
})
