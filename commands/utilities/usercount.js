const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()
	var counter = "812673"
    var count = new Discord.MessageEmbed()
        .setAuthor(client.config.serverName, message.guild.iconURL())
        .setTitle(`${client.config.serverName} ${client.l.utilities.usercount.usercount}`)
        .setColor(client.config.colour)
        .addField(client.l.utilities.usercount.totalMembers, message.guild.members.cache.size, true)
        .addField(client.l.utilities.usercount.totalHumans, message.guild.members.cache.filter(member => !member.user.bot).size, true)
        .addField(client.l.utilities.usercount.totalBots, message.guild.members.cache.filter(member => member.user.bot).size, true)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    message.channel.send(count)

}

// © Zeltux Discord Bot | Do Not Copy