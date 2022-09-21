const Discord = require("discord.js")
const fs = require("fs");
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')
const func = require(`${process.cwd()}/assets/utils/functions`)

module.exports = async (client, reaction, user) => {

    client.log = function(title, log){
      return func.log(client, title, log)
    }
    
    // Suggestions
    let editMsg = async function(msg, text, colour){
      let embed = new Discord.MessageEmbed()
        .setTitle(text)
        .setDescription(msg.embeds[0].description)
        .setColor(colour)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(msg.embeds[0].footer.text)
        .setTimestamp()

      msg.edit(embed)
      reaction.users.remove(user)
    }
    let mysuggestion = sql.prepare('SELECT * FROM suggestions WHERE id=?').get(reaction.message.id);
    if(mysuggestion) {
      let flag = false
      let roles = []
      let member = reaction.message.guild.members.cache.get(`${user.id}`)
      client.config.replyToSuggestions.forEach(role => roles.push(client.findRole(role)))
      roles.forEach(role => {if(member.roles.cache.find(r => r.id === role.id)) flag = true})
      if(flag === false) return
      if(reaction.emoji.name === client.config.suggestions.accept){
        reaction.message.channel.messages.fetch(reaction.message.id)
        .then(msg => {editMsg(msg, client.l.utilities.suggest.accepted, "00FF00")})
      }
      else if(reaction.emoji.name === client.config.suggestions.deny){
        reaction.message.channel.messages.fetch(reaction.message.id)
        .then(msg => {editMsg(msg, client.l.utilities.suggest.denied, "FF0000")})
      }
    }
    // Ticket Panel
    let myticketpanel = sql.prepare('SELECT * FROM ticketpanel WHERE id=?').get(reaction.message.id);
    if(myticketpanel) { 

      if (reaction.emoji.name === client.config.ticketPanelEmoji && !user.bot){

        msg = `${client.config.prefix}None Specified`
        const args = msg.slice(client.config.prefix.length).trim().split(/ +/g);
        let message = reaction.message
        message.author = user
        
        client.ticketCategory = client.findChannel(client.config.ticketCategory)
        
        const command = "new"
        const cmd = client.commands.get(command)
        cmd.run(client, message, args)

        reaction.users.remove(user)
    }}
    // Verification Panel
    let myverifypanel = sql.prepare('SELECT * FROM verifypanel WHERE id=?').get(reaction.message.id);
    if(myverifypanel) { 
      if (reaction.emoji.name === client.config.verifyPanelEmoji && !user.bot){
        let role = client.findRole(client.config.verificationRole)
        user2 = await reaction.message.guild.members.fetch(user.id)
        user2.roles.add(role)
        reaction.users.remove(user2)
    }}
    // Reaction Roles
    let myreactionroles = sql.prepare('SELECT * FROM reactionrole WHERE message = ?').all(reaction.message.id)
    if(myreactionroles) { 
      myreactionroles.forEach(async rr => {
        if (reaction.emoji.name === rr.reaction && !user.bot){
          let role = client.findRole(rr.role)
          user3 = await reaction.message.guild.members.fetch(user.id);
          user3.roles.add(role)

          let embed = new Discord.MessageEmbed()
            .setTitle(`Role added in ${client.config.serverName}`)
            .setColor(client.config.colour)
            .setDescription(`You added the **${role.name}** role by reacting with ${reaction.emoji.name} in **${client.config.serverName}**.`)
          user3.send(embed).catch((err) => {})

         }
      })
    }
    // Giveaways
    let giveaways = require("../data/giveaways.json")
    let giveaway = giveaways.find(g => g.messageID == reaction.message.id)
    if (reaction.emoji.name == client.config.giveawayEmoji && giveaway && !user.bot) {
      giveaways
        .find(g => g.messageID == reaction.message.id)
        .reactions.push(user.id);
      fs.writeFile("../data/giveaways.json", JSON.stringify(giveaways), function(err) {
        if (err) console.log(err);
      });
    }

}

// © Zeltux Discord Bot | Do Not Copy