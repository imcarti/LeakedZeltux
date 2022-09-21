const Discord = require("discord.js");
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')

exports.run = async (client, message, args) => {
    message.delete()

    var user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0])) || message.author

    var data = sql.prepare(`SELECT * FROM punishments WHERE user = ${user.id}`).all()
    
    const embed = new Discord.MessageEmbed()
      .setColor(client.config.colour)
      .setTitle(client.l.moderation.history.history)
      .setDescription(client.l.moderation.history.user.replace('%USER%', user))  

    let pages = []

    data.forEach(item => {
        let duration = `\n${client.l.moderation.history.duration.replace('%DURATION%', item.duration)}`
        if(item.duration === null) duration = ""
        let staff = message.guild.members.cache.get(item.staff)
        if(item.status === "A") status = ""
        if(item.status === "UB") status = `\n${client.l.moderation.history.unbanned}`
        if(item.status === "UM") status = `\n${client.l.moderation.history.unmuted}`
        if(item.status === "UW") status = `\n${client.l.moderation.history.unwarned}`
        pages.push([`[${item.id}] **${item.type}** (${item.start})`, `${client.l.moderation.history.staffMember.replace('%STAFF%',staff)}${duration}${status}\n${client.l.moderation.history.reason.replace('%REASON%',item.reason)}`])
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
    embed.setFooter(`${client.l.moderation.history.page} ${page}/${maxpages}`)

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
                embed.setFooter(`${client.l.moderation.history.page} ${page}/${maxpages}`)
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
                embed.setFooter(`${client.l.moderation.history.page} ${page}/${maxpages}`)
                msg.edit(embed)
            })
        })
    })
}

// © Zeltux Discord Bot | Do Not Copy
