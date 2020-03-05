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
      type: "text",
      reason: "Needed a cool new channel"
    })
    .then(chn => chn.send("hello"))
    .catch(console.error);
});

client.on("message", msg => {
  if (msg.author.bot) return;

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
});
