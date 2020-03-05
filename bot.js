// Run dotenv
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
let rdyGuild;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

client.on("guildCreate", rdy => {

  rdy.channels
   .create("light", { 
    type: 'text',
/*    permissionOverwrites: [
      {
        id: rdy.id,
        deny: ['VIEW_CHANNEL'],
      },
    ],*/
    reason: "Needed a cool new channel" })
  .then(console.log("created a channel"))
  .catch(console.error);
 // console.log(botChannel);
  rdyGuild = rdy;
 const botchannel = rdy.channels.cache.find(ch => ch.name === 'light');
  
 console.log( "Redy "+ botchannel);

 botchannel.send('hello!')
 .then(console.log("error"))
 .catch(console.error);

});

client.on("message", msg => {

  if(msg.author.bot) return; 

  if (msg.channel.name === "light") {
    if (msg.content === "ping") {
      msg.reply("pong").then(bot_msg => {
        bot_msg.delete(deletesMsg);
      });

      const deletesMsg = {
        timeout: 5000,
        reason: "none"
      };
      msg.delete(deletesMsg);
    }
  }
  const botchannel = msg.guild.channels.cache.find(ch => ch.name === 'light');
  console.log("message " +botchannel);
  botchannel.send('hello!')
  .then(console.log)
  .catch(console.error);

  const botcnnel = rdyGuild.channels.cache.find(ch => ch.name === 'light');
  console.log(botcnnel);
  console.log(rdyGuild);
});

