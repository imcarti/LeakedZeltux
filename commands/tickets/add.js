const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/udb.sqlite');

exports.run = async (client, message, args) => {
    
    message.delete()

    const notATicketChannel = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.tick.onlyInTicketChannel) 
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))   
        
    if (!message.channel.name.startsWith(`ticket-`)) {const fail = await message.channel.send(notATicketChannel);setTimeout(() => {fail.delete()}, 6000);return}
    
    var user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!user) return client.missingArguments(client.command, client.l.tick.add.usage)

    const data = sql.prepare(`SELECT * FROM tickets WHERE channel = '${message.channel.id}'`).get()
    let added = data.added

    if(added === ''){added = `${user.id}`}
    else{added = `${data.added}-${user.id}`}

    var update = sql.prepare(`UPDATE tickets SET added = '${added}' WHERE channel = ${message.channel.id}`)
    update.run()

    const addedEmbed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setDescription(client.l.tick.add.added.replace('%USER%', user))
        .setFooter(client.l.tick.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
    message.channel.send(addedEmbed)

    message.channel.createOverwrite(user, {VIEW_CHANNEL:true, SEND_MESSAGES:true})

    client.log(client.l.tick.add.log, `${client.l.gen.logs.user} ${message.author}\n${client.l.gen.logs.channel} ${message.channel}\n${client.l.gen.logs.added} ${user}`)

}

// © Zeltux Discord Bot | Do Not Copy