const Discord = require("discord.js");
const YAWN = require('yawn-yaml/cjs')
const yaml = require('js-yaml')
const fs = require("fs")

exports.run = (client, message, args) => {
    message.delete()

    let bot = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.management.config)
        .setDescription(client.l.management.setprefix.prefix.replace('%PREFIX%', `\`${args[0]}\``))
        .setFooter(client.l.management.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    message.channel.send(bot).then(() => {

        let yawn = new YAWN( fs.readFileSync(`${process.cwd()}/config/config.yml`, 'utf8'));

        if(!args[0]) return client.missingArguments(client.command, client.l.management.setprefix.usage)

        let myJson = yawn.json
        
        myJson["prefix"] = `"${args[0]}"`

        yawn.json = myJson

        fs.writeFile(`${process.cwd()}/config/config.yml`, yawn.yaml, function (err) {
            if (err) return console.log(err)
        })
    })

}

// © Zeltux Discord Bot | Do Not Copy