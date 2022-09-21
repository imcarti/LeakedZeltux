const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    
    let ownerID = message.guild.ownerID

    let ownerOnly = new Discord.MessageEmbed()
        .setAuthor("Zeltux Setup","https://cdn.discordapp.com/attachments/632238663094370366/632916675808854026/profile.png")
        .setColor(`#FF0062`)
        .setTitle(`🚫 Only The Owner Of The Server Can Run This Command! 🚫`)
        .setFooter(`© Zeltux | Owned by Matt | Developed by Matt & Azono\n${client.config.serverName} Utilities ➤ Command ran by ${message.author.username}`,"https://cdn.discordapp.com/attachments/632238663094370366/632916675808854026/profile.png")

    if(message.author.id != ownerID){return message.channel.send(ownerOnly)}

    let setUp = new Discord.MessageEmbed()
        .setAuthor("Zeltux Setup","https://cdn.discordapp.com/attachments/632238663094370366/632916675808854026/profile.png")
        .setColor(`#FF0062`)
        .setTitle(`Thanks for purchasing Zeltux`)
        .setDescription(`Make sure to checkout the [setup guide](https://github.com/Craftymatt2/Zeltux/wiki/Setup) to see what I create/remove!`)
        .setFooter(`© Zeltux | Owned by Matt | Developed by Matt & Azono\n${client.config.serverName} Utilities ➤ Command ran by ${message.author.username}`,"https://cdn.discordapp.com/attachments/632238663094370366/632916675808854026/profile.png")

    message.channel.send(setUp)

    // Create Roles

    let rolesMade = []

    let createBasicRole = async function(roleName) {
        await message.guild.roles.create({ data: {
            name: roleName,
            permissions:["SEND_MESSAGES","SEND_TTS_MESSAGES","CREATE_INSTANT_INVITE","CHANGE_NICKNAME","VIEW_CHANNEL","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY","MENTION_EVERYONE","USE_EXTERNAL_EMOJIS","ADD_REACTIONS","CONNECT","SPEAK","USE_VAD"]
        }})
    }

    let c = client.config

    let rolesNeeded = [
        ["L", c.autoRoles, null],
        ["S", c.verificationRole, c.verificationSystem],
        ["S", c.mutedRole, null],
        ["L", c.viewVerifyChannel, c.verificationSystem],
        ["L", c.talkInVerifyChannel, c.verificationSystem],
        ["L", c.viewLogsChannel, null],
        ["L", c.exemptFromPunishments, null],
        ["L", c.canSeeApplication, c.applicationSystem],
        ["L", c.swearBypassRoles, c.swearFilterEnabled],
        ["L", c.inviteBypassRoles, c.inviteFilterEnabled],
        ["L", c.spamBypassRoles, c.antiSpamEnabled],
        ["L", c.canSeeTicket, c.enabledFeatures.tickets],
        ["L", c.canSeeRaisedTicket, c.enabledFeatures.tickets],
        ["L", c.canSeeClosedTicket, c.enabledFeatures.tickets],
        ["L", c.replyToSuggestions, null]
    ]

    let checkRoleList = function(roles, req){
        if(roles){
            roles.forEach(role => {
                if(req === null || req === true){
                    if(!client.findRole(role) && !rolesMade.includes(role)){
                        createBasicRole(role)
                        rolesMade.push(role)
                    }
                }
            })
        }
    }

    let checkRoleSingle = function(role, req){
        if(req === null || req === true){
            if(!client.findRole(role) && !rolesMade.includes(role)){
                createBasicRole(role)
                rolesMade.push(role)
            }
        }
    }

    rolesNeeded.forEach(role => {
        if(role[0] === "L") checkRoleList(role[1], role[2])
        if(role[0] === "S") checkRoleSingle(role[1], role[2])
    })

    if(c.enabledFeatures.tickets === true && c.enableCategories === true){
        c.ticketCategories.forEach(cat => {
            cat.roles.forEach(role => {
                if(!client.findRole(role) && !rolesMade.includes(role)) {
                    createBasicRole(role)
                }
            })
        })
    }

    for(var key in client.cmds){
        if(key != "example1" || key != "example1"){
            if(client.cmds[key].permissions){
                client.cmds[key].permissions.forEach(role => {
                    if(!client.findRole(role) && !rolesMade.includes(role)){ 
                        createBasicRole(role)
                    }
                })
            }
        }
    }
    
    let channelsNeeded = [
        ["L", c.commandChannels, null, true, true],
        ["S", c.joinChannel, c.joinMessage, true, false],
        ["S", c.leaveChannel, c.leaveMessage, true, false],
        ["S", c.verificationChannel, c.verificationSystem, true, true],
        ["S", c.logChannel, null, false, false],
        ["S", c.suggestionChannel, null, true, false],
        ["S", c.reportChannel, null, false, false],
        ["S", c.bugChannel, null, false, false],
        ["C", c.ticketCategory, c.enabledFeatures.tickets, false, false],
        ["C", c.applicationCategory, c.applicationSystem, false, false],
        ["S", c.applicationChannel, c.applicationSystem, false, false],
        ["S", c.levelChannel, c.enabledFeatures.levels, true, false],
        ["S", c.youtubeUpdatesChannel, c.youtubeUpdatesSystemEnabled, true, false],
        ["L", c.swearBypassChannels, c.swearFilterEnabled, true, true],
        ["L", c.inviteBypassChannels, c.inviteFilterEnabled, true, true],
        ["L", c.spamBypassChannels, c.antiSpamEnabled, true, true]
    ]

    const everyone = message.guild.roles.cache.find(x => x.name === "@everyone");

    let channelsMade = []
    let categoriesMade = []

    let createChannel = async function(channel, view, send){
        if(!channelsMade.includes(channel)){
            await message.guild.channels.create(`${channel}`, {type: 'text'})
            let chn = client.findChannel(channel)
            await chn.createOverwrite(everyone, {SEND_MESSAGES: send, VIEW_CHANNEL: view})
        }
    }
    let createCategory = async function(channel, view, send){
        if(!categoriesMade.includes(channel)){
            await message.guild.channels.create(`${channel}`, {type: 'category'})
            let chn = client.findChannel(channel)
            await chn.createOverwrite(everyone, {SEND_MESSAGES: send, VIEW_CHANNEL: view})
            categoriesMade.push(channel)
        }
    }

    let checkChannelList = function(channels, req, view, send){
        if(channels){
            channels.forEach(channel => {
                if(req === null || req === true){
                    if(!client.findChannel(channel)){
                        createChannel(channel, view, send)
                        channelsMade.push(channel)
                    }
                }
            })
        }
    }
    let checkChannelSingle = function(channel, req, view, send){
        if(req === null || req === true){
            if(!client.findChannel(channel) && channel != ""){
                createChannel(channel, view, send)
                channelsMade.push(channel)
            }
        }
    }
    let checkCategorySingle = function(channel, req, view, send){
        if(req === null || req === true){
            if(!client.findCategory(channel)){
                createCategory(channel, view, send)
                categoriesMade.push(channel)
            }
        }
    }

    channelsNeeded.forEach(channel => {
        if(channel[0] === "L") checkChannelList(channel[1], channel[2], channel[3], channel[4])
        if(channel[0] === "S") checkChannelSingle(channel[1], channel[2], channel[3], channel[4])
        if(channel[0] === "C") checkCategorySingle(channel[1], channel[2], channel[3], channel[4])
    })

    if(c.enabledFeatures.tickets === true && c.enableCategories === true){
        c.ticketCategories.forEach(cat => {
            if(!client.findCategory(cat.category)){
                createCategory(cat.category, view, send)
                categoriesMade.push(channel)
            }
        })
    }    
    
    if(client.config.verificationSystemEnabled === true){
        // Set Channel Perms For Everyone
        var verificationRole = client.findRole(client.config.verificationRole)
        verificationRole.setPermissions(["SEND_MESSAGES","SEND_TTS_MESSAGES","CREATE_INSTANT_INVITE","CHANGE_NICKNAME","VIEW_CHANNEL","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY","MENTION_EVERYONE","USE_EXTERNAL_EMOJIS","ADD_REACTIONS","CONNECT","SPEAK","USE_VAD"])

        message.guild.channels.cache.forEach(async channel => { 
            await channel.createOverwrite(everyone, {SEND_MESSAGES: true, VIEW_CHANNEL: false})
        })
        
        // Set Channel Perms For Verified Group
        message.guild.channels.cache.forEach(async channel => { 
            await channel.createOverwrite(verificationRole, {SEND_MESSAGES: true, VIEW_CHANNEL: true})
        })

        // Everyone can talk in verification channel
        await client.verificationChannel.createOverwrite(everyone, {SEND_MESSAGES: true, VIEW_CHANNEL: true})
    }

    // Set Channel Perms For Muted Group
    var mutedRole = client.findRole(client.config.mutedRole)
    mutedRole.setPermission(["CREATE_INSTANT_INVITE","CHANGE_NICKNAME","VIEW_CHANNEL","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY","MENTION_EVERYONE","USE_EXTERNAL_EMOJIS","ADD_REACTIONS","CONNECT","SPEAK","USE_VAD"])
    message.guild.channels.cache.forEach(async channel => { 
        await channel.createOverwrite(mutedRole, {SEND_MESSAGES: false, VIEW_CHANNEL: null})
    })

}

// © Zeltux Discord Bot | Do Not Copy