const { canModifyQueue } = require("../../util/Util");
const { MessageEmbed } = require("discord.js");
const {
  musicChannelOne,
  musicChannelTwo,
  musicChannelErrorResponse,
  primaryColor,
  errorColor,
} = require("../../../config.json");

module.exports = {
  name: "pause",
  description: "Pause the currently playing music",
  execute(message) {
    if (
      message.channel.id != musicChannelOne &&
      message.channel.id != musicChannelTwo
    ) {
      return message.author.send(musicChannelErrorResponse);
    }
    const queue = message.client.queue.get(message.guild.id);
    const emptyQueue = new MessageEmbed()
      .setColor(errorColor)
      .setTimestamp()
      .setTitle("Empty Queue")
      .setDescription("There is nothing playing");

    if (!queue) return message.reply(emptyQueue).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      const paused = new MessageEmbed()
        .setColor(primaryColor)
        .setTimestamp()
        .setTitle("Paused")
        .setDescription(`${message.author} ⏸ paused the music`);

      return queue.textChannel.send(paused).catch(console.error);
    }
  },
};
