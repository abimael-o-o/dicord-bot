// Run dotenv
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

client.on("guildCreate", rdy => {
  rdy.channels
    .create("light", {
      type: "text",
      reason: "Needed a cool new channel"
    })
    .then(chn => chn.send("hello"))
    .catch(console.error);
});

client.on("message", msg => {
  if (msg.author.bot) return;

  if(msg.content === '.join') joinChannel(msg, client, msg.content);
    msg.delete(deletesMsg);
});


const deletesMsg = {
    timeout: 5000,
    reason: "none"
  };

function joinChannel(msg, bot, args){
  let voiceChannel = msg.member.voice.channel;
  if(!voiceChannel){
    return msg.channel.send('you need to be in voice channel');
  }
  msg.channel.send('you are in channel');
  voiceChannel.join()
    .then(connection => {
      connection.play(ytdl('https://www.youtube.com/watch?v=W0PJ86_GhFY&list=RDMMW0PJ86_GhFY&start_radio=1', { quality: 'highestaudio' }));
      console.log('connected');
    })
    .catch(console.error);
}
    
  