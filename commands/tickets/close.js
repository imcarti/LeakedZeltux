const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/udb.sqlite');

exports.run = async (client, message, args) => {
    
    message.delete()

    const notATicketChannel = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.tick.onlyInTicketChannel)
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    if(!message.channel.name.startsWith(`ticket-`)) {const fail = await message.channel.send(notATicketChannel);setTimeout(() => {fail.delete()}, 6000);return}

    async function doCloseEvent(){

        const closed = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(client.l.tick.close.closed)
            .setDescription(`${client.l.tick.close.managementView}
                        \n${client.l.tick.close.delete.replace('%DELETE%', `\`${client.config.prefix}delete\``)}.`)
            .setFooter(`${client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username)}`, client.user.avatarURL())

        message.channel.send(closed)

        client.log(client.l.tick.close.log, `${client.l.gen.logs.user} ${message.author}\n${client.l.gen.logs.channel} ${message.channel.name}`)

        const data = sql.prepare(`SELECT * FROM tickets WHERE channel = '${message.channel.id}'`).get()
        let usr = data.user
        username = client.users.cache.get(usr)

        var update = sql.prepare(`UPDATE tickets SET status = 'CLOSED' WHERE channel = ${message.channel.id}`)
        update.run()

        const dm = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(client.l.tick.close.dm.closed.replace('%SERVERNAME%', client.config.serverName))
            .setDescription(`${client.l.tick.close.dm.message}\n\n${client.l.tick.close.dm.transcript}`)
            .setTimestamp(message.createdAt)

        if(username){
            message.channel.setName(`closed-${username.username}`)
            message.channel.createOverwrite(username, {SEND_MESSAGES: false, VIEW_CHANNEL: false})

            if(client.config.dmCloseMessage === true){
                username.send(dm).catch((err) => {})
            }

            if(client.config.dmTicketTranscripts === true){
                username.send({
                    files: [`${process.cwd()}/commands/tickets/transcripts/transcript-${message.channel.id}.html`]
                }).catch((err) => {})
            }
        }
        else{
            message.channel.setName(`closed-unknown`)
        }

        let everyone = message.guild.roles.cache.find(x => x.name === "@everyone");

        let roles = []
        client.config.canSeeTicket.forEach(role => roles.push(client.findRole(role)))

        flag = false
        roles.forEach(role => {message.channel.createOverwrite(role, {VIEW_CHANNEL:false, SEND_MESSAGES:false})})

        let roles1 = []
        client.config.canSeeClosedTicket.forEach(role => roles1.push(client.findRole(role)))

        flag = false
        roles1.forEach(role => {message.channel.createOverwrite(role, {VIEW_CHANNEL:true, SEND_MESSAGES:true})})

        message.channel.createOverwrite(everyone, {SEND_MESSAGES: false, VIEW_CHANNEL: false})

        let added = data.added
        if(added != ''){
            added.split("-").forEach(element => {
                user = client.users.cache.get(element)
                message.channel.createOverwrite(user, {SEND_MESSAGES: false, VIEW_CHANNEL: false})
            })
        }
    }
    
    const data2 = sql.prepare(`SELECT * FROM tickets WHERE channel = '${message.channel.id}'`).get()
    let voice = data2.voice
    var c = message.guild.channels.cache.find(x => x.id === voice)
    if(voice != null){

        const whatToClose = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(client.l.tick.close.whichTicket)
            .setDescription(`${client.l.tick.close.voice} \n${client.l.tick.close.both}`)
            .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
    
        const filter = (reaction, user) => {
            return ['🎟️', '🔊'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        message.channel.send(whatToClose).then((m) => {
        m.react("🎟️").then(() => m.react("🔊")
        .then(() => {
        m.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first()
        
                if (reaction.emoji.name === '🎟️') {
                    m.delete()
                    c.delete()
                    doCloseEvent()
                }
                else if (reaction.emoji.name === '🔊'){
                    whatToClose.setTitle(`${client.l.tick.close.voiceTicketClose}`)
                    whatToClose.setDescription("")
                    c.delete()
                    m.reactions.removeAll()
                    m.edit(whatToClose)
                    var update = sql.prepare(`UPDATE tickets SET voice = NULL WHERE channel = ${message.channel.id}`)
                    update.run()
                }

        }).catch(() => {message.channel.send(embed(client.l.fun.rps.title,client.l.fun.rps.tooSlow))} )

        }))})
    
    }
    else{
        doCloseEvent()
    }       

}

// © Zeltux Discord Bot | Do Not Copy