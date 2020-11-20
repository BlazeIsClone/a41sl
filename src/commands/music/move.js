require("array.prototype.move");
const { canModifyQueue } = require("../../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "move",
  aliases: ["mv"],
  description: "Move songs to the top of the queue",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    const noQue = new MessageEmbed()
      .setColor(0xda7272)
      .setDescription("There is no queue to move");

    if (!queue) return message.channel.send(noQue).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    const errThrow = new MessageEmbed()
      .setColor(0xda7272)
      .setTitle("Move")
      .setDescription(`Usage: ${message.client.prefix}move <Queue Number>`);

    if (!args.length || isNaN(args[0]))
      return message.reply(errThrow).catch(console.error);

    let songMoved = queue.songs[args[0] - 1];

    queue.songs.move(args[0] - 1, 1);
    const moveQueue = new MessageEmbed()
      .setColor(0xda7272)
      .setTitle("Move")
      .setDescription(
        `${message.author} 📤 moved **${songMoved.title}** to the top of the queue.`
      );

    queue.textChannel.send(moveQueue).catch(console.error);
  },
};
