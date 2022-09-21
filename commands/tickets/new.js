const Discord = require("discord.js");
const fs = require('fs');
const ticketTranscript = require(`${process.cwd()}/assets/handlers/transcript-handler`)
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/udb.sqlite');

exports.run = async (client, message, args) => {
    
    var reason = args.join(" ")
    if(!(reason == "None Specified")){message.delete()}

    let limitEmbed = new Discord.MessageEmbed()
        .setTitle(client.l.tick.new.limit.replace('%USER%', message.author.username))
        .setColor(client.config.colour)
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    let endFlag = false

    let usersOpenTickets = -1
    await message.guild.channels.cache.forEach(async channel => {
        channel = client.findChannel(channel.id)
        if(channel.name.startsWith("ticket-")){
            try{
                const data = sql.prepare(`SELECT * FROM tickets WHERE channel = '${channel.id}'`).get()
                if(data){
                    if(data.status === 'OPEN'){
                        usersOpenTickets ++
                        console.log(usersOpenTickets)
                    }
                    if(usersOpenTickets >= client.config.maxTicketsPerUser){
                        endFlag = true
                        return
                    }
                }
                else{
                }
            }
            catch{}
        }
    })

    if(endFlag === true) {
        const lim = await message.channel.send(limitEmbed)
        setTimeout(() => {
            lim.delete()
        }, 6000)
        return
    }

    if(!reason) return client.missingArguments(client.command, client.l.tick.new.usage)

    let everyone = message.guild.roles.cache.find(x => x.name === "@everyone");

    message.guild.channels.create(`ticket-${message.author.username}`, {
        type: 'text',
        permissionOverwrites: [{
            id: everyone.id,
            deny: ['VIEW_CHANNEL']
        }]
    }).then(async c => {

        let roles = []
        client.config.canSeeTicket.forEach(role => roles.push(client.findRole(role)))

        flag = false
        roles.forEach(async role => {c.createOverwrite(role, {SEND_MESSAGES: true, VIEW_CHANNEL: true, EMBED_LINKS: true, ATTACH_FILES: true})})
        
        c.createOverwrite(message.author, {SEND_MESSAGES: true, VIEW_CHANNEL: true, EMBED_LINKS: true, ATTACH_FILES: true})
        c.setParent(client.ticketCategory)

        ticketTranscript.createEvent(client, message, c, reason)

        let openEmbed = new Discord.MessageEmbed()
            .setTitle(client.l.tick.new.created.replace('%USER%', message.author.username))
            .setDescription(client.l.tick.new.location.replace('%LOCATION%', c))
            .setColor(client.config.colour)
            .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

        if(!(reason == "None Specified")){message.channel.send(openEmbed)}
        else{const fail = await message.channel.send(openEmbed);setTimeout(() => {fail.delete()}, 6000)}

        c.send(`${message.author}`)

        const insert = sql.prepare(`INSERT INTO tickets VALUES ('${c.id}', '${message.author.id}', '${client.ticketCategory.id}', NULL, '', 'OPEN');`)
        insert.run()

        if(client.config.enableCategories === false){
            let thanksEmbed = new Discord.MessageEmbed()
                .setTitle(client.l.tick.new.support.replace('%SERVERNAME%', client.config.serverName))
                .setDescription(`${client.l.tick.new.messageLine1}\n${client.l.tick.new.messageLine2}
                \n${client.l.tick.new.messageLine3}\n\n${client.l.tick.new.reason} ${reason}`)
                .setFooter(`${client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username)}`, client.user.avatarURL())
                .setColor(client.config.colour)
            c.send(thanksEmbed)
            c.setTopic(`${client.l.tick.new.topicUser} ${message.author.username} ⠀|⠀ ${client.l.tick.new.topicReason} ${reason}`)
        }
        else{
            let desc = ""
            client.config.ticketCategories.forEach(type => desc += `${type.emoji} - ${type.name}\n`)

            let embed = new Discord.MessageEmbed()
                .setTitle(client.l.tick.new.category)
                .setColor(client.config.colour)
                .setDescription(`${client.l.tick.new.messageLine1}\n${client.l.tick.new.messageLine2}\n\n${client.l.tick.new.reason} ${reason}\n\n${client.l.tick.new.pickCategory}\n\n${desc}`)
                .setFooter(`${client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username)}`, client.user.avatarURL())

            c.send(embed).then(msg => {client.config.ticketCategories.forEach(type => msg.react(type.emoji))

                const backwardsFilter = (reaction, user) => !user.bot
                const backwards = msg.createReactionCollector(backwardsFilter, {time: 600000})

                backwards.on('collect', r => {
                    msg.reactions.removeAll()
                    client.config.ticketCategories.forEach(type => {
                        if(r.emoji.name === type.emoji){
                            var theCat = c.guild.channels.cache.find(x => x.name === type.category && x.type === "category")
                            if(!theCat){
                            var theCat = message.channel.guild.channels.cache.find(x => x.id === type.category && x.type === "category")
                            }
                            if(!theCat) c.send(`Missing \`${type.category}\` category!`) 
                            else(c.setParent(theCat))

                            let roles = []
                            type.roles.forEach(role => roles.push(client.findRole(role)))

                            flag = false
                            roles.forEach(async role => {c.createOverwrite(role, {SEND_MESSAGES: false, VIEW_CHANNEL: false, EMBED_LINKS: false, ATTACH_FILES: false})})
                            
                            let roles2 = []

                            type.roles.forEach(rol => {
                                let extraRole = client.findRole(rol)
                                if(!extraRole) c.send(`Missing \`${rol}\` role!`) 
                                else{roles2.push(extraRole)}
                            })

                            roles.forEach(rol => {c.createOverwrite(rol, {SEND_MESSAGES: true, VIEW_CHANNEL: true, EMBED_LINKS: true, ATTACH_FILES: true})})
                            c.createOverwrite(message.author, {SEND_MESSAGES: true, VIEW_CHANNEL: true, EMBED_LINKS: true, ATTACH_FILES: true})

                            embed.setTitle(client.l.tick.new.support.replace('%SERVERNAME%', client.config.serverName))
                            embed.setDescription(`${client.l.tick.new.messageLine1}\n${client.l.tick.new.messageLine2}\n\n**Category -** ${type.emoji} ${type.name}\n${client.l.tick.new.reason} ${reason}`)
                            msg.edit(embed)

                            c.setTopic(`${client.l.tick.new.topicUser} ${message.author.username} ⠀|⠀ ${client.l.tick.new.topicCategory} ${type.name} ⠀|⠀ ${client.l.tick.new.topicReason} ${reason}`)

                            var update = sql.prepare(`UPDATE tickets SET category = '${theCat.id}' WHERE channel = ${c.id}`)
                            update.run()

                        }
                    })
                })

            })
        }

        client.log(client.l.tick.new.log, `${client.l.gen.logs.user} ${message.author} (${message.author.id})\n${client.l.gen.logs.channel} ${message.channel}\n${client.l.gen.logs.ticket} ${c}`)

    })

}

// © Zeltux Discord Bot | Do Not Copy



