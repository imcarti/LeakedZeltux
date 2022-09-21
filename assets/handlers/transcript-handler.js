const Discord = require("discord.js")
const fs = require("fs");

module.exports = {

    createEvent: async function(client, message, c, reason){
        fs.appendFile(`${process.cwd()}/commands/tickets/transcripts/transcript-${c.id}.html`, `
        
        <html>

            <head>

                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width">
                <title>Transcript - ticket-${c.id}</title>

            </head>

            <style>

                body {
                    background-color: #bbbbbd;
                    }

                .boxed {
                    border: 1px solid white ;
                    border-radius: 25px;
                    }

                img {
                    border-radius: 50%;
                    width: 50px;
                    padding: 10px;
                    }
                
                p {
                    font-family: "Comic Sans MS", cursive, sans-serif;
                    }

                h1 {
                    font-family: "Comic Sans MS", cursive, sans-serif;
                    }

            </style>

            <body align="middle">
                <h1>
                    <b>${client.config.serverName} Ticket Transcript</b>
                </h1>
                <p>
                    <b>Ticket - </b>#${c.name} <i>(${message.channel.id})</i></br>
                    <b>User - </b>#${message.author.tag} <i>(${message.author.id})</i></br>
                    <b>Opened At - </b>${message.createdAt}</br></br>
                    <b>Reason - </b>${reason}</br>
                </p>
                </br>


        `, function (err) {
            if (err) throw err;
        });
    },
    messageEvent: function(client, message){
        if(!(message.guild === null)) {
      
            if(message.channel.name.startsWith(`ticket-`)){
      
              if (message.embeds.length == 0){
      
                fs.appendFile(`${process.cwd()}/commands/tickets/transcripts/transcript-${message.channel.id}.html`, `
      
                <div class="boxed" align="middle">
      
                  <p>
                    <img src=${message.author.avatarURL()}></br>
      
                  ⠀⠀<b>${message.author.tag}</b></br>
      
                    <i>${message.author.id}</i></br>
                    <i>${message.createdAt}</i></br>
      
                    </br>
                  ⠀⠀${message.content}
      
                  </p>
                  </br>
      
                </div>
      
                </br>
      
                `,function (err) {
                    if (err) throw err
                  }
                
                ) 
      
              }
      
              else {
      
                fs.appendFile(`${process.cwd()}/commands/tickets/transcripts/transcript-${message.channel.id}.html`, `
      
                <div class="boxed" align="middle">
                  <p>
                    <img src=${message.author.avatarURL()}></br>
      
                  ⠀⠀<b>${message.author.tag}</b></br>
                    <i>${message.author.id}</i></br>
                    <i>${message.createdAt}</i></br
                    
                    ></br>
                    <i>Embed:</i></br>
                  ⠀⠀${message.embeds[0].title}</br>
                  ⠀⠀${message.embeds[0].description}
      
                  </p>
                  </br>
      
                </div>
      
                </br>
      
                `, function (err) {
                    if (err) throw err
                  }
      
                )  
      
              }
      
            }
      
        }
    }

}

// © Zeltux Discord Bot | Do Not Copy