const Discord = require("discord.js")
const startup = require(`${process.cwd()}/assets/events/zstartup`)
const func = require(`${process.cwd()}/assets/utils/functions`)

exports.run = async (client, message, args) => {
    message.delete()

    let embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.management.reload.reloaded)
        .setDescription(client.l.management.reload.wait)
        .setFooter(client.l.management.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
    await message.channel.send(embed)

    let clearCache = async function(){
        for (const path in require.cache) {if ((path.startsWith(`${process.cwd()}\\commands`) || path.startsWith(`${process.cwd()}\\addons`) || path.startsWith(`${process.cwd()}\\events`)) && path.endsWith('.js')) {delete require.cache[path]}}
    }

    await clearCache()

    client.destroy()

    startup.start()
    
}

// © Zeltux Discord Bot | Do Not Copy    