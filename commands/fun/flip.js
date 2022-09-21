const Discord = require("discord.js");

exports.run = (client, message, args) => {
    message.delete()
    
    var rand = client.l.fun.flip.options

    var flip = rand[Math.floor(Math.random()*rand.length)]

    var embed = new Discord.MessageEmbed()
        .setDescription(client.l.fun.flip.flip.replace('%USER%', message.author.username).replace('%RESULT%', flip))
        .setColor(client.config.colour)
        .setFooter(client.l.fun.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.tag))
        .setTimestamp()
    message.channel.send(embed)

} 

// © Zeltux Discord Bot | Do Not Copy