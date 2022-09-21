const Discord = require("discord.js")
const yaml = require('js-yaml')
const fs = require("fs")
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')

module.exports = {

    log: function(client, title, log){
        const logEmbed = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(`${client.l.gen.logs.emoji} ${title}`)
            .setDescription(log)
            .setTimestamp() 
        client.logChannel.send(logEmbed)
    },
    loadFile: function(file){
        return myFile = yaml.safeLoad(fs.readFileSync(`${file}`, 'utf8'))
    },
    missingArgs: async function(client, message, command, usage){
        const missingArgs = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(`🚫 ${client.l.gen.err.missingArgs}`)
            .setDescription(`${client.l.gen.err.usage} \`${client.config.prefix}${command} ${usage}\``)
            .setFooter(`${client.config.serverName} ➤ ${message.author.username}`)
         
        const fail = await message.channel.send(missingArgs)

        setTimeout(() => {
            fail.delete()
        }, 3000)
    },
    nextPrimaryKey: function(table){
        var data = sql.prepare(`SELECT MAX(id) FROM ${table}`).get()
        id = data['MAX(id)'] + 1
        if(!id) id = 1
        return id
    }

}