const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()

    let bug = args.join(" ");

    if(!args.join(" ")) return client.missingArguments(client.command, client.l.utilities.bugreport.usage)

    var confirm = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.utilities.bugreport.sent)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
    const fail = await message.channel.send(confirm);setTimeout(() => {fail.delete()}, 6000) 

    let bugEmbed = new Discord.MessageEmbed()
        .setTitle(client.l.utilities.bugreport.bugReport)
        .setColor(client.config.colour)
        .setDescription(bug)
        .setFooter(`${client.l.utilities.bugreport.reportedBy} ${message.author.tag}`)
        .setTimestamp(message.createdAt)
    client.bugChannel.send(bugEmbed)

    client.log(client.l.utilities.bugreport.log, `${client.l.gen.logs.user} ${message.author} (${message.author.id})\n${client.l.gen.logs.channel} ${message.channel}\n${client.l.gen.logs.bug} ${bug}`)

}

// © Zeltux Discord Bot | Do Not Copy