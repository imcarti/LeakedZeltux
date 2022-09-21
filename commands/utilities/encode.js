const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return client.missingArguments(client.command, client.l.utilities.encode.usage)
  let encodedString = args
    .join(" ")
    .split("")
    .map(x => x.charCodeAt(0).toString(2))
    .join(" ");
  message.channel.send(
    new Discord.MessageEmbed()
      .setDescription(encodedString)
      .setColor(client.config.colour)
  );
};
