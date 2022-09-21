const Discord = require("discord.js")

module.exports = {

    checkAllRolesExist: function(client, message){
        let c = client.config
       
        let rolesNeeded = [
            ["L", c.autoRoles, null, "Auto Roles"],
            ["S", c.verificationRole, c.verificationSystem, "Verified Role"],
            ["S", c.mutedRole, null, "Muted Role"],
            ["L", c.viewVerifyChannel, c.verificationSystem, "View Verified Channel"],
            ["L", c.talkInVerifyChannel, c.verificationSystem, "Talk In Verify Channel"],
            ["L", c.viewLogsChannel, null, "View Logs Channel"],
            ["L", c.exemptFromPunishments, null, "Exempt From Punishments"],
            ["L", c.canSeeApplication, c.applicationSystem, "See Application Channel"],
            ["L", c.swearBypassRoles, c.swearFilterEnabled, "Swear Bypass"],
            ["L", c.inviteBypassRoles, c.inviteFilterEnabled, "Invite Bypass"],
            ["L", c.spamBypassRoles, c.antiSpamEnabled, "Antispam Bypass"],
            ["L", c.canSeeTicket, c.enabledFeatures.tickets, "View Tickets"],
            ["L", c.canSeeRaisedTicket, c.enabledFeatures.tickets, "View Raised Tickets"],
            ["L", c.canSeeClosedTicket, c.enabledFeatures.tickets, "View Closed Tickets"],
            ["L", c.replyToSuggestions, null, "Reply To Suggestions"]

        ]

        let roleDesc = ""

        let checkRoleList = function(roles, req, reason){
            if(roles){
                roles.forEach(role => {
                    if(req === null || req === true){
                        if(!client.findRole(role)){
                            console.log(`\x1b[31mMissing role \x1b[33m${role} \x1b[31mwhich is needed for \x1b[33m${reason}\x1b[31m.\u001b[0m`)
                            roleDesc += `${role} - ${reason}\n`
                        }
                    }
                })
            }
        }
        let checkRoleSingle = function(role, req, reason){
            if(req === null || req === true){
                if(!client.findRole(role)){
                    console.log(`\x1b[31mMissing role \x1b[33m${role} \x1b[31mwhich is needed for \x1b[33m${reason}\x1b[31m.\u001b[0m`)
                    roleDesc += `${role} - ${reason}\n`
                }
            }
        }

        rolesNeeded.forEach(role => {
            if(role[0] === "L") checkRoleList(role[1], role[2], role[3])
            if(role[0] === "S") checkRoleSingle(role[1], role[2], role[3])
        })

        if(c.enabledFeatures.tickets === true && c.enableCategories === true){
            c.ticketCategories.forEach(cat => {
                cat.roles.forEach(role => {
                    if(!client.findRole(role)) {
                        console.log(`\x1b[31mMissing role \x1b[33m${role} \x1b[31mwhich is needed for \x1b[33mTicket Category (${cat.name})\x1b[31m.\u001b[0m`)
                        roleDesc += `${role} - Ticket category ${cat.name}\n`
                    }
                })
            })
        }

        let role2Desc = ""

        let roles = []
        for(var key in client.cmds){
            if(key != "example1" || key != "example1"){
                if(client.cmds[key].permissions){
                    client.cmds[key].permissions.forEach(role => {
                        if(!client.findRole(role)){ 
                            if(!roles.includes(role)){
                                roles.push(role)
                                console.log(`\x1b[31mMissing role \x1b[33m${role} \x1b[31mwhich is needed for \x1b[33mpermissions to a command\x1b[31m.\u001b[0m`)
                                role2Desc += `${role} - Permissions\n`
                            }
                        }
                    })
                }
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("__Missing Roles__")
            .setColor("#FF0062")
        if(roleDesc != "") embed.addField("Config.yml", roleDesc)
        if(role2Desc != "") embed.addField("Commands.yml", role2Desc)

        if(roleDesc != "" || role2Desc != "") return embed
        else{return null}

    },
    checkAllChannelsExist: function(client, message){
        let c = client.config

        let channelsNeeded = [
            ["L", c.commandChannels, null, "Command Channel"],
            ["S", c.joinChannel, c.joinMessage, "Join Message Channel"],
            ["S", c.leaveChannel, c.leaveMessage, "Leave Message Channel"],
            ["S", c.verificationChannel, c.verificationSystem, "Verify Channel"],
            ["S", c.logChannel, null, "Log Channel"],
            ["S", c.suggestionChannel, null, "Suggestion Channel"],
            ["S", c.reportChannel, null, "Report Channel"],
            ["S", c.bugChannel, null, "Bug Channel"],
            ["C", c.ticketCategory, c.enabledFeatures.tickets, "Ticket Category"],
            ["C", c.applicationCategory, c.applicationSystem, "Application Category"],
            ["S", c.applicationChannel, c.applicationSystem, "Application Channel"],
            ["S", c.levelChannel, c.enabledFeatures.levels, "Level Channel"],
            ["S", c.youtubeUpdatesChannel, c.youtubeUpdatesSystemEnabled, "YouTube Updates Channel"],
            ["L", c.swearBypassChannels, c.swearFilterEnabled, "Swear Filter Bypass Channel"],
            ["L", c.inviteBypassChannels, c.inviteFilterEnabled, "Invite Filter Bypass Channel"],
            ["L", c.spamBypassChannels, c.antiSpamEnabled, "Antispam Bypass Channel"]
        ]

        let channelDesc = ""

        let checkChannelList = function(channels, req, reason){
            if(channels){
                channels.forEach(channel => {
                    if(req === null || req === true){
                        if(!client.findChannel(channel)){
                            console.log(`\x1b[31mMissing channel \x1b[33m${channel} \x1b[31mwhich is needed for \x1b[33m${reason}\x1b[31m.\u001b[0m`)
                            channelDesc += `${channel} - ${reason}\n`
                        }
                    }
                })
            }
        }
        let checkChannelSingle = function(channel, req, reason){
            if(req === null || req === true){
                if(!client.findChannel(channel) && channel != ""){
                    console.log(`\x1b[31mMissing channel \x1b[33m${channel} \x1b[31mwhich is needed for \x1b[33m${reason}\x1b[31m.\u001b[0m`)
                    channelDesc += `${channel} - ${reason}\n`
                }
            }
        }
        let checkCategorySingle = function(channel, req, reason){
            if(req === null || req === true){
                if(!client.findCategory(channel)){
                    console.log(`\x1b[31mMissing category \x1b[33m${channel} \x1b[31mwhich is needed for \x1b[33m${reason}\x1b[31m.\u001b[0m`)
                    channelDesc += `${channel} - ${reason}\n`
                }
            }
        }

        channelsNeeded.forEach(channel => {
            if(channel[0] === "L") checkChannelList(channel[1], channel[2], channel[3])
            if(channel[0] === "S") checkChannelSingle(channel[1], channel[2], channel[3])
            if(channel[0] === "C") checkCategorySingle(channel[1], channel[2], channel[3])
        })

        if(c.enabledFeatures.tickets === true && c.enableCategories === true){
            c.ticketCategories.forEach(cat => {
                if(!client.findCategory(cat.category))console.log(`\x1b[31mMissing category \x1b[33m${cat.category} \x1b[31mwhich is needed for \x1b[33mTicket Category (${cat.name})\x1b[31m.\u001b[0m`)
            })
        }
        
        let embed = new Discord.MessageEmbed()
            .setTitle("__Missing Channels/Categories__")
            .setColor("#FF0062")
        if(channelDesc != "") embed.addField("Config.yml", channelDesc)

        if(channelDesc != "") return embed
        else{return null}
    },
    setupEvent: function(client, message){
        const setup = require(`${process.cwd()}/assets/events/setup`)
        let roles = setup.checkAllRolesExist(client, message)
        let channels = setup.checkAllChannelsExist(client, message)
  
        if(roles != null || channels != null){
          let missingEmbedStart = new Discord.MessageEmbed()
            .setTitle("Your guild is missing some features needed for Zeltux run.")
            .setDescription("Please create the following roles and channels, or run `-setup` and the bot will create them for you.")
            .setFooter("© Zeltux | Owned by Matt | Developed by Matt & Azono")
            .setColor("#FF0062")
          message.channel.send(missingEmbedStart)
          if(roles != null) message.channel.send(roles)
          if(channels != null) message.channel.send(channels)
          return true
        }
  
        let missingAdminPermsEmbed = new Discord.MessageEmbed()
          .setAuthor("Zeltux Setup - Missing Admin Perms!")
          .setTitle("Your guild is missing admin permissions.")
          .setDescription(`You need to give your bot the \`ADMINISTRATOR\` permission for Zeltux to function.`)
          .setColor("FF0062")
  
        if(!message.guild.me.hasPermission('ADMINISTRATOR')){
          message.channel.send(missingAdminPermsEmbed)
          console.log(`\x1b[41mERROR\x1b[40m \x1b[31m ${client.config.botName} Is missing the administrator permission, give it to it's role or the bot cannot fuunction!\n`)
          return true
        }
        return false
    }

}

// © Zeltux Discord Bot | Do Not Copy