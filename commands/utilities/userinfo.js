const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    let inline = true
    let resence = true
    const status = {
        online: client.l.utilities.userinfo.statusList.online,
        idle: client.l.utilities.userinfo.statusList.idle,
        dnd: client.l.utilities.userinfo.statusList.dnd,
        offline: client.l.utilities.userinfo.statusList.offline
      }
         
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
  let target = message.mentions.users.first() || message.author

  if (member.user.bot === true) {
      bot = client.l.utilities.userinfo.botList.yes;
    } else {
      bot = client.l.utilities.userinfo.botList.no;
    }

  let embed = new Discord.MessageEmbed()
      .setAuthor(target.username, target.displayAvatarURL())
      .setThumbnail((target.displayAvatarURL()))
      .setColor(client.config.colour)
      .addField(client.l.utilities.userinfo.username, `${member.user.tag}`, inline)
      .addField(client.l.utilities.userinfo.ID, member.user.id, inline)
      .addField(client.l.utilities.userinfo.nickname, `${member.nickname !== null ? `${member.nickname}` : client.l.utilities.userinfo.noNickname}`, true)
      .addField(client.l.utilities.userinfo.bot, `${bot}`,inline, true)
      .addField(client.l.utilities.userinfo.status, `${status[member.user.presence.status]}`, inline, true)
      .addField(client.l.utilities.userinfo.playing, `${member.user.presence.activities ? `🎮 ${member.user.presence.activities[0].name}` : client.l.utilities.userinfo.notPlaying}`,inline, true)
      .addField(client.l.utilities.userinfo.roles, `${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).join(" **|** ") || client.l.utilities.userinfo.noRoles}`)
      .addField(client.l.utilities.userinfo.joinedDiscordAt, member.user.createdAt)
      .setFooter(`${client.l.utilities.userinfo.informationAbout} ${member.user.username}\n${client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username)}`)
      .setTimestamp()

  message.channel.send(embed);

  message.delete()

}

// © Zeltux Discord Bot | Do Not Copy