let ascii = require("figlet")
let Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
  message.delete()

  if (!args[0]) return client.missingArguments(client.command, client.l.fun.asciiart.usage)

  ascii(args.join(" "), function(err, art) {
    if (err) {

      var errorEmbed = new Discord.MessageEmbed()
        .setTitle(client.l.fun.asciiart.error)
        .setColor(client.config.colour)
      message.channel.send(errorEmbed)

      client.log(client.l.fun.asciiart.error, err)

      return
  }
  message.channel
      .send(art, { code: "md" })
      .catch(error=>{

        if (!error) return

        var tooLongEmbed = new Discord.MessageEmbed()
          .setTitle(client.l.fun.asciiart.tooLong)
          .setColor(client.config.colour)
          
        message.channel.send(tooLongEmbed)

      })
  })
  }
