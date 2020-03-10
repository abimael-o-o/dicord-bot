require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const prefix = '.';
const music = require('./music');

// ready 
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
});

client.login(process.env.DISCORD_TOKEN);

client.on("guildCreate", rdy => { //creates guild 
  rdy.channels
    .create("light", {
      type: "text",
      reason: "Needed a cool new channel"
    })
    .then(chn => chn.send("hello"))
    .catch(console.error);
});

//messages 
client.on("message", msg => {
  
  if (msg.author.bot) return;
  let command = msg.content.split(' ');
  let command_prefix = command.shift();
  let args = command.join(' ');
  
  module.exports = {
    msg: msg,
    args: args
  };
  //if(command[0].startsWith(`${prefix}play`)) joinChannel(msg, client, command[1]);
  if(command_prefix === (`${prefix}play`)) music.joinChannel(msg, args);
  if(command_prefix === (`${prefix}skip`)) music.skip(msg);
  if(command_prefix === (`${prefix}clear`)) music.clear(msg);
  if(command_prefix === (`${prefix}pause`)) music.pause(msg);
  if(command_prefix === (`${prefix}resume`)) music.resume(msg);
  msg.delete(deletesMsg);

  
});


const deletesMsg = {
    timeout: 5000,
    reason: "none"
  };

