const Discord = require("discord.js");
const SQLite = require("better-sqlite3")
const sql = new SQLite('./data/udb.sqlite')

module.exports = (client, reaction, user) => {

    let giveaways = require("../data/giveaways.json");
    let giveaway = giveaways.find(g => g.messageID == reaction.message.id);
    if (
      reaction.emoji.name == client.config.giveawayEmoji &&
      giveaway &&
      giveaway.reactions.includes(user.id) &&
      !user.client
    ) {
      giveaways
        .find(g => g.messageID == reaction.message.id)
        .reactions.splice(giveaway.reactions.indexOf(user.id), 1);
      fs.writeFile("../data/giveaways.json", JSON.stringify(giveaways), function(err) {
        if (err) console.log(err);
      });
    }

    // Reaction Roles
    let myreactionroles = sql.prepare('SELECT * FROM reactionrole WHERE message = ?').all(reaction.message.id)
    if(myreactionroles) { 
      myreactionroles.forEach(async rr => {
        if (reaction.emoji.name === rr.reaction && !user.bot){
          let role = client.findRole(rr.role)
          user3 = await reaction.message.guild.members.fetch(user.id);
          user3.roles.remove(role)

          let embed = new Discord.MessageEmbed()
            .setTitle(`Role removed in ${client.config.serverName}`)
            .setColor(client.config.colour)
            .setDescription(`You removed the **${role.name}** role by reacting with ${reaction.emoji.name} in **${client.config.serverName}**.`)
          user3.send(embed).catch((err) => {})

          }
      })
    }

}

// © Zeltux Discord Bot | Do Not Copy