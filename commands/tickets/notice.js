const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/udb.sqlite');

exports.run = (client, message, args) => {
    
    message.delete()

    const notATicketChannel = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(`🚫 ${client.l.tick.onlyInTicketChannel}`)    
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(notATicketChannel)
    
    const data = sql.prepare(`SELECT * FROM tickets WHERE channel = '${message.channel.id}'`).get()
    if(data){
        let usr = data.user
        message.channel.send(`<@${usr}>`)
    }
    
    var notice = new Discord.MessageEmbed()
        .setTitle(client.l.tick.notice.title)
        .setDescription(`${client.l.tick.notice.message}
                         ${client.l.tick.notice.close.replace('%CLOSE%', `\`${client.config.prefix}close\``)}
                         \n${client.l.tick.notice.noResponse}`)
        .setColor(client.config.colour)
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))              

    message.channel.send(notice)

}

// © Zeltux Discord Bot | Do Not Copy