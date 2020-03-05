// Run dotenv
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();

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
  .then(console.log)
  .catch(console.error);

});

client.on("message", msg => {

  if(msg.author.bot) return; 

  if (msg.channel.id == 684887506717769766) {
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

  console.log(msg.guild.id);
});

