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
  name: "remove",
  description: "Remove song from the queue",
  execute(message, args) {
    if (
      message.channel.id != musicChannelOne &&
      message.channel.id != musicChannelTwo
    ) {
      return message.author.send(musicChannelErrorResponse);
    }
    const queue = message.client.queue.get(message.guild.id);
    const emptyQueue = new MessageEmbed()
      .setColor(errorColor)
      .setTitle("Empty Queue")
      .setDescription("There is nothing in the queue");

    if (!queue) return message.channel.send(emptyQueue).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    const noArgs = new MessageEmbed()
      .setColor(errorColor)
      .setTitle("Usage")
      .setDescription(`${message.client.prefix}remove <Queue Number>`);

    const NaNer = new MessageEmbed()
      .setColor(errorColor)
      .setTitle("Usage")
      .setDescription(`${message.client.prefix}remove <Queue Number>`);

    if (!args.length) return message.reply(noArgs);
    if (isNaN(args[0])) return message.reply(NaNer);

    const song = queue.songs.splice(args[0] - 1, 1);

    const remov = new MessageEmbed()
      .setColor(primaryColor)
      .setTitle("Song Removed from Queue")
      .setDescription(
        `${message.author} removed **${song[0].title}** from the queue`
      );

    queue.textChannel.send(remov);
  },
};
