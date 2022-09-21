const ms = require("ms");
const Discord = require("discord.js");
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')
const func = require(`${process.cwd()}/assets/utils/functions`)

exports.run = async (client, message, args) => {
    message.delete()

    const staffMember = new Discord.MessageEmbed()
      .setColor(client.config.colour)
      .setTitle(client.l.moderation.cantPunish)
      .setFooter(client.l.moderation.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))  
    
    var user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
            
    let mutetime = args[1]
    if(!mutetime) return client.missingArguments(client.command, client.l.moderation.tempMute.usage)

    var reason = args.splice(2).join(' ')

    if(!user) return client.missingArguments(client.command, client.l.moderation.tempMute.usage)
    if(!reason) return client.missingArguments(client.command, client.l.moderation.tempMute.usage)

    let roles = []
    client.config.exemptFromPunishments.forEach(role => roles.push(client.findRole(role)))
    flag = false
    roles.forEach(role => {if(user.roles.cache.find(r => r.id === role.id)) flag = true})
    if(flag === true) {const fail = await message.channel.send(staffMember);setTimeout(() => {fail.delete()}, 6000);return}

    user.roles.add(client.mutedRole)
    
    const muted = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.moderation.tempMute.tempMuted)
        .setDescription(`${client.l.gen.logs.user} ${user}\n${client.l.gen.logs.staffMember} ${message.author}\n${client.l.moderation.tempMute.time} ${ms(ms(mutetime))}\n${client.l.gen.logs.reason} ${reason}`)    
        .setFooter(client.l.moderation.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username)) 

    const DM = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.moderation.tempMute.dm.tempMuted.replace('%SERVERNAME%', client.config.serverName))
        .setDescription(`${client.l.gen.logs.staffMember} ${message.author}\n${client.l.moderation.tempMute.time} ${ms(ms(mutetime))}\n${client.l.gen.logs.reason} ${reason}`)  

    user.send(DM).catch((err) => {})

    message.channel.send(muted)

    client.log(client.l.moderation.tempMute.logs.tempMute, `${client.l.gen.logs.user} ${user} (${user.id})\n${client.l.gen.logs.staffMember} ${message.author} (${message.author.id})\n${client.l.moderation.tempMute.time} ${ms(ms(mutetime))}\n${client.l.gen.logs.reason} ${reason}`)

    var cd = new Date();
    var dateString = cd.getDate() + "-" + (cd.getMonth() + 1) + "-" + cd.getFullYear();
    var timestamp = cd.getHours() + ":" + cd.getMinutes()
    var stamp = `${dateString} ${timestamp}`

    id = func.nextPrimaryKey('punishments')
    const insert = sql.prepare(`INSERT INTO punishments VALUES ('${id}', 'TempMute', '${user.id}', '${message.author.id}', '${ms(ms(mutetime))}', '${reason}', 'A', '${stamp}', NULL);`)
    insert.run()

    setTimeout(function(){
        user.roles.remove(client.mutedRole)

        const DM = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(client.l.moderation.tempMute.dm.unMuted.replace('%SERVERNAME%', client.config.serverName))
            .setDescription(`${client.l.gen.logs.staffMember} ${message.author}`)  
        user.send(DM).catch((err) => {})

        client.log(client.l.moderation.tempMute.logs.unMute, `${client.l.gen.logs.user} ${user}\n${client.l.gen.logs.staffMember} ${message.author}`)
        
        var update = sql.prepare(`UPDATE punishments SET status = 'UB' WHERE user = ? AND type = 'TempMute'`)
        update.run(user.id)

    }, ms(mutetime))

}

// © Zeltux Discord Bot | Do Not Copy