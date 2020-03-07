// Run dotenv
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');

let queueSongs = [];

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
  if(command[0].startsWith('.play')) joinChannel(msg, client, command[1]);
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
      if(queueSongs.length < 1){
        queueSongs.push(args);
        Play(args, voiceChannel, connection, msg);
      }else{
        queueSongs.push(args);
      }
      
      console.log(args);
      console.log(queueSongs);
      console.log('connected');
    })
    .catch(console.error);
}

async function Play(song, voiceChannel, connection, msg){
  console.log('playing song' + song);
  if(queueSongs.length < 1){
    return voiceChannel.leave();
  }

  // for(let i = 0; i < queueSongs.length; i++){
  //   listSongs(msg, song);
  // }
  const songInfo = await ytdl.getInfo(song);
  const songDetails = {
    title: songInfo.title,
    url: songInfo.video_url
  };
  
  const embededMsg = new Discord.MessageEmbed()
    .setColor('#7289da')
    .setTitle(songDetails.title)
    .setURL(songDetails.thumbnail)
  msg.channel.send(embededMsg);

  let stream = ytdl(song);
  stream.on('error', console.error);
  const dispatcher = await connection.play(stream)
    .on('speaking', speakState => {
      if(!speakState){
        console.log('ends song');
        queueSongs.shift();
        console.log(queueSongs);
        Play(queueSongs[0], voiceChannel, connection,msg);
      };
  });
}

function listSongs(msg){
  msg.channel.send()

}
  