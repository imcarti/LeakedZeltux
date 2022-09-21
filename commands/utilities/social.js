const Discord = require("discord.js");

exports.run = (client, message, args) => {
    message.delete()
    
    links = client.config.social

    let embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.utilities.social.socialMedia.replace('%SERVERNAME%', client.config.serverName))
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    let desc = ""

    if(links.facebook){desc += `- [${client.l.utilities.social.facebook}](${links.facebook})\n`}
    if(links.twitter){desc += `- [${client.l.utilities.social.twitter}](${links.twitter})\n`}
    if(links.instagram){desc += `- [${client.l.utilities.social.instagram}](${links.instagram})\n`}
    if(links.youtube){desc += `- [${client.l.utilities.social.youtube}](${links.youtube})\n`}
    if(links.twitch){desc += `- [${client.l.utilities.social.twitch}](${links.twitch})\n`}
    if(!desc){desc += `${client.l.utilities.social.none}`}

    embed.setDescription(desc)
    message.channel.send(embed)

}

// © Zeltux Discord Bot | Do Not Copy