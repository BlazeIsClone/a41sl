const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const musicChannel = process.env.MUSIC_CHANNEL;

module.exports.run = async (client, message) => {
  if (message.channel.id != musicChannel) {
    return message.author.send(
      "⛔ Music commands are only available in **add-music** channel"
    );
  }

  const queue = message.client.queue.get(message.guild.id);
  const emptyQueue = new MessageEmbed()
    .setColor(0xda7272)
    .setTitle("Empty Queue")
    .setDescription("There is nothing playing");

  if (!queue) return message.channel.send(emptyQueue);
  let lyrics = null;

  try {
    lyrics = await lyricsFinder(queue.songs[0].title, "");
    if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
  } catch (error) {
    lyrics = `No lyrics found for ${queue.songs[0].title}.`;
  }

  let lyricsEmbed = new MessageEmbed()
    .setTitle(`${queue.songs[0].title} — Lyrics`)
    .setDescription(lyrics)
    .setColor("#F8AA2A");

  if (lyricsEmbed.description.length >= 2048)
    lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
  return message.channel.send(lyricsEmbed).catch(console.error);
};
