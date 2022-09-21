const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/udb.sqlite');

exports.run = async (client, message, args) => {
    
    message.delete()

    const notATicketChannel = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.tick.onlyInClosedTicketChannel)
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    if (!message.channel.name.startsWith(`closed-`)) {const fail = await message.channel.send(notATicketChannel);setTimeout(() => {fail.delete()}, 6000);return}

    const data = sql.prepare(`SELECT * FROM tickets WHERE channel = '${message.channel.id}'`).get()
    let usr = data.user
    let member = message.guild.members.cache.get(usr)

    var update = sql.prepare(`UPDATE tickets SET status = 'OPEN' WHERE channel = ${message.channel.id}`)
    update.run()

    const noMemberEmbed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(`**${client.l.tick.reopen.error}**`)
        .setDescription(`${client.l.tick.reopen.errorMessage}`)
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    let roles = []
    client.config.canSeeTicket.forEach(role => roles.push(client.findRole(role)))

    flag = false
    roles.forEach(role => {message.channel.createOverwrite(role, {SEND_MESSAGES: true, VIEW_CHANNEL: true, EMBED_LINKS: true, ATTACH_FILES: true})})

    if (!member) return message.channel.send(noMemberEmbed)
    await message.channel.createOverwrite(member,{VIEW_CHANNEL:true, SEND_MESSAGES:true})
    message.channel.send(`${member}`)

    let thanksEmbed = new Discord.MessageEmbed()
        .setTitle(client.l.tick.new.support.replace('%SERVERNAME%', client.config.serverName))
        .setDescription(`${client.l.tick.new.messageLine1}\n${client.l.tick.new.messageLine2}
                        \n${client.l.tick.new.messageLine3}\n\n${client.l.tick.new.reason} None Specified`)
        .setFooter(`${client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username)}`, client.user.avatarURL())
        .setColor(client.config.colour)
        
   message.channel.send(thanksEmbed)

   let chn = client.findChannel(message.channel.id)
   chn.setName(`ticket-${message.author.username}`)

}
