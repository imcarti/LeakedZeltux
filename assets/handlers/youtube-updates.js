const Discord = require("discord.js");
const request = require("request-promise");
const Parser = require("rss-parser");
const Enmap = require("enmap");
let data = new Enmap({ name: "youtube-updates" });
let parser = new Parser();
let ready = 0
module.exports = async client => {
    if (ready === 1) return
    else ready = 1
    let ids = client.config.youtubeChannelIds
    let updatesChannel = client.config.youtubeUpdatesChannel;
    let updateTitle = client.l.events.youtubeUpdates.title;
    let updateDescription = client.l.events.youtubeUpdates.description;
    setInterval(function () {
        let channel = client.findChannel(updatesChannel)
        if (!channel) return client.log("Youtube Updates", "Could not find the youtube updates channel")
        ids.forEach(id => {
            if (id === "") return;
            request(
                "https://www.youtube.com/feeds/videos.xml?channel_id=" + id
            ).then(res => {
                parser.parseString(res).then(async feed => {
                    let items = feed.items;
                    let dat = data.get(id);
                    if (!dat) return data.set(id, items);
                   if (dat[0].id === items[0].id) return
                    items
                        .filter(x => !dat.find(d => d.id === x.id))
                        .forEach(item => {
                            if (item.id === dat[dat.length - 1].id && dat.length > 1)
                                return;
                            channel.send(
                                new Discord.MessageEmbed()
                                    .setTitle(
                                        updateTitle
                                            .replace("%author%", item.author)
                                            .replace("%description%", item.description)
                                            .replace("%link%", item.link)
                                            .replace("%title%", item.title)
                                    )
                                    .setDescription(
                                        updateDescription
                                            .replace("%author%", item.author)
                                            .replace("%description%", item.description)
                                            .replace("%link%", item.link)
                                            .replace("%title%", item.title)
                                    )
                                    .setColor(client.config.colour)
                                    .setFooter(`${client.l.events.youtubeUpdates.description} ${item.pubDate}`)
                            );
                        });
                    data.set(id, items);
                });
            });
        });
    }, 18000000);
}

// © Zeltux Discord Bot | Do Not Copy