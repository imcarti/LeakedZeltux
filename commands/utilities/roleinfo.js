const Discord = require("discord.js");
function getID (role) {
  if (!role.includes('<@&') && !role.includes('>')) return undefined
  role = role.replace('<@&', '')
  role = role.replace('>', '')
  return role
}
exports.run = (client, message, args) => {
    message.delete()

    var noRole = new Discord.MessageEmbed()
      .setColor(client.config.colour)
      .setTitle(client.l.utilities.roleinfo.undetectedRole)
      .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
      
    if (!args[0]) return message.channel.send(noRole)
    let role = args[0]
    role = getID(role)
    if (role === undefined) return message.channel.send(noRole)
    role = message.guild.roles.cache.find(r=>r.id===role)
    if (role === undefined) return message.channel.send(noRole)
    let s = role.permissions.serialize()
    let perms = []
    for (let [key, value] of Object.entries(s)) {
      if (value === true) perms.push(key)
    }
    let emb = new Discord.MessageEmbed()
        .setTitle(role.name)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(role.hexColor)
        .addField(client.l.utilities.roleinfo.colour, role.hexColor + `${client.l.utilities.roleinfo.sameAsEmbed}`, true)
        .addField(client.l.utilities.roleinfo.createdAt, role.createdAt, true)
        .addField(client.l.utilities.roleinfo.displayedSeperately, role.hoist, true)
        .addField(client.l.utilities.roleinfo.ID, role.id, true)
        .addField(client.l.utilities.roleinfo.members, role.members.size, true)
        .addField(client.l.utilities.roleinfo.permissions, perms.join(',\n'), true)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
    message.channel.send(emb)

}

// © Zeltux Discord Bot | Do Not Copy