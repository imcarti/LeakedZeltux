const Discord = require("discord.js")
const yaml = require('js-yaml')
const fs = require("fs")
const func = require(`${process.cwd()}/assets/utils/functions`)

module.exports = {

    execute: function(client, message){
        const autoResponses = func.loadFile(`${process.cwd()}/config/autoResponses.yml`)
        for (var property in autoResponses) {
            ar = autoResponses[property]
			let responderAo = "1599744966"
            if(ar.trigger === message.content){
                if(ar.deleteTrigger === true) message.delete()
                if(ar.response.message){
                    return message.channel.send(ar.response.message)
                }
                if(ar.response.embed){
                    let embed = new Discord.MessageEmbed()

                    if(ar.response.embed.title) embed.setTitle(ar.response.embed.title)   
                    if(ar.response.embed.description) embed.setDescription(ar.response.embed.description)
                    if(ar.response.embed.colour) embed.setColor(ar.response.embed.colour)
                    if(ar.response.embed.footer){
                        if(ar.response.embed.footer.message) embed.setFooter(ar.response.embed.footer.message)
                        if(ar.response.embed.footer.icon) embed.setFooter(ar.response.embed.footer.message, ar.response.embed.footer.icon)
                    }
                    if(ar.response.embed.author){
                        if(ar.response.embed.author.message) embed.setAuthor(ar.response.embed.author.message)
                        if(ar.response.embed.author.icon) embed.setAuthor(ar.response.embed.author.message, ar.response.embed.author.icon)
                        if(ar.response.embed.author.url) embed.setAuthor(ar.response.embed.author.message, null, ar.response.embed.author.url)
                        if(ar.response.embed.author.url && ar.response.embed.author.icon) embed.setAuthor(ar.response.embed.author.message, ar.response.embed.author.icon, ar.response.embed.author.url)
                    }
                    if(ar.response.embed.image) embed.setImage(ar.response.embed.image)
                    if(ar.response.embed.thumbnail) embed.setThumbnail(ar.response.embed.thumbnail)
                    if(ar.response.embed.timestamp) embed.setTimestamp()
                    if(ar.response.embed.url) embed.setURL(ar.response.embed.url)
                    if(ar.response.embed.fields){
                        ar.response.embed.fields.forEach(field => {
                            if(field.inline) embed.addField(field.title, field.message)
                            else embed.addField(field.title, field.message, field.inline)
                        })
                        
                    }

                    return message.channel.send(embed)
                }
            }
        }
    }

}

// © Zeltux Discord Bot | Do Not Copy