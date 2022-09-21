const Discord = require("discord.js");
const request = require('request')

exports.run = async (client, message, args) => {
    message.delete()

    let hex = args.join(" ");

    if(!args.join(" ")) return client.missingArguments(client.command, `<${client.l.utilities.hexcolour.usage}>\`\n${client.l.utilities.hexcolour.capitals}`)

    var test = /^[0-9A-F]{6}$/i.test(hex);

    if(!(test == true)) return client.missingArguments(client.command, `<${client.l.utilities.hexcolour.usage}>\`\n${client.l.utilities.hexcolour.capitals}`)

    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    var rgb = `${r}, ${g}, ${b}`


    var url = `https://www.thecolorapi.com/id?hex=${hex}`

    request(url, function(err, response, body) {

      if(err) {
        console.log(err);return message.channel.send(`⚠ **An Error Occured** in getting the colour, contact Zeltux's support team if this error persists! ⚠`)
      }
      
      body = JSON.parse(body)

      var name = body.name.value

    let msg = new Discord.MessageEmbed()
        .setTitle(`${client.l.utilities.hexcolour.colour} #${hex}`)
        .setThumbnail(`http://www.singlecolorimage.com/get/${hex}/100x100`)
        .addField(`${client.l.utilities.hexcolour.name}`,name,true)
        .addField(`${client.l.utilities.hexcolour.hex}`,hex,true)
        .addField(`${client.l.utilities.hexcolour.rgb}`,rgb,true)
        .setColor(`#${hex}`)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    message.channel.send(msg)

    })

}

// © Zeltux Discord Bot | Do Not Copy