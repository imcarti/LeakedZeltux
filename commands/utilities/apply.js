const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    if(client.config.applicationSystemEnabled === "off") return;

    let everyone = message.guild.roles.cache.find(x => x.name === "@everyone");

    message.guild.channels.create(`application-${message.author.username}`, {type: 'text',
    topic: message.author.id}).then(async c => {

    let roles = []
    client.config.canSeeApplication.forEach(role => roles.push(client.findRole(role)))

    flag = false
    roles.forEach(role => {c.createOverwrite(role, {VIEW_CHANNEL:false, SEND_MESSAGES:false})})

    c.createOverwrite(everyone, {SEND_MESSAGES: false,VIEW_CHANNEL: false})
    c.createOverwrite(message.author, {SEND_MESSAGES: true,VIEW_CHANNEL: true})
    c.setParent(client.applicationCategory)

    var questions = client.config.applicationQuestions
    var n = 1
    var answers = []
    var sent = false

    totalParts = Math.ceil(questions.length/5)

    var embed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setAuthor(`${client.config.serverName} ${client.l.utilities.apply.application.replace('%USER%', message.author.tag)}`,client.user.avatarURL())
        .setTitle(client.l.utilities.apply.application.replace('%USER%', message.author.tag))
        .setDescription(client.l.utilities.apply.position.replace('%POSITION%',client.config.applicationPosition))
        .setFooter(client.l.utilities.apply.split.replace('%TOTALPARTS', totalParts).replace('%PART%', `${n}/${totalParts}`))

    var openEmbed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setDescription(client.l.utilities.apply.started.replace('%USER%', message.author.username).replace('%CHANNEL%', c))
    message.channel.send(openEmbed)

    var startEmbed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setAuthor(client.l.utilities.apply.application.replace('%USER%', message.author.tag), client.user.avatarURL())
        .setDescription(`${client.l.utilities.apply.position1.replace('%POSITION%',client.config.applicationPosition)}\n\n- ${client.l.utilities.apply.answerAll.replace('%TOTALQUESTIONS%', questions.length)}\n- ${client.l.utilities.apply.cancel}`)
    c.send(startEmbed)

    for (i = 0; i < questions.length; i++) {

        var questionEmbed = new Discord.MessageEmbed()
            .setColor(client.config.colour)
            .setTitle(`${client.l.utilities.apply.question} ${i+1}`)
            .setDescription(questions[i])

        await c.send(questionEmbed)
        const msgs = await c.awaitMessages(msg => msg.author.id === message.author.id, {time: 10000000, max: 1});
        response = msgs.map(msg => msg.content).join(" ")

        if(response === "stop" || response === "Stop" || response === "STOP"){
            
            var stopEmbed = new Discord.MessageEmbed()
                .setColor(client.config.colour)
                .setAuthor(client.l.utilities.apply.application.replace('%USER%', message.author.tag), client.user.avatarURL())
                .setDescription(`${client.l.utilities.apply.cancelled.replace('%SERVERNAME%', client.config.serverName)}\n\n ${client.l.utilities.apply.tryAgain.replace('%COMMAND%', `\`${client.config.prefix}apply\``).replace('%SERVERNAME%', client.config.serverName)}`)
            
            await c.send(stopEmbed).then(value => {
                setTimeout(() => {c.delete()}, 5000)})
                return
            }

        embed.addField(questions[i], response)

        if(((i+1)%5) === 0 & i != 0){ 
            n++
            answers.push(embed)
            var embed = new Discord.MessageEmbed()
                .setColor(client.config.colour)
                .setFooter(client.l.utilities.apply.split.replace('%TOTALPARTS%', totalParts).replace('%PART%', `${n}/${totalParts}`))

            sent = true 
                      
        }
        else{
            sent = false
        }

    }
    if(sent === false){
        answers.push(embed)
    }

    var endEmbed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.utilities.apply.thanks.replace('%SERVERNAME%', client.config.serverName))
        .setDescription(client.l.utilities.apply.deleted)

    for (i = 0; i < answers.length; i++) { 
        client.applicationChannel.send(answers[i])
    }

    await c.send(endEmbed).then(value => {
        setTimeout(() => {c.delete()}, 5000)
        return
    })

})

}

// © Zeltux Discord Bot | Do Not Copy