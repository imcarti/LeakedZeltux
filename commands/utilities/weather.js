const Discord = require("discord.js");
const weather = require("weather-js")

exports.run = async (client, message, args) => {
    message.delete()

    weather.find({search: args.join(" "), degreeType: 'C'}, async function (err, result) { 
    if (result === undefined || result.length === 0) {return client.missingArguments(client.command, client.l.utilities.weather.usage)}

    var current = result[0].current
    var location = result[0].location

    const weatherembed = new Discord.MessageEmbed()
        .setDescription(`😎 **${current.skytext}**`)
        .setAuthor(client.l.utilities.weather.weather.replace('%LOCATION%', current.observationpoint))
        .setThumbnail(current.imageUrl) 
        .setColor(client.config.colour)
        .addField(client.l.utilities.weather.timezone, `UTC${location.timezone}`, true)
        .addField(client.l.utilities.weather.degreeType, location.degreetype, true) 
        .addField(client.l.utilities.weather.temperature, `${current.temperature} ${client.l.utilities.weather.degrees}`, true)
        .addField(client.l.utilities.weather.feelsLike, `${current.feelslike} ${client.l.utilities.weather.degrees}`, true)
        .addField(client.l.utilities.weather.winds, current.winddisplay, true)
        .addField(client.l.utilities.weather.humidity, `${current.humidity}%`, true)
        .setFooter(client.l.utilities.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))
    
    message.channel.send(weatherembed)})

}

// © Zeltux Discord Bot | Do Not Copy