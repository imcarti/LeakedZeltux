const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/udb.sqlite');

exports.run = (client, message, args) => {
    message.delete()
    let invites = sql.prepare('SELECT * FROM joins').all().map(x => x.inviter).reduce((prev, cur) => {
        prev[cur] = (prev[cur] || 0) + 1
        return prev
    }, {});
    let invitesUsers = Object.keys(invites);
    let leaves = sql.prepare('SELECT * FROM leaves').all().map(x => x.inviter).reduce((prev, cur) => {
        prev[cur] = (prev[cur] || 0) + 1
        return prev
    }, {});
    let leavesUsers = Object.keys(leaves);
    let noLeaves = invitesUsers.filter(x=>!leavesUsers.includes(x)).map(x=>{return {user: x, total: invites[x]}})
    let withLeaves = invitesUsers.filter(x=>leavesUsers.includes(x)).map(x=>{
        return {user: x, total: invites[x] - leaves[x]}
    })
    let total = noLeaves.concat(withLeaves).filter(x=>x.total>0).sort((a,b) => b.total - a.total).slice(0, 10)
    let users = []
    total.map(x=>{
        user = client.users.cache.get(x.user)
        if(user) {
            users.push(x)
        }
    })

    message.channel.send(new Discord.MessageEmbed()
        .setTitle(client.config.serverName)
        .setAuthor(client.config.serverName, client.user.avatarURL())
        .setDescription(client.l.utilities.topinvites.topten)
        .setColor(client.config.colour)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
        .addFields(users.map(x=>{ 
            return {name: `[${total.indexOf(x)+1}] ${client.users.cache.get(x.user).tag}`, value: `${x.total} Invites`}
        }))
    )
}