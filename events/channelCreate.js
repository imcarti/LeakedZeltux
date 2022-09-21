const Discord = require("discord.js");

module.exports = (client, channel) => {

    client.logChannel = client.findChannel(client.config.logChannel)
    if(!client.logChannel) return
    const logEmbed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.events.channelCreate.create)
        .setDescription(`${client.l.gen.logs.channel} ${channel.name}\n${client.l.gen.logs.channelType} ${channel.type}\n${client.l.gen.logs.channelID} ${channel.id}`)
        .setTimestamp(channel.createdAt)
    client.logChannel.send(logEmbed);

}