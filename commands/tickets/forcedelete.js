const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    
    message.delete()
    
    const notATicketChannel = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.tick.onlyInTicketChannel)
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    if (!message.channel.name.startsWith(`ticket-`) && !message.channel.name.startsWith(`closed-`)) {
        const fail = await message.channel.send(notATicketChannel);setTimeout(() => {fail.delete()}, 6000);return}

    client.log(client.l.tick.forceDelete.log, `${client.l.gen.logs.user} ${message.author}\n${client.l.gen.logs.channel} ${message.channel.name}`)

    client.logChannel.send({
        files: [`${process.cwd()}/commands/tickets/transcripts/transcript-${message.channel.id}.html`]
    })

    setTimeout(() => {
        message.channel.delete()
    }, 2000)

}

// © Zeltux Discord Bot | Do Not Copy