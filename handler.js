let util = require('util')
let fetch = require('node-fetch')
let simple = require('./lib/simple')
const uploadImage = require('./lib/uploadImage')
let { MessageType } = require('@adiwajshing/baileys')

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
  async handler(chatUpdate) {
    if (!chatUpdate.hasNewMessage) return
    if (!chatUpdate.messages && !chatUpdate.count) return
    let m = chatUpdate.messages.all()[0]
    try {
      simple.smsg(this, m)
      switch (m.mtype) {
        case MessageType.image:
        case MessageType.video:
        case MessageType.audio:
          if (!m.key.fromMe) await delay(1000)
          if (!m.msg.url) await this.updateMediaMessage(m)
          break
      }
      m.exp = 0
      m.limit = false
      try {
        let user = global.db.data.users[m.sender]
        if (typeof user !== 'object') global.db.data.users[m.sender] = {}
        if (user) {
          if (!isNumber(user.exp)) user.exp = 0
          if (!isNumber(user.limit)) user.limit = 10
          if (!isNumber(user.money)) user.money = 0
          if (!isNumber(user.lastclaim)) user.lastclaim = 0
          if (!isNumber(user.diamond)) user.diamond = 0
          if (!isNumber(user.iron)) user.iron = 0
          if (!isNumber(user.common)) user.common = 0
          if (!isNumber(user.uncommon)) user.uncommon = 0      
          if (!isNumber(user.mythic)) user.mythic = 0
          if (!isNumber(user.legendary)) user.legendary = 0
          if (!isNumber(user.pet)) user.pet = 0
          if (!isNumber(user.potion)) user.potion = 0
          if (!isNumber(user.sampah)) user.sampah = 0
          if (!isNumber(user.armor)) user.armor = 0
          if (!isNumber(user.kucing)) user.kucing = 0
          if (!isNumber(user.kucinglastclaim)) user.kucinglastclaim = 0
          if (!isNumber(user.kuda)) user.kuda = 0
          if (!isNumber(user.kudalastclaim)) user.kudalastclaim = 0
          if (!isNumber(user.rubah)) user.rubah = 0
          if (!isNumber(user.rubahlastclaim)) user.rubahlastclaim = 0
          if (!isNumber(user.anjing)) user.anjing = 0
          if (!isNumber(user.anjinglastclaim)) user.anjinglastclaim = 0
          if (!('registered' in user)) user.registered = false
          if (!user.registered) {
            if (!('name' in user)) user.name = this.getName(m.sender)
            if (!isNumber(user.age)) user.age = -1
            if (!isNumber(user.regTime)) user.regTime = -1
          }
          if (!isNumber(user.afk)) user.afk = -1
          if (!('afkReason' in user)) user.afkReason = ''
          if (!('banned' in user)) user.banned = false
          if (!isNumber(user.level)) user.level = 0
          if (!isNumber(user.call)) user.call = 0
          if (!user.role) user.role = 'Bronze'
          if (!('autolevelup' in user)) user.autolevelup = false
          if (!isNumber(user.pc)) user.pc = 0
          if (!isNumber(user.warning)) user.warning = 0
          if (!('pasangan' in user)) user.pasangan = ''
        } else global.db.data.users[m.sender] = {
          exp: 0, money: 0, limit: 10, lastclaim: 0, registered: false,
          name: this.getName(m.sender), age: -1, regTime: -1, afk: -1, afkReason: '',
          banned: false, level: 0, call: 0, role: 'Bronze', autolevelup: false, pc: 0, warning: 0, pasangan: '',
        }

        let chat = global.db.data.chats[m.chat]
        if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
        if (chat) {
          if (!('isBanned' in chat)) chat.isBanned = false
          if (!('welcome' in chat)) chat.welcome = false
          if (!('detect' in chat)) chat.detect = false
          if (!('sWelcome' in chat)) chat.sWelcome = ''
          if (!('sBye' in chat)) chat.sBye = ''
          if (!('sPromote' in chat)) chat.sPromote = ''
          if (!('sDemote' in chat)) chat.sDemote = ''
          if (!('descUpdate' in chat)) chat.descUpdate = true
          if (!('stiker' in chat)) chat.stiker = false
          if (!('delete' in chat)) chat.delete = false
          if (!('antiLink' in chat)) chat.antiLink = false
          if (!isNumber(chat.expired)) chat.expired = 0
          if (!('antiBadword' in chat)) chat.antiBadword = true
        } else global.db.data.chats[m.chat] = {
          isBanned: false, welcome: false, detect: false, sWelcome: '', sBye: '', sPromote: '', sDemote: '',
          descUpdate: true, stiker: false, delete: false, antiLink: false, expired: 0, antiBadword: true,
        }

        let settings = global.db.data.settings
        if (typeof settings !== 'object') global.db.data.settings = {}
        if (settings) {
          if (!('anon' in settings)) settings.anon = true
          if (!('anticall' in settings)) settings.anticall = true
          if (!('antispam' in settings)) settings.antispam = true
          if (!('antitroli' in settings)) settings.antitroli = true
          if (!('backup' in settings)) settings.backup = false
          if (!isNumber(settings.backupDB)) settings.backupDB = 0
          if (!('groupOnly' in settings)) settings.groupOnly = false
          if (!('jadibot' in settings)) settings.jadibot = false
          if (!('nsfw' in settings)) settings.nsfw = true
          if (!isNumber(settings.status)) settings.status = 0
        } else global.db.data.settings = {
          anon: true, anticall: true, antispam: true, antitroli: true,
          backup: false, backupDB: 0, groupOnly: false, jadibot: false, nsfw: true, status: 0,
        }
      } catch (e) { console.error(e) }
      
      if (opts['nyimak']) return
      if (!m.fromMe && opts['self']) return
      if (typeof m.text !== 'string') m.text = ''
      for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin) continue
        if (plugin.disabled) continue
        if (!plugin.all) continue
        if (typeof plugin.all !== 'function') continue
        try { await plugin.all.call(this, m, chatUpdate) } catch (e) { if (typeof e === 'string') continue; console.error(e) }
      }
      
      if (m.isBaileys) return
      if (m.chat.endsWith('broadcast')) return 
      let blockList = conn.blocklist.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)
      if (blockList.includes(m.sender)) return 

      m.exp += Math.ceil(Math.random() * 10)

      let usedPrefix
      let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

      let isROwner = [global.conn.user.jid, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
      let isOwner = isROwner || m.fromMe
      let isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
      let isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
      if (!isPrems && !m.isGroup && global.db.data.settings.groupOnly) return
      let groupMetadata = m.isGroup ? this.chats.get(m.chat).metadata || await this.groupMetadata(m.chat) : {} || {}
      let participants = m.isGroup ? groupMetadata.participants : [] || []
      let user = m.isGroup ? participants.find(u => u.jid == m.sender) : {}
      let bot = m.isGroup ? participants.find(u => u.jid == this.user.jid) : {}
      let isAdmin = user.isAdmin || user.isSuperAdmin || false
      let isBotAdmin = bot.isAdmin || bot.isSuperAdmin || false
      let isBlocked = this.blocklist.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != this.user.jid).includes(m.sender)
      
      for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin) continue
        if (plugin.disabled) continue
        if (!opts['restrict']) if (plugin.tags && plugin.tags.includes('admin')) continue
        if (!opts['nsfw']) if (plugin.tags && plugin.tags.includes('nsfw')) continue
        const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
        let match = (_prefix instanceof RegExp ? 
          [[_prefix.exec(m.text), _prefix]] :
          Array.isArray(_prefix) ? 
            _prefix.map(p => {
              let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
              return [re.exec(m.text), re]
            }) :
            typeof _prefix === 'string' ? 
              [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
              [[[], new RegExp]]
        ).find(p => p[1])
        
        if (typeof plugin.before === 'function') if (await plugin.before.call(this, m, { match, conn: this, participants, groupMetadata, user, bot, isROwner, isOwner, isAdmin, isBotAdmin, isPrems, chatUpdate, isBlocked })) continue
        if (typeof plugin !== 'function') continue
        
        if ((usedPrefix = (match[0] || '')[0])) {
          let noPrefix = m.text.replace(usedPrefix, '')
          let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
          args = args || []
          let _args = noPrefix.trim().split` `.slice(1)
          let text = _args.join` `
          command = (command || '').toLowerCase()
          let fail = plugin.fail || global.dfail 
          let isAccept = plugin.command instanceof RegExp ? 
            plugin.command.test(command) :
            Array.isArray(plugin.command) ? 
              plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
              typeof plugin.command === 'string' ? plugin.command === command : false

          if (!isAccept) continue
          m.plugin = name
          if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
            let chat = global.db.data.chats[m.chat]
            let user = global.db.data.users[m.sender]
            if (!['unbanchat.js', 'profile.js'].includes(name) && chat && chat.isBanned && !isPrems) return
            if (!['unbanchat.js', 'profile.js'].includes(name) && user && user.banned) return
          }
          if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { fail('owner', m, this); continue }
          if (plugin.rowner && !isROwner) { fail('rowner', m, this); continue }
          if (plugin.owner && !isOwner) { fail('owner', m, this); continue }
          if (plugin.mods && !isMods) { fail('mods', m, this); continue }
          if (plugin.premium && !isPrems) { fail('premium', m, this); continue }
          if (plugin.group && !m.isGroup) { fail('group', m, this); continue } 
          else if (plugin.botAdmin && !isBotAdmin) { fail('botAdmin', m, this); continue } 
          else if (plugin.admin && !isAdmin) { fail('admin', m, this); continue }
          if (plugin.private && m.isGroup) { fail('private', m, this); continue }
          if (plugin.register == true && _user.registered == false) { fail('unreg', m, this); continue }
          if (plugin.nsfw && !global.db.data.settings.nsfw) { fail('nsfw', m, this); continue }

          m.isCommand = true
          let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17
          if (xp > 200) m.reply('Ngecit -_-')
          else m.exp += xp
          if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
            this.reply(m.chat, `Limit kamu habis, silahkan beli melalui *${usedPrefix}buy*`, m)
            continue 
          }
          if (plugin.level > _user.level) {
            this.reply(m.chat, `diperlukan level ${plugin.level} untuk menggunakan perintah ini. Level kamu ${_user.level}`, m)
            continue
          }
          let extra = {
            match, usedPrefix, noPrefix, _args, args, command, text, conn: this, participants, groupMetadata, user, bot, isROwner, isOwner, isAdmin, isBotAdmin, isPrems, chatUpdate, isBlocked,
          }
          try {
            await plugin.call(this, m, extra)
            if (!isPrems) m.limit = m.limit || plugin.limit || false
          } catch (e) {
            m.error = e
            console.error(e)
            if (e) {
              let text = util.format(e)
              for (let key of Object.values(global.APIKeys))
                text = text.replace(new RegExp(key, 'g'), 'apikey')
              m.reply(text)
            }
          } finally {
            if (typeof plugin.after === 'function') {
              try { await plugin.after.call(this, m, extra) } catch (e) { console.error(e) }
            }
          }
          break
        }
      }
    } finally {
      let user, stats = global.db.data.stats
      if (m) {
        if (m.sender && (user = global.db.data.users[m.sender])) {
          user.exp += m.exp
          user.limit -= m.limit * 1
        }

        let stat
        if (m.plugin) {
          let now = + new Date
          if (m.plugin in stats) {
            stat = stats[m.plugin]
            if (!isNumber(stat.total)) stat.total = 1
            if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
            if (!isNumber(stat.last)) stat.last = now
            if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
          } else stat = stats[m.plugin] = {
            total: 1,
            success: m.error != null ? 0 : 1,
            last: now,
            lastSuccess: m.error != null ? 0 : now
          }
          stat.total += 1
          stat.last = now
          if (m.error == null) {
            stat.success += 1
            stat.lastSuccess = now
          }
        }
      }
      try { require('./lib/print')(m, this) } catch (e) { console.log(m, m.quoted, e) }
      if (opts['autoread']) await this.chatRead(m.chat).catch(() => { })
    }
  },
  
  // 👇 WELCOME / GOODBYE FIXED (No Dead API)
  async participantsUpdate({ jid, participants, action }) {
    let chat = global.db.data.chats[jid] || {}
    let text = ''
    switch (action) {
      case 'add':
      case 'remove':
        if (chat.welcome) {
          let groupMetadata = await this.groupMetadata(jid)
          for (let user of participants) {
            try {
              text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || '👋 Welcome @user to *@subject*!') :
                (chat.sBye || this.bye || conn.bye || '👋 @user left the group.')).replace('@subject', this.getName(jid)).replace('@desc', groupMetadata.desc || '')
              
              text = text.replace(/@user/g, '@' + user.split`@`[0])
              
              // Direct text message bhej rahe hain (No API crash)
              this.sendMessage(jid, text, MessageType.extendedText, {
                contextInfo: { mentionedJid: [user] }
              })
            } catch (e) {
                console.log('Welcome Error:', e)
            }
          }
        }
        break
      case 'promote':
        text = (chat.sPromote || this.spromote || conn.spromote || '👑 @user is now Admin!')
      case 'demote':
        if (!text) text = (chat.sDemote || this.sdemote || conn.sdemote || '🤡 @user is no longer Admin.')
        text = text.replace('@user', '@' + participants[0].split`@`[0])
        if (chat.detect) this.sendMessage(jid, text, MessageType.extendedText, {
          contextInfo: { mentionedJid: this.parseMention(text) }
        })
        break
    }
  },

  // 👇 ANTI-DELETE FIXED (English Message)
  async delete(m) {
    if (m.key.fromMe) return
    let chat = global.db.data.chats[m.key.remoteJid]
    if (chat && chat.delete) return
    await this.sendButton(m.key.remoteJid, `
🚨 *ANTI-DELETE DETECTED!*

@${m.participant.split`@`[0]} just deleted a message. 
I have saved it for you boss! 😎

_Type *.on delete* to turn off this feature._
`.trim(), '', 'TURN OFF ANTI-DELETE', ',on delete', {
      quoted: m.message,
      contextInfo: { mentionedJid: [m.participant] }
    })
    this.copyNForward(m.key.remoteJid, m.message).catch(e => console.log(e, m))
  },

  // 👇 ANTI-CALL FIXED (English Message)
  async onCall(json) {
    let { from } = json[2][0][1]
    let users = global.db.data.users
    let user = users[from] || {}
    if (user.whitelist) return
    if (!global.db.data.settings.anticall) return
    switch (this.callWhitelistMode) {
      case 'mycontact':
        if (from in this.contacts && 'short' in this.contacts[from]) return
        break
    }
    user.call = (user.call || 0) + 1
    await this.reply(from, `⚠️ *Do not call the bot!*\n\nThis is your warning: ${user.call}/2\nIf you call again, you will be blocked.`, null)
    if (user.call >= 2) {
      await this.blockUser(from, 'add')
      user.call = 0
    }
  },

  // 👇 GROUP DESC UPDATE (English Message)
  async GroupUpdate({ jid, desc, descId, descTime, descOwner, announce }) {
    if (!global.db.data.chats[jid] || !global.db.data.chats[jid].descUpdate) return
    else {
      let caption = `
📢 @${descOwner.split`@`[0]} has changed the group description.

📝 *New Description:*
${desc}

_Type *.off desc* to turn off this feature._
      `.trim()
      this.sendButton(jid, caption, '', 'TURN OFF DESCRIPTION ALERT', ',off desc', { contextInfo: { mentionedJid: this.parseMention(caption) } })
    }
  }
            }
