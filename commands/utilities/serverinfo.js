const Discord = require("discord.js");

exports.run = (client, message, args) => {
    message.delete()

    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
    };
    let verifLevels = {
        "NONE": "None", 
        "LOW": "Low", 
        "MEDIUM" :"Medium", 
        "HIGH": "(╯°□°）╯︵  ┻━┻", 
        "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
    }
    let region = {
        "brazil": `:flag_br: ${client.l.utilities.serverInfo.regions.brazil}`,
        "eu-central": `:flag_eu: ${client.l.utilities.serverInfo.regions.eucentral}`,
        "singapore": `:flag_sg: ${client.l.utilities.serverInfo.regions.singapore}`,
        "us-central": `:flag_us: ${client.l.utilities.serverInfo.regions.uscentral}`,
        "sydney": `:flag_au: ${client.l.utilities.serverInfo.regions.sydney}`,
        "us-east": `:flag_us: ${client.l.utilities.serverInfo.regions.useast}`,
        "us-south": `:flag_us: ${client.l.utilities.serverInfo.regions.ussouth}`,
        "us-west": `:flag_us: ${client.l.utilities.serverInfo.regions.uswest}`,
        "eu-west": `:flag_eu: ${client.l.utilities.serverInfo.regions.euwest}`,
        "vip-us-east": `:flag_us: ${client.l.utilities.serverInfo.regions.vipuseast}`,
        "europe": `:flag_gb: ${client.l.utilities.serverInfo.regions.london}`,
        "amsterdam": `:flag_nl: ${client.l.utilities.serverInfo.regions.amsterdam}`,
        "hongkong": `:flag_hk: ${client.l.utilities.serverInfo.regions.hongkong}`,
        "russia": `:flag_ru: ${client.l.utilities.serverInfo.regions.russia}`,
        "southafrica": `:flag_za: ${client.l.utilities.serverInfo.regions.southAfrica}`
    }
    const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .addField(client.l.utilities.serverInfo.name, message.guild.name, true)
        .addField(client.l.utilities.serverInfo.ID, message.guild.id, true)
        .addField(client.l.utilities.serverInfo.owner, `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
        .addField(client.l.utilities.serverInfo.region, region[message.guild.region], true)
        .addField(client.l.utilities.serverInfo.size, `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
        .addField(client.l.utilities.serverInfo.verification, verifLevels[message.guild.verificationLevel], true)
        .addField(client.l.utilities.serverInfo.channels, message.guild.channels.cache.size, true)
        .addField(client.l.utilities.serverInfo.roles, message.guild.roles.cache.size, true)
        .addField(client.l.utilities.serverInfo.creationDate, `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
        .setThumbnail(message.guild.iconURL())
        .setColor(client.config.colour)
        .setFooter(`${client.l.utilities.serverInfo.informationAbout} ${message.guild.name}\n${client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username)}`)
        .setTimestamp()

    message.channel.send({embed});

}

// © Zeltux Discord Bot | Do Not Copy