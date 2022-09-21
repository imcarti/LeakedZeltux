const Discord = require("discord.js");
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')

exports.run = (client, message, args) => {
    message.delete()

    var data = sql.prepare(`SELECT * FROM punishments WHERE type = 'Ban'`).all()
    
    const embed = new Discord.MessageEmbed()
      .setColor(client.config.colour)
      .setTitle(client.l.moderation.banlist.list)
      .setDescription(client.l.moderation.banlist.server.replace('%SERVERNAME%', client.config.serverName))  

    let pages = []

    data.forEach(item => {
        let duration = `\n${client.l.moderation.banlist.duration.replace('%DURATION%', item.duration)}`
        if(item.duration === null) duration = ""
        let staff = message.guild.members.cache.get(item.staff)
        let user = message.guild.members.cache.get(item.user)
        if(item.status === "A") status = ""
        if(item.status === "UB") status = `\n${client.l.moderation.banlist.unbanned}`
        pages.push([`**${item.type}** (${item.start})`, `${client.l.moderation.banlist.user.replace('%USER%', user)}\n${client.l.moderation.banlist.staffMember.replace('%STAFF%',staff)}${duration}${status}\n${client.l.moderation.banlist.reason.replace('%REASON%',item.reason)}`])
    })
 
    let maxpages = (pages.length/5)

    if(maxpages % 1 != 0) maxpages = Math.floor(maxpages)+1 

    let page = 1
    x = 0

    try{embed.addField(pages[x][0], pages[x][1])}catch{}
    try{embed.addField(pages[x+1][0], pages[x+1][1])}catch{}
    try{embed.addField(pages[x+2][0], pages[x+2][1])}catch{}
    try{embed.addField(pages[x+3][0], pages[x+3][1])}catch{}
    try{embed.addField(pages[x+4][0], pages[x+4][1])}catch{}
    embed.setFooter(`${client.l.moderation.banlist.page} ${page}/${maxpages}`)

    message.channel.send(embed).then(msg => {
        if(maxpages === 1) return
        msg.react('◀️').then(r => {
            msg.react('▶️')

            const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id
            const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id

            const backwards = msg.createReactionCollector(backwardsFilter, {time: 600000})
            const forwards = msg.createReactionCollector(forwardsFilter, {time: 600000})

            backwards.on('collect', r => {
                r.users.remove(message.author)
                if(page === 1) return
                page-- 
                x = x - 5
                embed.fields = [];
                try{embed.addField(pages[x][0], pages[x][1])}catch{}
                try{embed.addField(pages[x+1][0], pages[x+1][1])}catch{}
                try{embed.addField(pages[x+2][0], pages[x+2][1])}catch{}
                try{embed.addField(pages[x+3][0], pages[x+3][1])}catch{}
                try{embed.addField(pages[x+4][0], pages[x+4][1])}catch{}
                embed.setFooter(`${client.l.moderation.banlist.page} ${page}/${maxpages}`)
                msg.edit(embed)
            })

            forwards.on('collect', r => {
                r.users.remove(message.author)
                if(page === maxpages) return
                page++
                x = x + 5
                embed.fields = [];
                try{embed.addField(pages[x][0], pages[x][1])}catch{}
                try{embed.addField(pages[x+1][0], pages[x+1][1])}catch{}
                try{embed.addField(pages[x+2][0], pages[x+2][1])}catch{}
                try{embed.addField(pages[x+3][0], pages[x+3][1])}catch{}
                try{embed.addField(pages[x+4][0], pages[x+4][1])}catch{}
                embed.setFooter(`${client.l.moderation.banlist.page} ${page}/${maxpages}`)
                msg.edit(embed)
            })
        })
    })
}

// © Zeltux Discord Bot | Do Not Copy
