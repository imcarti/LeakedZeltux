const Discord = require("discord.js");
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')

exports.run = async (client, message, args) => {
    message.delete()

    function getChan(chan) {
        if (!chan.includes('<#') && !chan.includes('>')) return undefined
        chan = chan.replace('<#', '')
        chan = chan.replace('>', '')
        chan = message.guild.channels.cache.find(c=>c.id===chan)
        return chan
    }
    function getRole(role) {
        if (!role.includes('<@&') && !role.includes('>')) return undefined
        role = role.replace('<@&', '')
        role = role.replace('>', '')
        role = message.guild.roles.cache.find(r=>r.id===role)
        return role
    }

    let embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.utilities.rr.setup)
        .setDescription(client.l.utilities.rr.channel)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
        
    var rrEmbed = await message.channel.send(embed)

    var chn = undefined
    while(!chn){
        var response = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {time: 10000000, max: 1})
        .then(async collected => {
    
            var collectedMessage = await collected.first()
            collectedMessage.delete()
            let collectedChannel = getChan(collectedMessage.content)

            if (collectedChannel !== undefined) {
                chn = collectedChannel
            }
            else {
                embed.setDescription(client.l.utilities.rr.notAChannel) 
                rrEmbed.edit(embed)              
            }
            
        })
    }

    embed.setDescription(client.l.utilities.rr.messageID) 
    await rrEmbed.edit(embed)

    var msg = undefined
    while(!msg){
        var response = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {time: 10000000, max: 1})
        .then(async collected => {
    
            var collectedMessage = await collected.first()
            collectedMessage.delete()

            mess = collectedMessage.content

            meg = await chn.messages.fetch(mess).catch(err => meg = undefined)

            if(!meg) meg = undefined

            if (meg !== undefined) {
                msg = meg
            }
            else {
                embed.setDescription(client.l.utilities.rr.notAMessageID) 
                rrEmbed.edit(embed)              
            }
            
        })
    }

    embed.setDescription(client.l.utilities.rr.role) 
    await rrEmbed.edit(embed)

    var role = undefined
    while(!role){
        var response = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {time: 10000000, max: 1})
        .then(async collected => {
    
            var collectedMessage = await collected.first()
            collectedMessage.delete()
            let collectedRole = getRole(collectedMessage.content)

            if (collectedRole !== undefined) {
                role = collectedRole
            }
            else {
                embed.setDescription(client.l.utilities.rr.notARole) 
                rrEmbed.edit(embed)              
            }
            
        })
    }

    embed.setDescription(client.l.utilities.rr.reaction) 
    await rrEmbed.edit(embed)

    reaction = undefined
    while(!reaction){
        await rrEmbed.awaitReactions((reaction, user) => user.id == message.author.id, {time: 10000000, max:1})
        .then(async collected => {
            var collectedReaction = await collected.first()
            rrEmbed.reactions.removeAll()

            react = collectedReaction.emoji.name

            try {
                await msg.react(react)
                reaction = collectedReaction
            }
            catch {
                embed.setDescription(client.l.utilities.rr.notAReaction) 
                rrEmbed.edit(embed)              
            }

        })
    }

    embed.setDescription(client.l.utilities.rr.completed.replace('%CHANNEL%', chn).replace('%MESSAGE%', msg).replace('%ROLE%', role).replace('%EMOJI%', reaction.emoji.name))
    await rrEmbed.edit(embed)
    
    addreactionrole = { message: `${msg.id}`, reaction: `${reaction.emoji.name}`, role: `${role.id}`}
    const insert = sql.prepare(`INSERT OR REPLACE INTO reactionrole (message, reaction, role) VALUES (@message, @reaction, @role);`)
    insert.run(addreactionrole)

    rrEmbed.react("❌")

    await rrEmbed.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name === "❌", {time: 10000000, max:1})
    .then(async collected => {rrEmbed.delete()})  

}

// © Zeltux Discord Bot | Do Not Copy