const Discord = require("discord.js");

module.exports = (client, role) => {

    var logChannel = role.guild.channels.cache.find(x => x.name === client.config.logChannel)
    if(!logChannel){var logChannel = role.guild.channels.cache.find(x => x.id === client.config.logChannel)}
    if(!logChannel) return

    const log = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.events.role.created)
        .setDescription(`${client.l.events.role.role} ${role}`)
        .setTimestamp()
        
    try{
        logChannel.send(log)
    }
    catch{
        return
    }

}

// © Zeltux Discord Bot | Do Not Copy