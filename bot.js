// Run dotenv
require("dotenv").config();
const { Client } = require("discord.js");
const { ErelaClient } = require("erela.js");

const Discord = require("discord.js");
const client = new Discord.Client();
const nodes = [
  {
    host: "localhost",
    port: 2333,
    password: "youshallnotpass"
  }
];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  //Erila stuff
  client.music = new ErelaClient(client, nodes);
  // Listens to events.
  client.music.on("nodeConnect", node => console.log("New node connected"));
  client.music.on("nodeError", (node, error) =>
    console.log(`Node error: ${error.message}`)
  );
  client.music.on("trackStart", (player, track) =>
    player.textChannel.send(`Now playing: ${track.title}`)
  );
  client.music.on("queueEnd", player => {
    player.textChannel.send("Queue has ended.");
    client.music.players.destroy(player.guild.id);
  });
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

  play(client, msg, msg.content);

  if (msg.channel.name === "light") {
    msg.delete(deletesMsg);
  }
});

const deletesMsg = {
  timeout: 5000,
  reason: "none"
};

async function play(bot, message, args) {
  const voiceChannel = message.member.voice.channel;
  console.log(voiceChannel);
  if (!voiceChannel)
    return message.channel.send("you need to be in voice channel!");
  if (message.content.startsWith(".play")) {
    // Spawns a player and joins the voice channel.
    const player = bot.music.players.spawn({
      guild: message.guild,
      voiceChannel: voiceChannel,
      textChannel: message.channel
    });

    // Searches Youtube with your query and the requester of the track(s).
    // Returns a SearchResult with tracks property.
    let link = args.split(" ");
      link.shift();
      link = link.join(" ");
    console.log(link);
    const res = await bot.music.search(link, message.author);

    // Adds the first track to the queue.
    player.queue.add(res.tracks[0]);
    message.channel
      .send(`Queue ${res.tracks[0].title}.`)
      .then(songDel => songDel.delete(deletesMsg));

    // Plays the player (plays the first track in the queue).
    // The if statement is needed else it will play the current track again
    if (!player.playing) player.play();
  }
}
