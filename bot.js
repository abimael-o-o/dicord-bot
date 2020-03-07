// Run dotenv
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');
const prefix = '.';

let queueSongs = [];
const musicDetails = {
  voiceChannel: null,
  connection: null
}
let isPaused = false;

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
  if(command[0].startsWith(`${prefix}play`)) joinChannel(msg, client, command[1]);
  if(command[0].startsWith(`${prefix}skip`)) skip(msg);
  if(command[0].startsWith(`${prefix}clear`)) clear(msg);
  if(command[0].startsWith(`${prefix}pause`)) pause(msg);
  if(command[0].startsWith(`${prefix}resume`)) resume(msg);
  msg.delete(deletesMsg);
});


const deletesMsg = {
    timeout: 5000,
    reason: "none"
  };

async function joinChannel(msg, bot, args){

  let voiceChannel = msg.member.voice.channel;
  if(!voiceChannel){
    return msg.channel.send('you need to be in voice channel');
  }
  msg.channel.send('you are in channel');

  const songInfo = await ytdl.getInfo(args);
  const songDetails = {
    title: songInfo.title,
    url: songInfo.video_url
  };
  voiceChannel.join()
    .then(connection => {
      if(queueSongs.length < 1){
        queueSongs.push(songDetails);
        musicDetails.connection = connection;
        musicDetails.voiceChannel = voiceChannel;
        Play(args, musicDetails.voiceChannel, musicDetails.connection, msg);
      }else{
        queueSongs.push(songDetails);
        msg.channel.send("Added song to queue" + queueSongs[queueSongs.length - 1].title);
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

  const embededMsg = new Discord.MessageEmbed()
    .setColor('#7289da')
    .setTitle(queueSongs[0].title)
    .setURL(queueSongs[0].url)
  msg.channel.send(embededMsg);

  let stream = ytdl(song);
  stream.on('error', console.error);
  const dispatcher = await connection.play(stream)
    .on('speaking', speakState => {
      if(!speakState && !isPaused){
        console.log('ends song');
        queueSongs.shift();
        console.log(queueSongs);
        Play(queueSongs[0], voiceChannel, connection,msg);
      };
  });
}

function skip(msg){
  if(!msg.member.voice) return msg.channel.send('You have to be in a voice channel to stop the music!');
  if(queueSongs.length < 1) return msg.channel.send("There is no song to skip");
  queueSongs.shift();
  Play(queueSongs[0].url,musicDetails.voiceChannel, musicDetails.connection, msg);
}

function pause(msg){
  if(queueSongs.length < 1) return msg.channel.send("There is no song to pause");
  isPaused = true;
  musicDetails.connection.dispatcher.pause();
  msg.channel.send("Song Paused!")
}

function resume(msg){
  if(queueSongs.length < 1) return msg.channel.send("There is no song to resume");
  if(!isPaused) return msg.channel.send("Song is Already Playing!!");
  isPaused = false;
  musicDetails.connection.dispatcher.resume();
  msg.channel.send("Song Resumed!");
}
function clear(msg){
  if(queueSongs.length < 1) return msg.send.channel("There is no songs in queue to clear!");
  queueSongs = [];
  Play(queueSongs[0].url,musicDetails.voiceChannel, musicDetails.connection, msg);
}
  