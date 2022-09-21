const Discord = require("discord.js")
const SQLite = require("better-sqlite3")
const usersMap = new Map();

module.exports = {

    inviteFilter: async function(client, message){
        theMessage = message.content.toLowerCase()
        if(theMessage.includes("discord.gg" || "discordapp.com/invite/")){ 
            let roles = []
            if(client.config.inviteBypassRoles){
              client.config.inviteBypassRoles.forEach(role => roles.push(client.findRole(role)))
            }
            let channels = []
            if(client.config.inviteBypassChannels){
              client.config.inviteBypassChannels.forEach(channel => channels.push(client.findChannel(channel)))
            }
            flag = false
            roles.forEach(role => {if(message.member.roles.cache.find(r => r.id === role.id)) flag = true})
            channels.forEach(channel => {if(message.channel.id === channel.id) flag = true})
            if((flag === false)){
              message.delete()
              var inviteFilterEmbed = new Discord.MessageEmbed()
                .setColor(client.config.colour)
                .setDescription(client.l.events.filters.advertise.advertise)
                .setFooter(client.l.events.filters.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
              const inviteFilterMessage = await message.channel.send(inviteFilterEmbed);setTimeout(() => {inviteFilterMessage.delete()}, 6000)
              const log = new Discord.MessageEmbed()
                .setColor(client.config.colour)
                .setTitle(client.l.events.filters.advertise.log)
                .setDescription(`${client.l.gen.logs.user} ${message.author}\n${client.l.gen.logs.channel} ${message.channel}\n${client.l.gen.logs.message} ${message}`)
                .setTimestamp(message.createdAt)
              client.logChannel.send(log)
              return 
            }
        }
    },
    swearFilter: async function(client, message){
      theMessage = message.content.toLowerCase()
      let swearWords = client.config.swearWords
      swearWords.forEach(async function(swearWord){
        if(theMessage.includes(swearWord)){       
          let roles = []
          if(client.config.swearBypassRoles){
            client.config.swearBypassRoles.forEach(role => roles.push(client.findRole(role)))
          }
          let channels = []
          if(client.config.swearBypassChannels){
            client.config.swearBypassChannels.forEach(channel => channels.push(client.findChannel(channel)))
          }
          flag = false
          roles.forEach(role => {if(message.member.roles.cache.find(r => r.id === role.id)) flag = true})
          channels.forEach(channel => {if(message.channel.id === channel.id) flag = true})
          if((flag === false)){
            message.delete()
            var swearFilterEmbed = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setDescription(client.l.events.filters.swear.swear)
            .setFooter(client.l.events.filters.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
            const swearFilterMessage = await message.channel.send(swearFilterEmbed); setTimeout(() => {swearFilterMessage.delete()}, 6000)
            const log = new Discord.MessageEmbed()
                .setColor(client.config.colour)
                .setTitle(client.l.events.filters.swear.log)
                .setDescription(`${client.l.gen.logs.user} ${message.author}\n${client.l.gen.logs.channel} ${message.channel}\n${client.l.gen.logs.message} ${message}`)
                .setTimestamp(message.createdAt)
            client.logChannel.send(log)
            return 
              
          }
        } 
      })
    },
    antiSpam: async function(client, message){

        let roles = []
        if(client.config.spamBypassRoles){
          client.config.spamBypassRoles.forEach(role => roles.push(client.findRole(role)))
        }
        let channels = []
        if(client.config.spamBypassChannels){
          client.config.spamBypassChannels.forEach(channel => channels.push(client.findChannel(channel)))
        }
        flag = false
        roles.forEach(role => {if(message.member.roles.cache.find(r => r.id === role.id)) flag = true})
        channels.forEach(channel => {if(message.channel.id === channel.id) flag = true})
        if((flag === false)){
          const LIMIT = 5;
          const DIFF = 1000;
    
          const DUPELIMIT = client.config.antispamMessageLimit
          const DUPEDIFF = client.config.antispamTimeLimit
          const TIME = client.config.antiSpamMuteTime
    
          var doMuteEvent = function() {
            message.member.roles.add(client.mutedRole)
            const muted = new Discord.MessageEmbed()
              .setColor(client.config.colour)
              .setTitle(client.l.moderation.tempMute.tempMuted)
              .setDescription(`${client.l.gen.logs.user} ${message.author}\n${client.l.gen.logs.staffMember} ${client.config.botName}\n${client.l.moderation.tempMute.time} ${TIME/1000}s\n${client.l.gen.logs.reason} ${client.l.events.antispam.muted}`) 
              .setFooter(client.l.events.antispam.footer.replace('%SERVERNAME%', client.config.serverName)) 
            message.channel.send(muted)
          }
          var doUnmuteEvent = function() {
            message.member.roles.remove(client.mutedRole)
            const muted = new Discord.MessageEmbed()
              .setColor(client.config.colour)
              .setTitle(client.l.events.antispam.unmuted)
              .setDescription(`${client.l.gen.logs.user} ${message.author}`)
              .setFooter(client.l.events.antispam.footer.replace('%SERVERNAME%', client.config.serverName))
            message.channel.send(muted)
          }
    
          if(usersMap.has(message.author.id)) {
    
            const userData = usersMap.get(message.author.id);
            const { lastMessage, timer } = userData;
            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;
            let dupeCount = userData.dupeCount;
    
            if (message.content.toLowerCase() === userData.lastMessage.content.toLowerCase()) {
                if(difference > DUPEDIFF) {
                    clearTimeout(timer);
                    userData.dupeCount = 1;
                    userData.lastMessage = message;
                    userData.timer = setTimeout(() => {
                      usersMap.delete(message.author.id);
                    }, TIME);
                    usersMap.set(message.author.id, userData);
                  }
                  else {
                    ++dupeCount;
                    if(parseInt(dupeCount) === DUPELIMIT) {
                        doMuteEvent()
                      setTimeout(() => {
                        doUnmuteEvent()
                      }, TIME);
                    } else {
                        userData.dupeCount = dupeCount;
                        usersMap.set(message.author.id, userData);
                      }
                }
              }
    
              if(difference > DIFF) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                  usersMap.delete(message.author.id);
                }, TIME);
                usersMap.set(message.author.id, userData);
              }
              else {
                ++msgCount;
                if(parseInt(msgCount) === LIMIT) {
                  doMuteEvent()
                  setTimeout(() => {
                    doUnmuteEvent()
                  }, TIME)
                } 
                else {
                  userData.msgCount = msgCount
                  usersMap.set(message.author.id, userData)
                }
              }
            }
            else {
              let fn = setTimeout(() => {
                usersMap.delete(message.author.id);
              }, TIME);
              usersMap.set(message.author.id, {
                msgCount: 1,
                dupeCount: 1,
                lastMessage: message,
                timer: fn
              });
            }
        }
    }

}

// © Zeltux Discord Bot | Do Not Copy