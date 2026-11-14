let fs = require('fs')

// 👇 Aapka WhatsApp Number (Country code ke sath, bina + ke)
global.owner = ['923373730931'] 

global.mods = JSON.parse(fs.readFileSync('./src/moderator.json')) // Trusted users
global.prems = JSON.parse(fs.readFileSync('./src/premium.json')) // Premium users (No limit)

global.APIs = { 
  // API Prefixes
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
  zeks: 'https://api.zeks.xyz',
}

global.APIKeys = { 
  'https://bx-hunter.herokuapp.com': 'Ikyy69',
  'https://melcanz.com': 'lugay',
  'https://hardianto-chan.herokuapp.com': 'hardianto',
  'https://neoxr-api.herokuapp.com': 'yntkts',
  'https://pencarikode.xyz': 'pais',
  'https://api.xteam.xyz': 'memeki',
  'https://api.lolhuman.xyz': 'windaj',
  'https://zahirr-web.herokuapp.com': 'zahirgans',
  'https://zekai-api.herokuapp.com': 'komtolofon',
  'https://api.zeks.xyz': 'apivinz',
}

// 🎨 Sticker Watermark & Bot Branding
global.packname = 'HaSSaN BrOvHi MD BoT'
global.author = 'HaSSaN BrOvHi'

// ✨ Text Messages
global.wait = '_*Processing... Please Wait*_'
global.eror = '*_Server Error*_'

// 🖼️ Thumbnail Image
global.tle = 'https://i.imgur.com/oeMC33b.jpeg' 

global.multiplier = 69 

let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
