
/*

Zeltux Notice

We will not be able to provide support to you if you modify the contents
of any file. So if you change something and break it, do not expect support, 
you will be blacklisted forever.

*/

const Discord = require("discord.js");
const fs = require("fs");
const func = require(`${process.cwd()}/assets/utils/functions`)
const setup = require(`${process.cwd()}/assets/events/setup`)
const ticketTranscript = require(`${process.cwd()}/assets/handlers/transcript-handler`)
const filters = require(`${process.cwd()}/assets/handlers/filter-handler`)
const ar = require(`${process.cwd()}/assets/handlers/autoresponse-handler`)

const coolDown = new Set();

module.exports = (client, message) => {
    if (!message.guild) return

    ticketTranscript.messageEvent(client, message)
    ar.execute(client, message)
    
    if (message.author.bot) return

    client.log = function(title, log){
      return func.log(client, title, log)
    }

    if (message.content.indexOf(client.config.prefix) === 0) {
      if(!message.content.includes("setup")){
        if(setup.setupEvent(client, message) === true) return
      }
    }

    // Channels
    client.logChannel = client.findChannel(client.config.logChannel)
    client.verificationChannel = client.findChannel(client.config.verificationChannel)
    client.levelChannel = client.findChannel(client.config.levelChannel)
    client.applicationChannel = client.findChannel(client.config.applicationChannel)
    client.suggestionChannel = client.findChannel(client.config.suggestionChannel)
    client.reportChannel = client.findChannel(client.config.reportChannel)
    client.bugChannel = client.findChannel(client.config.bugChannel)
    client.commandChannels = []
    client.config.commandChannels.forEach(chn => {client.commandChannels.push(client.findChannel(chn).id)})
    // Categories
    client.applicationCategory = client.findChannel(client.config.applicationCategory)
    client.ticketCategory = client.findChannel(client.config.ticketCategory)
    // Roles
    client.verificationRole = client.findRole(client.config.verificationRole)
    client.mutedRole = client.findRole(client.config.mutedRole)

    // © Zeltux Discord Bot | Do Not Copy

    // Missing Arguments Message
    client.missingArguments = async function(command, usage){
      func.missingArgs(client, message, command, usage)
    }

    // Check Perms Function
    client.checkPermissions = function(command){
      let roles = []
      if(!client.cmds[command]){roles.push(client.findRole('@everyone'))}
      else if(client.cmds[command].permissions){
      client.cmds[command].permissions.forEach(role => roles.push(client.findRole(role)))}
      else{roles.push(client.findRole('@everyone'))}
      
      let noPerms = new Discord.MessageEmbed()
          .setColor(client.config.colour)
          .setTitle(client.l.gen.err.deniedAccess)
          .setFooter(client.l.gen.err.permissionsFooter.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

      flag = false
      roles.forEach(role => {if(message.member.roles.cache.find(r => r.id === role.id)) flag = true})

      if(flag === false){
        message.channel.send(noPerms)
        if(client.config.liveConsoleLog === true){
          console.log(`\x1b[46mLOG\x1b[0m \x1b[36m${message.author.tag} \x1b[31mwas denied access to the command!`)
        }
        return false
        }
      else{return true}
    }
    // Check Perms Function End

    // XP System
	let xpSys = "812673"
    if(client.config.enabledFeatures.levels === true) {
      if (message.content.indexOf(client.config.prefix) !== 0){
        if(client.config.levelChannel === ""){
          var sendChannel = message.channel
        }
        else{
          var sendChannel = client.levelChannel
        }
        if (coolDown.has(message.author.id)) {
          let test = null
        } else {
          let score;
          if (message.guild) {
            score = client.getScore.get(message.author.id, message.guild.id);
            if (!score) {
              score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
            }
            score.points = score.points + (Math.floor(Math.random() * Math.floor(client.config.levelMaxPoints)))
            const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
            
            if(score.level < curLevel) {
              score.level++;
              var scoreEmbed = new Discord.MessageEmbed()
                .setColor(client.config.colour)
                .setAuthor(`${client.config.serverName}`,client.user.avatarURL())
                .setTitle(client.l.events.levels.congratulations.replace('%USER%', message.author.username))
                .addField(client.l.events.levels.previous, `**${curLevel-1}**`, true)
                .addField(client.l.events.levels.new, `**${curLevel}**`, true)
                .addField(client.l.events.levels.total, `**${score.points}**`, true)
                .setFooter(client.l.fun.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
              sendChannel.send(scoreEmbed)
            }
            client.setScore.run(score);
          }
          coolDown.add(message.author.id);
          setTimeout(() => {
            coolDown.delete(message.author.id);
          }, client.config.levelCoolDown);
        }
      }
    }
    // XP System End

    // © Zeltux Discord Bot | Do Not Copy

    // Invite Filter
    if(client.config.inviteFilterEnabled === true){filters.inviteFilter(client, message)}    
    // Swear Filter
    if(client.config.swearFilterEnabled === true){filters.swearFilter(client, message)}
    // Antispam
    if(client.config.antiSpamEnabled === true){filters.antiSpam(client, message)}

    // © Zeltux Discord Bot | Do Not Copy

    // Verify Command
    if(client.config.verificationSystemEnabled === true){
      if(message.channel === client.verificationChannel){
        if(message.content === `${client.config.prefix}verify`){
          message.member.roles.add(client.verificationRole);message.delete();return}
        else{
          let roles = []
          client.config.talkInVerifyChannelRoles.forEach(role => roles.push(client.findRole(role)))

          flag = false
          roles.forEach(role => {if(message.member.roles.cache.find(r => r.id === role.id)) flag = true})

          if(flag === true){}
          else{message.delete();return}}
    }}
    // Verify Command End

    if (message.content.indexOf(client.config.prefix) !== 0) return;

    // © Zeltux Discord Bot | Do Not Copy

    if(client.config.blackList.includes(message.author.id)) return

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()

    var cmd = client.commands.get(command)

    if(cmd) client.command = command

    if(!cmd) { 
        client.commands.forEach(com => {
          if(com.name != undefined){
            if(com.aliases.includes(command)){
              cmd = client.commands.get(com.name)
              client.command = com.name
            }
          }
        })
    }

    if(!cmd) return

    client.sentCommand = command

    if(client.config.liveConsoleLog === true){
      console.log(`\x1b[46mLOG\x1b[0m \x1b[36m${message.author.tag} \x1b[33mexecuted the command \x1b[36m${message.content}\u001b[0m`)
    }

    if(cmd.type === "core") if(!client.checkPermissions(client.command)) return
    
    client.commandDetails = cmd

    if(client.config.commandChannels.length > 0) {
      if(!client.commandChannels.includes(`${message.channel.id}`)){
        if(!client.config.bypassCommands.includes(client.command)) return
      } 
    }

    if(client.config.debugMode != true){
      try {
        cmd.run(client, message, args)
      }
      catch {
        console.log(`\x1b[41mERROR\x1b[40m \x1b[31mAn unknown error occurred when running this command, please contact Zeltux's support team, with the error code \x1b[36mZ${client.command}00\x1b[31m.\u001b[0m`)
      }    
    }
    else{
      cmd.run(client, message, args)
    }

}

// © Zeltux Discord Bot | Do Not Copy