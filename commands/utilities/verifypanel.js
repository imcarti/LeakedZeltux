const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/udb.sqlite');

exports.run = async (client, message, args) => {
    if(client.config.verificationSystemEnabled === false) return;
    message.delete()

    let embed = new Discord.MessageEmbed()
        .setTitle(client.l.utilities.verifypanel.verify)
        .setColor(client.config.colour)
        .setDescription(`${client.l.utilities.verifypanel.message}\n\n${client.l.utilities.verifypanel.react.replace('%EMOJI%', client.config.verifyPanelEmoji)}`)
        .setAuthor(`${client.config.serverName}`, client.user.avatarURL())
        .setThumbnail(client.user.avatarURL())

    message.channel.send(embed).then((m) => {m.react(`${client.config.verifyPanelEmoji}`).then(() => {let id = m.id

    myverifypanel = { id: `${id}`,}
    const insert = sql.prepare(`INSERT OR REPLACE INTO verifypanel (id) VALUES (@id);`)
    insert.run(myverifypanel)
    })})

}

// © Zeltux Discord Bot | Do Not Copy