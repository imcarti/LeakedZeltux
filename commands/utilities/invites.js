const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/udb.sqlite');

exports.run = (client, message, args) => {
    if(client.config.inviteSystemEnabled === false) return;
    message.delete()

    var user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

    if(!user){

        let joins = 0
        let leaves = 0

        let myinvites = sql.prepare('SELECT * FROM joins WHERE inviter=?').all(message.author.id)
        if(myinvites) joins = myinvites.length

        let myinvites2 = sql.prepare('SELECT * FROM leaves WHERE inviter=?').all(message.author.id);
        if(myinvites2) leaves = myinvites2.length

        let is = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setAuthor(`${client.config.serverName}`,client.user.avatarURL())
            .setTitle(client.l.utilities.invites.inviteInfo.replace('%USER%', message.author.username))
            .addField(client.l.utilities.invites.net,`**${joins-leaves}**`, true)
            .addField(client.l.utilities.invites.joins,`**${joins}**`, true)
            .addField(client.l.utilities.invites.leaves,`**${leaves}**`, true)
            .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

        message.channel.send(is)
    }
    else{
        username = client.users.cache.get(`${user.id}`)

        let joins = 0
        let leaves = 0

        let myinvites = sql.prepare('SELECT * FROM joins WHERE inviter=?').all(username.id)
        if(myinvites) joins = myinvites.length

        let myinvites2 = sql.prepare('SELECT * FROM leaves WHERE inviter=?').all(username.id);
        if(myinvites2) leaves = myinvites2.length

        let is = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setAuthor(`${client.config.serverName}`,client.user.avatarURL())
            .setTitle(client.l.utilities.invites.inviteInfo.replace('%USER%', username.username))
            .addField(client.l.utilities.invites.net,`**${joins-leaves}**`, true)
            .addField(client.l.utilities.invites.joins,`**${joins}**`, true)
            .addField(client.l.utilities.invites.leaves,`**${leaves}**`, true)
            .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

        message.channel.send(is)
    }

}

// © Zeltux Discord Bot | Do Not Copy