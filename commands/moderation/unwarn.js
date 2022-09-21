const Discord = require("discord.js");
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')

exports.run = async (client, message, args) => {
    message.delete()

    var user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

    if(!user) return client.missingArguments(client.command, client.l.moderation.unwarn.usage)

    var id = args[1]
    if(!id) return client.missingArguments(client.command, client.l.moderation.unwarn.usage)

    var data = sql.prepare(`SELECT * FROM punishments WHERE id = ${id}`).get()
    if(!data) return client.missingArguments(client.command, client.l.moderation.unwarn.usage)
    if(data.type != 'Warn') return client.missingArguments(client.command, client.l.moderation.unwarn.usage)

    let roles = []
    client.config.exemptFromPunishments.forEach(role => roles.push(client.findRole(role)))
    
    const unwarned = new Discord.MessageEmbed()
      .setColor(client.config.colour)
      .setTitle(client.l.moderation.unwarn.unwarned)
      .setDescription(`${client.l.gen.logs.user} ${user}\n${client.l.gen.logs.staffMember} ${message.author}`)    
      .setFooter(client.l.moderation.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))  

    const DM = new Discord.MessageEmbed()
      .setColor(client.config.colour)
      .setTitle(client.l.moderation.unwarn.dm.replace('%SERVERNAME%', client.config.serverName))
      .setDescription(`${client.l.gen.logs.staffMember} ${message.author}`)  

    user.send(DM).catch((err) => {})

    message.channel.send(unwarned)

    client.log(client.l.moderation.unwarn.log, `${client.l.gen.logs.user} ${user}\n${client.l.gen.logs.staffMember} ${message.author}`)

    var update = sql.prepare(`UPDATE punishments SET status = 'UW' WHERE id = ${id}`)
    update.run()
}

// © Zeltux Discord Bot | Do Not Copy