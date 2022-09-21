const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()

        let embed1 = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(client.l.utilities.latency.checking)
            .setFooter(client.l.utilities.latency.issue)
            .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

        const latencyCheck = await message.channel.send(embed1)

        let latency = latencyCheck.createdTimestamp - message.createdTimestamp

        let embed2 = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(`${client.l.utilities.latency.latency.replace('%BOTNAME%', client.config.botName)}\n- ${client.l.utilities.latency.latencyValue.replace('%LATENCY%', latency)}\n- ${client.l.utilities.latency.apiLatencyValue.replace('%APILATENCY%', Math.round(client.ws.ping))}`)
            .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

        latencyCheck.edit(embed2)

}

// © Zeltux Discord Bot | Do Not Copy

