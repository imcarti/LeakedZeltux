const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()

    var ascii = ""

    let text = args.join(" ");

    if(!args.join(" ")) return client.missingArguments(client.command, client.l.utilities.toascii.usage)

    var splitted = text.split("");
    splitted.forEach(element  => ascii = `${ascii} ${element.charCodeAt(0)}`)
    
    let embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.utilities.toascii.toascii)
        .addField(client.l.utilities.toascii.text, text)
        .addField(client.l.utilities.toascii.ascii, ascii)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    message.channel.send(embed)

}

// © Zeltux Discord Bot | Do Not Copy