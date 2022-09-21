const Discord = require("discord.js");
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')

exports.run = async (client, message, args) => {
    message.delete()

    var user = client.users.cache.find(user => user.id == args[0])

    if(!user) return client.missingArguments(client.command, client.l.moderation.unban.usage)

    var unmuted = new Discord.MessageEmbed()
      .setColor(client.config.colour)
      .setTitle(client.l.moderation.unban.unbanned)
      .setDescription(`${client.l.gen.logs.user} ${user}\n${client.l.gen.logs.staffMember} ${message.author}`)  
      .setFooter(client.l.moderation.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))  

    var DM = new Discord.MessageEmbed()
      .setColor(client.config.colour)
      .setTitle(client.l.moderation.unban.dm.replace('%SERVERNAME%', client.config.serverName))
      .setDescription(`${client.l.gen.logs.staffMember} ${message.author}`)  

    user.send(DM).catch((err) => {})

    message.channel.send(unmuted)
    
    message.guild.members.unban(user.id)

    client.log(client.l.moderation.unban.log, `${client.l.gen.logs.user} ${user}\n${client.l.gen.logs.staffMember} ${message.author}`)

    var update = sql.prepare(`UPDATE punishments SET status = 'UM' WHERE user = ? AND type = 'Ban'`)
    update.run(user.id)

}

// © Zeltux Discord Bot | Do Not Copy