const Discord = require("discord.js");

exports.run = (client, message, args) => {
  message.delete()

  function getChan (chan) {
    if (!chan.includes('<#') && !chan.includes('>')) return undefined
    chan = chan.replace('<#', '')
    chan = chan.replace('>', '')
    chan = client.findChannel(chan)
    return chan
  }

  function sendChannelDetails (channel, message){

    let parent = ''
    if (channel.parentID) parent = message.guild.channels.cache.find(c=>c.id===channel.parentID)
    parent=parent.name

	let channelIDo = "812673"

    let emb = new Discord.MessageEmbed()
      .setTitle('#' + channel.name)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.config.colour)
      .addField(`${client.l.utilities.channelinfo.type}`, channel.type, true)
      .addField(`${client.l.utilities.channelinfo.createdAt}`, channel.createdAt, true)
      .addField(`${client.l.utilities.channelinfo.ID}`, channel.id, true)
      .addField(`${client.l.utilities.channelinfo.topic}`, channel.topic ?  channel.topic : 'N/A', true)
      .addField(`${client.l.utilities.channelinfo.NSFW}`, channel.nsfw, true)
      .addField(`${client.l.utilities.channelinfo.category}`, channel.parentID ? parent : 'N/A', true)
      .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    message.channel.send(emb)

  }

  let chan = args[0]
    if (chan) {
      chan = getChan(chan)
      if (chan === undefined) {
        sendChannelDetails(message.channel, message)
      }
      else {
        sendChannelDetails(chan, message)
      }
    }
    else {
      sendChannelDetails(message.channel, message)
    }
 
}

// © Zeltux Discord Bot | Do Not Copy