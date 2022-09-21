const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()
    
    let cmds = []
    let pages = []
    for(var key in client.l){
      let page = []
      let desc = ''
      let usage = ''
      if(key === "gen" || key === "events"){}
      else{
        page.push(client.l[key].title)
        for(var key2 in client.l[key]){
          if(client.l[key][key2].usage){usage = ` ${client.l[key][key2].usage}`}
          else{usage = ''}
          if(key2 != 'footer' && key2 != 'title' && key2 != 'err' && key2 != 'config'
            && key2 != 'onlyInTicketChannel' && key2 != 'onlyInClosedTicketChannel'
            && key2 != 'cantPunish') {
            cmds.push(key2)

            desc += `\`${client.config.prefix}${key2}${usage}\` ➜ ${client.l[key][key2].desc}\n`
          }
          
        }
        page.push(desc)
        pages.push(page)
      }
    }

    let cats = ['economy', 'fun', 'giveaways', 'levels', 'moderation', 'music', 'tickets', 'utilities', 'management']
    if(cats.includes(args[0])){

      let page = undefined

      if(args[0] === 'economy') page = pages[0]
      if(args[0] === 'fun') page = pages[1]
      if(args[0] === 'music') page = pages[2]
      if(args[0] === 'giveaways') page = pages[3]
      if(args[0] === 'levels') page = pages[4]
      if(args[0] === 'tickets') page = pages[5]
      if(args[0] === 'moderation') page = pages[6]
      if(args[0] === 'utilities') page = pages[7]
      if(args[0] === 'management') page = pages[8]

      let embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)            
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
        .setTitle(`${client.l.utilities.help.help.replace('%SERVERNAME%', client.config.serverName)} - ${page[0]}`)
        .setDescription(page[1])
      message.channel.send(embed)
      return
    }


    if(cmds.includes(args[0])){
      let getAliases = function(){ 
        let aliases = client.cmds[args[0]].aliases
        if(aliases) return `\`${aliases.join(`\`, \``)}\``
        else return 'None'
      }
      let getRoles = function(){ 
        let roles = client.cmds[args[0]].permissions
        let perms = ``
        if(roles) {
          roles.forEach(rol => perms += `${client.findRole(rol)}`)
          return perms
        }
        else return `${client.findRole('@everyone')}`
      }
      let getUsage = function(){
          for (var key in client.l) {
              if(client.l[key][args[0]] && client.l[key][args[0]].usage){
                  return ` ${client.l[key][args[0]].usage}`
              }
          }
          return  ``
      }
      let getDesc = function(){
          for (var key in client.l) {
              if(client.l[key][args[0]] && client.l[key][args[0]].desc){
                  return client.l[key][args[0]].desc
              }
          }
          return `none set`
      }
    
      let embed = new Discord.MessageEmbed()
        .setTitle(`${client.l.utilities.help.cmdInfo} \`${args[0]}\``)
        .setColor(client.config.colour)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
        .setDescription(`
            ${client.l.utilities.help.cmdName} ${args[0]}
            ${client.l.utilities.help.cmdDesc} ${getDesc()}
            ${client.l.utilities.help.cmdUsage} \`${client.config.prefix}${args[0]}${getUsage()}\`
            ${client.l.utilities.help.cmdAliases} ${getAliases()}
            ${client.l.utilities.help.cmdRoles} ${getRoles()}           
        `)
      message.channel.send(embed)
      return
    }

    if(client.config.helpMenuType === "pages"){

      let page = -1

      let embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)            
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
        .setTitle(client.l.utilities.help.help.replace('%SERVERNAME%', client.config.serverName))
        .setDescription(`${client.l.utilities.help.react}\n
        💰 ➜ ${client.l.utilities.help.reactions.economy}
        🎲 ➜ ${client.l.utilities.help.reactions.fun}
        🎉 ➜ ${client.l.utilities.help.reactions.giveaways}
        🔢 ➜ ${client.l.utilities.help.reactions.levels}
        🔒 ➜ ${client.l.utilities.help.reactions.moderation}
        🎵 ➜ ${client.l.utilities.help.reactions.music}
        🎟️ ➜ ${client.l.utilities.help.reactions.tickets}
        📋 ➜ ${client.l.utilities.help.reactions.utilities}
        ⚙️ ➜ ${client.l.utilities.help.reactions.management}\n
        \`${client.config.prefix}help ${client.l.utilities.help.usage}\`
        `)

      message.channel.send(embed).then(msg => {
        msg.react('◀️').then(r => {
            msg.react('▶️')

            const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id
            const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id

            const backwards = msg.createReactionCollector(backwardsFilter, {time: 600000})
            const forwards = msg.createReactionCollector(forwardsFilter, {time: 600000})

            function changePage(pages, page, embed, r){
              r.users.remove(message.author)
              embed.setTitle(pages[page][0])
              embed.setDescription(pages[page][1])
              msg.edit(embed)
            }

            backwards.on('collect', r => {
              r.users.remove(message.author)
              if(page === 0) return
              page--
              changePage(pages, page, embed, r)
            })
            forwards.on('collect', r => {
              r.users.remove(message.author)
              if(page === 7) return
              page++
              changePage(pages, page, embed, r)
            })

        })
      })
      return
    }

    const embed = new Discord.MessageEmbed()
      .setColor(client.config.colour)            
      .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
      .setTitle(client.l.utilities.help.help.replace('%SERVERNAME%', client.config.serverName))
      .setDescription(`${client.l.utilities.help.react}\n
💰 ➜ ${client.l.utilities.help.reactions.economy}
🎲 ➜ ${client.l.utilities.help.reactions.fun}
🎉 ➜ ${client.l.utilities.help.reactions.giveaways}
🔢 ➜ ${client.l.utilities.help.reactions.levels}
🔒 ➜ ${client.l.utilities.help.reactions.moderation}
🎵 ➜ ${client.l.utilities.help.reactions.music}
🎟️ ➜ ${client.l.utilities.help.reactions.tickets}
📋 ➜ ${client.l.utilities.help.reactions.utilities}
⚙️ ➜ ${client.l.utilities.help.reactions.management}\n
\`${client.config.prefix}help ${client.l.utilities.help.usage}\`
`)

    message.channel.send(embed).then(msg => {

        msg.react('💰').then(r => {
        msg.react('🎲').then(r => {
        msg.react('🎉').then(r => {
        msg.react('🔢').then(r => {
        msg.react('🔒').then(r => {
        msg.react('🎵').then(r => {
        msg.react('🎟️').then(r => {
        msg.react('📋').then(r => {
        msg.react('⚙️').then(r => {

          const economyFilter = (reaction, user) => reaction.emoji.name === '💰' && user.id === message.author.id
          const funFilter = (reaction, user) => reaction.emoji.name === '🎲' && user.id === message.author.id
          const giveawaysFilter = (reaction, user) => reaction.emoji.name === '🎉' && user.id === message.author.id
          const levelFilter = (reaction, user) => reaction.emoji.name === '🔢' && user.id === message.author.id
          const moderationFilter = (reaction, user) => reaction.emoji.name === '🔒' && user.id === message.author.id
          const musicFilter = (reaction, user) => reaction.emoji.name === '🎵' && user.id === message.author.id
          const ticketsFilter = (reaction, user) => reaction.emoji.name === '🎟️' && user.id === message.author.id
          const utilitiesFilter = (reaction, user) => reaction.emoji.name === '📋' && user.id === message.author.id
          const managementFilter = (reaction, user) => reaction.emoji.name === '⚙️' && user.id === message.author.id

          let myTime = 600000

          const economy = msg.createReactionCollector(economyFilter, {time: myTime })
          const fun = msg.createReactionCollector(funFilter, {time: myTime })
          const giveaways = msg.createReactionCollector(giveawaysFilter, {time: myTime })
          const level = msg.createReactionCollector(levelFilter, {time: myTime })
          const moderation = msg.createReactionCollector(moderationFilter, {time: myTime })
          const music = msg.createReactionCollector(musicFilter, {time: myTime })
          const tickets = msg.createReactionCollector(ticketsFilter, {time: myTime })
          const utilitites = msg.createReactionCollector(utilitiesFilter, {time: myTime })
          const managment = msg.createReactionCollector(managementFilter, {time: myTime })

          function changePage(pages, page, embed, r){
            r.users.remove(message.author)
            embed.setTitle(pages[page][0])
            embed.setDescription(pages[page][1])
            msg.edit(embed)
          }

          economy.on('collect', r => {changePage(pages, 0, embed, r)})
          fun.on('collect', r => {changePage(pages, 1, embed, r)})
          giveaways.on('collect', r => {changePage(pages, 3, embed, r)})
          level.on('collect', r => {changePage(pages, 4, embed, r)})
          moderation.on('collect', r => {changePage(pages, 6, embed, r)})
          music.on('collect', r => {changePage(pages, 2, embed, r)})
          tickets.on('collect', r => {changePage(pages, 5, embed, r)})
          utilitites.on('collect', r => {changePage(pages, 7, embed, r)})
          managment.on('collect', r => {changePage(pages, 8, embed, r)})

      }) }) }) }) }) }) }) }) }) })
}

// © Zeltux Discord Bot | Do Not Copy