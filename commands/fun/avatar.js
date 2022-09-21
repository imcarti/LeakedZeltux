const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    let embed = new Discord.MessageEmbed()
        .setImage(member.user.avatarURL())
        .setTitle(member.user.tag)
        .setColor(client.config.colour)
        .setFooter(client.l.fun.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.tag))
        .setTimestamp()
    message.channel.send(embed)

}

// © Zeltux Discord Bot | Do Not Copy