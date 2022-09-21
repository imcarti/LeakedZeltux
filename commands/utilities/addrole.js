const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()

    function getRole(role) {
        if (!role.includes('<@&') && !role.includes('>')) return undefined
        role = role.replace('<@&', '')
        role = role.replace('>', '')
        role = client.findRole(role)
        return role
    }
    
    if (!args[1]) return client.missingArguments(client.command, client.l.utilities.addrole.usage)

    let role = getRole(args[1])
    if(!role) return client.missingArguments(client.command, client.l.utilities.addrole.usage)

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!member) return client.missingArguments(client.command, client.l.utilities.addrole.usage)

    try{
        member.roles.add(role).then(test => {
        const added = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(client.l.utilities.addrole.added)
            .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
        message.channel.send(added)
        })
    }
    catch{
        const noPerms = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(client.l.gen.err.missingperms)
            .setDescription(client.l.gen.err.roleTooLow)
            .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
        const fail = await message.channel.send(noPerms);setTimeout(() => {fail.delete()}, 6000);return       
    }

    client.log(client.l.utilities.addrole.log, `${client.l.gen.logs.user} ${member} (${member.id})\n${client.l.gen.logs.staffMember} ${message.author} (${message.author.id})\n${client.l.gen.logs.channel} ${message.channel}\n${client.l.gen.logs.role} ${role}`)

}

// © Zeltux Discord Bot | Do Not Copy