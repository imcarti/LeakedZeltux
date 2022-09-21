const Discord = require("discord.js");

exports.run = (client, message, args) => {
    message.delete()
    
    links = client.config.online

    let embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.utilities.links.links.replace('%SERVERNAME%', client.config.serverName))
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    let desc = ""

    if(links.website){desc += `- [${client.l.utilities.links.website}](${links.website})\n`}
    if(links.forums){desc += `- [${client.l.utilities.links.forums}](${links.forums})\n`}
    if(links.donate){desc += `- [${client.l.utilities.links.donate}](${links.donate})\n`}
    if(!desc){desc += `${client.l.utilities.links.noLinks}`}

    embed.setDescription(desc)
    message.channel.send(embed)

}

// © Zeltux Discord Bot | Do Not Copy