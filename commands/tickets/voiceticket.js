const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/udb.sqlite');

exports.run = async (client, message, args) => {
    
    message.delete()

    const notATicketChannel = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.tick.onlyInTicketChannel)   
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    if (!message.channel.name.startsWith(`ticket-`)) {
        const fail = await message.channel.send(notATicketChannel);setTimeout(() => {fail.delete()}, 6000);return}

    let everyone = message.guild.roles.cache.find(x => x.name === "@everyone");

    const data = sql.prepare(`SELECT * FROM tickets WHERE channel = '${message.channel.id}'`).get()
    let usr = data.user
    let member = message.guild.members.cache.get(usr)

    message.guild.channels.create(`vticket-${member.user.username.toLowerCase()}`, {type: 'voice',
    topic: message.author.id}).then(c => {

    var update = sql.prepare(`UPDATE tickets SET voice = '${c.id}' WHERE channel = ${message.channel.id}`)
    update.run()

    let roles = []
    client.config.canSeeTicket.forEach(role => roles.push(client.findRole(role)))

    flag = false
    roles.forEach(role => {c.createOverwrite(role, {CONNECT: true, SPEAK: true, VIEW_CHANNEL: true})})

    c.createOverwrite(everyone, {CONNECT: false, SPEAK: false, VIEW_CHANNEL: false})
    c.createOverwrite(member, {CONNECT: true, SPEAK: true, VIEW_CHANNEL: true})
    
    const data2 = sql.prepare(`SELECT * FROM tickets WHERE channel = '${message.channel.id}'`).get()
    var theCat = message.channel.guild.channels.cache.find(x => x.id === data2.category && x.type === "category")
    c.setParent(theCat)

    let openEmbed = new Discord.MessageEmbed()
        .setTitle(client.l.tick.voiceTicket.created)
        .setDescription(client.l.tick.voiceTicket.location.replace('%LOCATION%',c))
        .setColor(client.config.colour)
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
    message.channel.send(openEmbed)

    let log = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.tick.voiceTicket.log)
        .setDescription(`${client.l.gen.logs.user} ${message.author} (${message.author.id})\n${client.l.gen.logs.channel}  ${message.channel}\n${client.l.gen.logs.voiceTicket}  ${c}`)
        .setTimestamp(message.createdAt)
    client.logChannel.send(log)

    })

}

// © Zeltux Discord Bot | Do Not Copy



