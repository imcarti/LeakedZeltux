const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return client.missingArguments(client.command, client.l.utilities.decode.usage)
  if (
    args
      .map(x => {
        if (isNaN(parseInt(x))) return "true"
        else return "false"
      })
      .includes("true")
  )
    return client.missingArguments(client.command, client.l.utilities.decode.usage)
  let decodedString = args
    .map(x => {
      return String.fromCharCode(parseInt(x, 2))
    })
    .join("")
    let decodedEmbed = new Discord.MessageEmbed()
      .setDescription(decodedString)
      .setColor(client.config.colour)
    message.channel.send(decodedEmbed)
}
