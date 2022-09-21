const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()

    let question = encodeURIComponent(args.join(' '))
    let q = args.join(" ")

    if (!q) return client.missingArguments(client.command, client.l.utilities.lmgtfy.usage)

    let link = `https://www.lmgtfy.com/?q=${question}`

    embedLink = new Discord.MessageEmbed()
        .setTitle(client.l.utilities.lmgtfy.lmgtfy)
        .setDescription(`${q}\n${link}`)
        .setTimestamp(message.createdAt)
        .setColor(client.config.colour)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    message.channel.send(embedLink)

}

// © Zeltux Discord Bot | Do Not Copy