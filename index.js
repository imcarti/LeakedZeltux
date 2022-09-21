
/*

Zeltux Notice

Redistributing or leaking Zeltux is a criminal offence
and you can and will be prosecuted for doing it.

Check out our redistribution policy here:
http://zeltux.net/legal.html#redistribution-policy

Find out more about our licensing and terms in
the READ ME file.

*/

let mycatch = false
const { exec } = require('child_process');

// Check for node.js version
let nodeversion = process.version.replace("v", "").split(".")
nodeversion = parseInt(nodeversion[0])
if(nodeversion < 12){ // If the version is less than v12 then throw an error & attempt an update 
  mycatch = true
  console.log("\x1b[31mYou are using an outdated version of node! Please update to the version listed here: https://docs.zeltux.net/zeltux/dependencies.\u001b[0m")
  if(process.platform.includes("linux")){ // On linux an automatic update might work, so try it:
      console.log("\x1b[32mUpdating node...\u001b[0m")
      
      exec('npm cache clean -f', (err, stdout, stderr) => {
        if (err) {
          console.log(err)
          return;
        }
        exec('npm install -g n', (err, stdout, stderr) => {
          if (err) {
            console.log(err)
            return;
          }
          exec('n latest', (err, stdout, stderr) => {
            if (err) {
              console.log(err)
              return;
            }
            console.log(`\x1b[32mNode updated to to the latest version, Updating dependencies (this may take a considerable amount of time)...\u001b[0m`)
            try{
              exec(`rm -rf ${process.cwd()}/node_modules`, (err, stdout, stderr) => {
                if (err) {
                  console.log(err)
                  return;
                }
                exec('npm install', (err, stdout, stderr) => {
                  if (err) {
                    console.log(err)
                    return;
                  }
                  console.log(`\x1b[32mDependencies updated...\u001b[0m`)
                })
              })
            }
            catch{
              exec('npm install', (err, stdout, stderr) => {
                if (err) {
                  console.log(err)
                  return;
                }
                console.log(`\x1b[32mDependencies updated...\u001b[0m`)
            })
            }
          })
        })
      })
  }
  else{ // If not linux then send a manual download link
    console.log("You can download the latest version of node here: https://nodejs.org/en/ then install it like you would any normal program on your PC.\nIf you need help, feel free to join our support server, https://discord.zeltux.net.")
  }
}
else{ // If node.js is up to date, then check if the node_modules match that version, by seeing if better-sqlite3 can be imported 
  try{
    const SQLite = require("better-sqlite3")
  }
  catch{ // If it cannot be, check the OS and perform appropriate actions:
    mycatch = true
    if(process.platform.includes("linux")){ // If linux, update for them
      console.log(`\x1b[31mDetected outdated dependencies!\u001b[0m`)
      console.log(`\x1b[32mUpdating Dependencies (this may take a considerable amount of time)...\u001b[0m`)
      try{
        exec(`rmdir -rf ${process.cwd()}/node_modules`, (err, stdout, stderr) => {
          if (err) {
            console.log(err)
            return;
          }
          exec('npm install', (err, stdout, stderr) => {
            if (err) {
              console.log(err)
              return;
            }
            console.log(`\x1b[32mDependencies updated...\u001b[0m`)
          })
        })
     }
     catch{
        exec('npm install', (err, stdout, stderr) => {
          if (err) {
            console.log(err)
            return;
          }
          console.log(`\x1b[32mDependencies updated...\u001b[0m`)
      })
     }
    }
    else if(process.platform.includes("win")){ // If windows, run the windows-install.bat file
      console.log(`\x1b[31mDetected outdated dependencies!\u001b[0m`)
      try{
        console.log(`\x1b[32mUpdating Dependencies\u001b[0m`)
        console.log(`You will soon be prompted to give access to an administrator CMD, permissions is required.`)
        console.log(`Setup will then be controlled from that. Once complete, start the bot again.`)
        exec(`${process.cwd()}/windows-install.bat`)
      }
      catch{
        console.log(`\x1b[32mYou should run the \x1b[33mwindows-install.bat \x1b[32mfile that comes with zeltux.\u001b[0m`)
        console.log(`Join our Discord server if you need help! https://discord.zeltux.net`)
      }
    }
    else{ // If not linux or windows, manually install them:
      console.log(`\x1b[31mDetected outdated dependencies!\u001b[0m`)
      console.log(`Check out https://docs.zeltux.net/support/troubleshooting/updating-packages or https://discord.zeltux.net for help.`)
    }
  }
}
const fs = require("fs")
if(!fs.existsSync(`${process.cwd()}/addons`)) fs.mkdirSync(`${process.cwd()}/addons`)
if(!fs.existsSync(`${process.cwd()}/data`)) fs.mkdirSync(`${process.cwd()}/data`)
if(!fs.existsSync(`${process.cwd()}/commands/tickets/transcripts`)) fs.mkdirSync(`${process.cwd()}/commands/tickets/transcripts`)

const startup = require(`${process.cwd()}/assets/events/zstartup`)
startup.start()

// © Zeltux Discord Bot | Do Not Copy