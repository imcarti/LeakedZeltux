const Discord = require("discord.js");

exports.run = (client, message, args) => {
    message.delete()
    
    links = client.config.online

    let embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.utilities.donate.donate)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    let desc = ""

    if(links.donate){desc += `${client.l.utilities.donate.msg} [${client.l.utilities.donate.link}](${links.donate})!\n`}
    if(!desc){desc += `${client.l.utilities.donate.noDonationPage}`}

    embed.setDescription(desc)
    message.channel.send(embed)

}

// © Zeltux Discord Bot | Do Not Copy