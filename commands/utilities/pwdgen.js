const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete()

    if(!(/^\d+$/.test(args[0]))){var length = 12}
    else{
        if(args[0]) 
        if(args[0] > 75) var length = 12
        else var length = args[0]; 
        else var length = 12}
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!£$%&@#*)({}][;:~.>,<?",
    retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    if(length < 8) var secure = client.l.utilities.pwdgen.insecure
    else if(length >= 14) var secure = client.l.utilities.pwdgen.verySecure
    else if(length >= 8) var secure = client.l.utilities.pwdgen.secure

    var embed = new Discord.MessageEmbed()
        .setTitle(client.l.utilities.pwdgen.pwdgen)
        .addField(client.l.utilities.pwdgen.password, `**\`${retVal}\`**`, true)
        .addField(client.l.utilities.pwdgen.length, length, true)
        .addField(client.l.utilities.pwdgen.securityRating, secure, true)
        .setColor(client.config.colour)
        .setFooter(`${client.l.utilities.pwdgen.note}`)

    const failed = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.utilities.pwdgen.dm.failed)
        .setDescription(`${client.l.utilities.pwdgen.dm.failTitle}\n${client.l.utilities.pwdgen.dm.failMsg}`)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    async function failf(){
        const fail = await message.channel.send(failed);setTimeout(() => {fail.delete()}, 6000) 
    }

    message.author.send(embed).catch(() => failf())

}

// © Zeltux Discord Bot | Do Not Copy