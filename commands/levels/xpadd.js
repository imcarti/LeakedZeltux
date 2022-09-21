const Discord = require("discord.js");
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')

exports.run = (client, message, args) => {
    message.delete()

    var user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    var amount = args[1]

    if(!user) return client.missingArguments(client.command, client.l.levels.xpadd.usage)
    if(!amount) return client.missingArguments(client.command, client.l.levels.xpadd.usage)

    if(amount.startsWith("-")) return client.missingArguments(client.command, client.l.levels.xpadd.usage)

    try{amount = (parseInt(amount, 10))}
    catch{return client.missingArguments(client.command, client.l.levels.xpadd.usage)}
    if(amount > 100000000) return client.missingArguments(client.command, client.l.levels.xpadd.usage)

    var data = sql.prepare(`SELECT points FROM scores WHERE user = '${user.id}'`).get()
    
    if(!data){
        score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
        client.setScore.run(score)
        data.points = 0
    }
    
    let currentAmount = data.points
    let newAmount = currentAmount + amount

    let newLevel = Math.floor(0.1 * Math.sqrt(newAmount));

    var update = sql.prepare(`UPDATE scores SET points = '${newAmount}' WHERE user = '${user.id}'`)
    update.run()
    var update2 = sql.prepare(`UPDATE scores SET level = '${newLevel}' WHERE user = '${user.id}'`)
    update2.run()

    let addedEmbed = new Discord.MessageEmbed()
        .setTitle(client.l.levels.xpadd.added)
        .setColor(client.config.colour)
        .setDescription(client.l.levels.xpadd.amount.replace('%AMOUNT%', amount).replace('%USER%', user))

    message.channel.send(addedEmbed)

}

// © Zeltux Discord Bot | Do Not Copy