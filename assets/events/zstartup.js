const fs = require("fs")
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')
const Discord = require("discord.js")
const { createCipher } = require("crypto")
const func = require(`${process.cwd()}/assets/utils/functions`)

module.exports = {

    securityevent: function(client, guild){
      if(client.config.setup.serverID !== guild.id) {
        guild.leave()
        console.log(`\x1b[41mSECURITY\x1b[40m \x1b[31mWe detected that someone tried to invite your bot to another server (${guild.id}), so Zeltux automatically left it.\u001b[0m`)
        console.log(`\x1b[41mSECURITY\x1b[40m \x1b[31mYou may need to restart the bot to ensure Zeltux has left unauthorised servers and the bot runs smoothly again.\u001b[0m`)
        console.log(`\x1b[41mSECURITY\x1b[40m \x1b[31mThere are probably errors below this notice, restart the bot and Zeltux will run fine again.\u001b[0m`)
        return
      }
    },
    startupmessage: function(client) {
        console.log(`\u001b[0m`)
        console.log(`\x1b[42mINFO\x1b[40m \x1b[30m\x1b[32mStarting...\x1b[37m\u001b[0m`)
        console.log(`\u001b[0m`)
        console.log(`\x1b[31m        __________     .__   __                      `)
        console.log(`\x1b[31m        \\____    /____ |  |_/  |_ __ _____  ___      `)
        console.log(`\x1b[31m          /     // __ \\|  |\\   __\\  |  \\  \\/  /      `)
        console.log(`\x1b[31m         /     /\\  ___/|  |_|  | |  |  />    <       `)
        console.log(`\x1b[31m        /_______ \\___  >____/__| |____//__/\\_ \\      `) 
        console.log(`\x1b[31m                \\/   \\ /     \u001b[0mv${require(`${process.cwd()}/package.json`).version}\x1b[31m          \\/      `)
        console.log(`                                                     `)
        console.log(`\x1b[31m                   Created By Matt                   `)
        console.log(`\x1b[31m               Developed By Matt & Azono             `)
        console.log(`\u001b[0m`)
    },
    loadcommands: function(client) {
        const modules = [] 
        fs.readdirSync(`${process.cwd()}/commands/`).forEach(file => {
          modules.push(file)
        })
      
        modules.forEach(async c => {
          
          await fs.readdir(`${process.cwd()}/commands/${c}/`, async (err, files) => {
            if (err) throw err;
      
            if(c === `fun`){if(client.config.enabledFeatures.fun === false) return}
            if(c === `moderation`){if(client.config.enabledFeatures.moderation === false) return}
            if(c === `tickets`){if(client.config.enabledFeatures.support === false) return}
            if(c === `utilities`){if(client.config.enabledFeatures.utilities === false) return}
            if(c === `giveaways`){if(client.config.enabledFeatures.giveaways === false) return}
            if(c === `economy`){if(client.config.enabledFeatures.economy === false) return}
            if(c === `levels`){if(client.config.enabledFeatures.levels === false) return}
      
            console.log(`\x1b[42mINFO\x1b[40m \x1b[33mLoaded \x1b[35mcore \x1b[34m${c}\x1b[33m \x1b[32msuccessfully \u001b[0m`)
            await files.forEach(f => {
              if(!(f.split(".").pop() === "js")) return
              let commandName = f.split(".")[0]
              const props = require(`${process.cwd()}/commands/${c}/${f}`)
              if(c !== "zeltux"){
                props.aliases = []
                props.name = commandName
                props.type = "core"
                if(client.cmds[commandName]){
                  if(client.cmds[commandName].aliases){
                    client.cmds[commandName].aliases.forEach(alias => props.aliases.push(alias))
                  }
                  if(client.cmds[commandName].enabled === true || c === "management"){
                    client.commands.set(commandName, props)
                  }
                }
                else{
                  client.commands.set(commandName, props)
                }
              }
              else{
                client.commands.set(commandName, props)
              }
            })
          })
        })
    },
    loadaddons: function(client) {
        fs.readdir(`${process.cwd()}/addons/`, async (err, files) => {
            await files.forEach((f, i) =>{
              let props = require(`${process.cwd()}/addons/${f}`)
              if(f.split(".").pop() === "js"){
                console.log(`\x1b[42mINFO\x1b[40m \x1b[33mLoaded \x1b[35maddon \x1b[36m${f}\x1b[33m \x1b[32msuccessfully \x1b[37m`)
                
                props.commands.forEach(function(p){
                  p.type = "addon"
                  client.commands.set(p.name, p)
                })
                props.events.forEach(function(p){
                  client.on(p.name, p.run.bind(null, client))
                })
              }
            })
          })
    },
    loadevents: async function(client) {
        fs.readdir(`${process.cwd()}/events/`, (err, files) => {
            if (err) return console.error(err)
            files.forEach(file => {
              const event = require(`${process.cwd()}/events/${file}`)
              let eventName = file.split(".")[0]
                client.on(eventName, event.bind(null, client))              
            })
          })
    },
    database: function(client) {

      // Levels
      const levelTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get()
      if (!levelTable['count(*)']) {
          sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run()
          sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run()
          sql.pragma("synchronous = 1")
          sql.pragma("journal_mode = wal")}
      client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?")
      client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);")
		
	  let dbLogin = "812673"
		
      // Joins
      const joinsTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'joins';").get()
      if (!joinsTable['count(*)']) {
          sql.prepare("CREATE TABLE joins (user TEXT, inviter TEXT);").run()
          sql.pragma("synchronous = 1")
          sql.pragma("journal_mode = wal")}

      // Leaves
      const leavesTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'leaves';").get()
      if (!leavesTable['count(*)']) {
          sql.prepare("CREATE TABLE leaves (user TEXT, inviter TEXT);").run()
          sql.pragma("synchronous = 1")
          sql.pragma("journal_mode = wal")}

      // TicketPanel
      const ticketPanelTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'ticketpanel';").get()
      if (!ticketPanelTable['count(*)']) {
          sql.prepare("CREATE TABLE ticketpanel (id TEXT PRIMARY KEY);").run()
          sql.prepare("CREATE UNIQUE INDEX idx_ticketpanel_id ON ticketpanel (id);").run()
          sql.pragma("synchronous = 1")
          sql.pragma("journal_mode = wal")}

      // Reaction Roles
      const reactionTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'reactionrole';").get()
      if (!reactionTable['count(*)']) {
          sql.prepare("CREATE TABLE reactionrole (message TEXT, reaction TEXT, role TEXT);").run()
          sql.pragma("synchronous = 1")
          sql.pragma("journal_mode = wal")}

      // VerifyPanel
      const verifyTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'verifypanel';").get()
      if (!verifyTable['count(*)']) {
          sql.prepare("CREATE TABLE verifypanel (id TEXT PRIMARY KEY);").run()
          sql.prepare("CREATE UNIQUE INDEX idx_verifypanel_id ON verifypanel (id);").run()
          sql.pragma("synchronous = 1")
          sql.pragma("journal_mode = wal")}

      // Suggestions
      const suggestionTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'suggestions';").get()
      if (!suggestionTable['count(*)']) {
          sql.prepare("CREATE TABLE suggestions (id TEXT PRIMARY KEY);").run()
          sql.prepare("CREATE UNIQUE INDEX idx_suggestions_id ON suggestions (id);").run()
          sql.pragma("synchronous = 1")
          sql.pragma("journal_mode = wal")}

      // Punishments
      const punishmentTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'punishments';").get()
      if (!punishmentTable['count(*)']) {
          sql.prepare("CREATE TABLE punishments (id INT PRIMARY KEY, type TEXT, user TEXT, staff TEXT, duration TEXT, reason TEXT, status TEXT, start TEXT, end TEXT);").run()
          sql.prepare("CREATE UNIQUE INDEX idx_punishments_id ON punishments (id);").run()
          sql.pragma("synchronous = 1")
          sql.pragma("journal_mode = wal")}

      // Tickets
      const ticketsTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'tickets';").get()
      if (!ticketsTable['count(*)']) {
          sql.prepare("CREATE TABLE tickets (channel TEXT, user TEXT, category TEXT, voice TEXT, added TEXT, status TEXT);").run()
          sql.pragma("synchronous = 1")
          sql.pragma("journal_mode = wal")}

  },
  start: async function() {
    const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'], ws: { intents: Discord.Intents.ALL } })

    const startup = require(`${process.cwd()}/assets/events/zstartup`)
    const func = require(`${process.cwd()}/assets/utils/functions`)

    client.config = func.loadFile(`${process.cwd()}/config/config.yml`)
    client.l = func.loadFile(`${process.cwd()}/config/language.yml`)
    client.cmds = func.loadFile(`${process.cwd()}/config/commands.yml`)

    const { GiveawaysManager } = require("discord-giveaways")

    const manager = new GiveawaysManager(client, {storage: "./data/giveaways.json",updateCountdownEvery: 10000,default: {botsCanWin: client.config.giveaways.botsCanWin,
    exemptPermissions: client.config.giveaways.ignoreIfHasPermission,embedColor: client.config.colour,reaction: client.config.giveaways.reaction}})
    client.giveawaysManager = manager

    client.snipes = new Discord.Collection();

    client.active = new Map()
    client.guildInvites = new Map();

    client.findChannel = function(channel){
      var c = client.channels.cache.find(x => x.name === channel)
      theChannel = c
      if(!c){
        var c = client.channels.cache.find(x => x.id === channel)
        theChannel = c
      }
      return theChannel 
    }

    client.findCategory = function(category){
      var c = client.channels.cache.find(x => x.name === category && x.type === 'category')
      theCategory = c
      if(!c){
        var c = client.channels.cache.find(x => x.id === category && x.type === 'category')
        theCategory = c
      }
      return theCategory 
    }

    client.findRole = function(role){
      var r = client.guilds.cache.first().roles.cache.find(x => x.name === role)
      theRole = r
      if(!r){
        var r = client.guilds.cache.first().roles.cache.find(x => x.id === role)
        theRole = r
      }
      return theRole
    }

    var path = require('path')
    client.root = path.resolve(__dirname)

    require('console-stamp')(console,{
      label: false,
      pattern: 'HH:MM:ss',
      colors: {
          stamp: 'white',
      }
    })

    fs.copyFile('./assets/handlers/economy-handler.js', './node_modules/quick.db/bin/handler.js', (err) => {if (err) console.log("Please install the quick.db package.")})
    fs.copyFile('./assets/handlers/Constants.js', './node_modules/discord-giveaways/src/Constants.js', (err) => {if (err) console.log("Please install the discord-giveaways package.")})

    client.on('guildCreate', (guild) => {
      startup.securityevent(client, guild)
    })

    client.on("ready", () => {
      client.guilds.cache.forEach(guild => {
        startup.securityevent(client, guild)
      })
      client.user.setActivity(client.config.statusMessage, {type: client.config.statusType})
      client.dir = __dirname
      client.guilds.cache.forEach(guild => {
          guild.fetchInvites()
              .then(invites => client.guildInvites.set(guild.id, invites))
              .catch(err => console.log(err))
      })
      startup.database(client)

      if (client.config.youtubeUpdatesSystemEnabled === true) {
          let ids = client.config.youtubeChannelIds
          require(`${process.cwd()}/assets/handlers/youtube-updates.js`)(client)
          process.on("unhandledRejection", error => {
            ids.forEach(id => {
                if (error.toString().includes(id))
                      client.log("Youtube Updates", "Could not fetch the channel: " + id)
            })
          })
      } 

    })

    client.commands = new Discord.Collection()

    startup.startupmessage(client)
    startup.loadevents(client)
    startup.loadcommands(client)
    startup.loadaddons(client)

    client.login(client.config.setup.token).then(() => {
      console.log(`\u001b[0m`)
      console.log("\x1b[42mINFO\x1b[40m \x1b[30m\x1b[32mSuccessfully Started.\x1b[37m\u001b[0m")
      console.log(`\u001b[0m`)
    })

  }
}

// © Zeltux Discord Bot | Do Not Copy