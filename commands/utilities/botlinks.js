const Discord = require("discord.js");

exports.run = (client, message, args) => {
    message.delete()

    let bot = new Discord.MessageEmbed()
        .setAuthor("Zeltux","https://cdn.discordapp.com/attachments/632238663094370366/632916675808854026/profile.png")
        .setTitle("Zeltux - Quick Links")
        .setColor(`#FF0062`)
        .addField(`Website`,`[Website](https://zeltux.net/)`, true)
        .addField(`GitHub`,`[Github](https://github.com/MattDoyle1/Zeltux)`, true)
        .addField(`Wiki`,`[Wiki](https://wiki.zeltux.net/)`, true)
        .addField(`MC-Market`,`[MC Market](https://download.zeltux.net/)`, true)
        .addField(`Marketplace`,`[Marketplace](https://www.zeltux.net/resources/)`, true)
        .addField(`Discord`,`[Discord](https://discord.zeltux.net/)`, true)
        .setFooter(`© Zeltux | Owned by Matt | Developed by Matt & Azono\nCommand ran by ${message.author.username}`,"https://cdn.discordapp.com/attachments/632238663094370366/632916675808854026/profile.png")

    message.channel.send(bot)

}

// © Zeltux Discord Bot | Do Not Copy