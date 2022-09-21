const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()

    var announceMessage = args.join(" ")

    if (!announceMessage) return client.missingArguments(client.command, client.l.utilities.announce.usage)

    var embed = new Discord.MessageEmbed()
        .setDescription(announceMessage)
        .setThumbnail(client.user.avatarURL())
        .setColor(client.config.colour)
        .setFooter(`${client.config.footer}\n${client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username)}`)
        .setAuthor(client.config.serverName, client.user.avatarURL())

    message.channel.send(embed);

    client.log(client.l.utilities.announce.log, `${client.l.gen.logs.user} ${message.author} (${message.author.id})\n${client.l.gen.logs.channel} ${message.channel}\n${client.l.gen.logs.message}\n${announceMessage}`)

}

// © Zeltux Discord Bot | Do Not Copy