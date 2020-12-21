const { canModifyQueue } = require("../../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");
const musicChannel = process.env.MUSIC_CHANNEL;

module.exports.run = async (client, message, args) => {
  if (message.channel.id != musicChannel) {
    return message.author.send(
      "⛔ Music commands are only available in **add-music** channel"
    );
  }

  const queue = message.client.queue.get(message.guild.id);
  const emptyQueue = new MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle("Empty Queue")
    .setDescription("There is nothing playing");

  if (!queue) return message.reply(emptyQueue).catch(console.error);
  if (!canModifyQueue(message.member)) return;

  if (queue.playing) {
    queue.playing = false;
    queue.connection.dispatcher.pause(true);
    const paused = new MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setTitle("Paused")
      .setDescription(`${message.author} ⏸ paused the music`);

    return queue.textChannel.send(paused).catch(console.error);
  }
};
