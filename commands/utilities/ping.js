const Discord = require("discord.js");

exports.run = (client, message, args) => {
    message.delete()
    
    let embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.utilities.ping.pong)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    message.channel.send(embed)

}

// © Zeltux Discord Bot | Do Not Copy