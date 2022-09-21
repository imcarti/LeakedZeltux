const { MessageEmbed } = require("discord.js")

exports.run = (client, message, args) => {
  const snipes = client.snipes.get(message.channel.id) || [];
  const msg = snipes[args[0] - 1 || 0];

  let noSnipeEmbed = new MessageEmbed()
    .setColor(client.config.colour)
    .setTitle(client.l.utilities.snipe.noMessages)
    .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

  if(!msg) return message.channel.send(noSnipeEmbed)
  const Embed = new MessageEmbed()
    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({ dynamic: true, size: 256 }))
    .setTitle(`"${msg.content}"`)
    .setDescription(`${client.l.utilities.snipe.timeDeleted} ${msg.date}\n${client.l.utilities.snipe.snipe} ${args[0] || 1}/${snipes.length}`)
    .setColor(client.config.colour)
    .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
  if(msg.attachment) Embed.setImage(msg.attachment)
  message.channel.send(Embed);
}