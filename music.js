require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');
const { msg, args } = require('./bot');

let queueSongs = [];
const musicDetails = {
  voiceChannel: null,
  connection: null
}
let isPaused = false;
const yt_url_prerfix = 'https://www.youtube.com/watch?v=';

const deletesMsg = {
    timeout: 5000,
    reason: "none"
  };

  let lastQueueMessage;
  const embededMsg = new Discord.MessageEmbed()
      .setColor('#7289da')
      .setTitle('SONG QUEUE')
      .setDescription("")

    //Youtube API
  
    /**
     * Sample JavaScript code for youtube.search.list
     * See instructions for running APIs Explorer code samples locally:
     * https://developers.google.com/explorer-help/guides/code_samples#javascript
     */
    const {google} = require('googleapis');
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YT_KEY // specify your API key here
    });
    
    const params = {
      part: 'snippet',
      type: 'video',
      maxResults: 10,
      q: null
    };
    
      async function GetSongLink(params,args) {
        console.log(args);
        params.q = args;
        
        const res = await youtube.search.list(params);
        console.log( "Link: "+ yt_url_prerfix + res.data.items[0].id.videoId)
        return yt_url_prerfix + res.data.items[0].id.videoId;
      };

module.exports = {

joinChannel: async function joinChannel(msg, args){

    let voiceChannel = msg.member.voice.channel;
    if(!voiceChannel){
      return msg.channel.send('you need to be in voice channel');
    }
    msg.channel.send('you are in channel').then(msg => msg.delete(deletesMsg));
    
    //checks to see if song doesnt start with http
    if(!args.startsWith("http")){
      args = await GetSongLink(params,args);
      console.log("Link after: " +args)
    }
  
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
          this.Play(args, musicDetails.voiceChannel, musicDetails.connection, msg);
        }else{
          queueSongs.push(songDetails);
          msg.channel.send("Added song to queue " + queueSongs[queueSongs.length - 1].title)
            .then(msg => msg.delete(deletesMsg));
        }
        this.queueList(msg);
        console.log(args);
        console.log(queueSongs);
        console.log('connected');
      })
      .catch(console.error);
  },
  
queueList: function queueList(msg){
    let counter = 1;
    let des = "";
  
    queueSongs.forEach(song => {
      if(counter > 10)return;
      des = des +"\n"+counter+". "+ song.title;
      counter += 1;
     });
     if(counter == 11) des = des +"\n ...";
  
    console.log(des);
    embededMsg.setDescription(des);
    console.log(lastQueueMessage);
    if(lastQueueMessage != null) lastQueueMessage.then(msg => msg.delete());;
    lastQueueMessage = msg.channel.send(embededMsg);
  },
  
  
Play: async function Play(song, voiceChannel, connection, msg){
    console.log('playing song' + song);
    if(queueSongs.length < 1){
      return voiceChannel.leave();
    }
  
    let stream = ytdl(song);
    stream.on('error', console.error);
    const dispatcher = await connection.play(stream)
      .on('speaking', speakState => {
        if(!speakState && !isPaused){
          console.log('ends song');
          queueSongs.shift();
          if(queueSongs.length < 1)  return voiceChannel.leave();
          console.log(queueSongs);
          
          lastQueueMessage.then(msg => msg.delete());
          this.queueList(msg);
          Play(queueSongs[0].url, voiceChannel, connection,msg);
        };
    });
  },
  
skip:  function skip(msg){
    if(!msg.member.voice) return msg.channel.send('You have to be in a voice channel to stop the music!');
    if(queueSongs.length < 1) return msg.channel.send("There is no song to skip");
    queueSongs.shift();
    this.queueList(msg);
    this.Play(queueSongs[0].url,musicDetails.voiceChannel, musicDetails.connection, msg);
  },
  
pause:  function pause(msg){
    if(queueSongs.length < 1) return msg.channel.send("There is no song to pause");
    isPaused = true;
    musicDetails.connection.dispatcher.pause();
    msg.channel.send("Song Paused!")
  },
  
resume:  function resume(msg){
    if(queueSongs.length < 1) return msg.channel.send("There is no song to resume");
    if(!isPaused) return msg.channel.send("Song is Already Playing!!");
    isPaused = false;
    musicDetails.connection.dispatcher.resume();
    msg.channel.send("Song Resumed!");
  },

clear:  function clear(msg){
    if(queueSongs.length < 1) return msg.send.channel("There is no songs in queue to clear!");
    queueSongs = [];
    musicDetails.voiceChannel.leave();
    if(lastQueueMessage != null) lastQueueMessage.then(msg => msg.delete());
  }
  
};