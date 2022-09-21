const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args) => {

    message.delete();
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const info = new Discord.MessageEmbed()
        .setTitle(client.l.utilities.botstats.botstats)
        .addField(client.l.utilities.botstats.version,`\`v${require(`${process.cwd()}/package.json`).version}\``, true)
        .addField(client.l.utilities.botstats.memory, `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``, true)
        .addField(client.l.utilities.botstats.uptime, `\`${duration}\``, true)
        .addField(client.l.utilities.botstats.users, `\`${client.users.cache.size}\``, true)
        .addField(client.l.utilities.botstats.servers, `\`${client.guilds.cache.size}\``, true)
        .addField(client.l.utilities.botstats.channels, `\`${client.channels.cache.size}\``, true)
        .addField(client.l.utilities.botstats.discord, `\`v${require(`${process.cwd()}/package.json`).dependencies["discord.js"]}\``, true)
        .addField(client.l.utilities.botstats.node, `\`${process.version}\``, true)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
        .setColor(client.config.colour)
    message.channel.send(info)
}