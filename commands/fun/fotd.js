const Discord = require("discord.js");
const request = require('request')

exports.run = (client, message, args) => {
    message.delete()  

    var url = 'https://uselessfacts.jsph.pl/today.json?language=en'

    request(url, function(err, response, body) {

        if(err) {
            console.log(err)
        }

        fact = JSON.parse(body).text

        let fotdEmbed = new Discord.MessageEmbed()
            .setTitle(client.l.fun.fotd.fact)
            .setDescription(fact)
            .setColor(client.config.colour)
            .setFooter(client.l.fun.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
        message.channel.send(fotdEmbed)
    })
    
}

// © Zeltux Discord Bot | Do Not Copy