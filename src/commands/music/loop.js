const { canModifyQueue } = require("../../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");
const {
  musicChannelOne,
  musicChannelTwo,
  musicChannelErrorResponse,
  primaryColor,
  errorColor,
} = require("../../../config.json");

module.exports = {
  name: "loop",
  aliases: ["l"],
  description: "Toggle music loop",
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
      .setTitle("Empty Queue")
      .setDescription("There is nothing playing");

    if (!queue) return message.reply(emptyQueue);
    if (!canModifyQueue(message.member)) return;

    queue.loop = !queue.loop;
    const loop = new MessageEmbed()
      .setColor(primaryColor)
      .setTitle("Loop")
      .setDescription(
        `Loop is now set to ${queue.loop ? "**on**" : "**off**"}`
      );
    return queue.textChannel.send(loop);
  },
};
