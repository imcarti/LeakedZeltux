const Discord = require("discord.js");

exports.run = (client, message, args) => {
    message.delete()

    let bot = new Discord.MessageEmbed()
        .setAuthor("Zeltux","https://cdn.discordapp.com/attachments/632238663094370366/632916675808854026/profile.png")
        .setTitle("Zeltux")
        .setThumbnail("https://cdn.discordapp.com/attachments/632238663094370366/632916675808854026/profile.png")
        .setColor(`#FF0062`)
        .setDescription("This server uses [Zeltux](https://zeltux.net), a multipurpose discord bot that is built with lots of features.\n\nCheck out our [MC-Market](https://download.zeltux.net) to purchase a copy for yourself.")
        .setFooter(`© Zeltux | Owned by Matt | Developed by Matt & Azono\nCommand ran by ${message.author.username}`,"https://cdn.discordapp.com/attachments/632238663094370366/632916675808854026/profile.png")

    message.channel.send(bot)

}

// © Zeltux Discord Bot | Do Not Copy