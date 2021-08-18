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
  name: "volume",
  aliases: ["v"],
  description: "Change volume of currently playing music",
  execute(message, args) {
    if (
      message.channel.id != musicChannelOne &&
      message.channel.id != musicChannelTwo
    ) {
      return message.author.send(musicChannelErrorResponse);
    }
    const queue = message.client.queue.get(message.guild.id);

    const noQ = new MessageEmbed()
      .setColor(errorColor)
      .setTitle("Empty Queue")
      .setDescription(`There is nothing in the queue`);

    if (!queue) return message.reply(noQ).catch(console.error);
    if (!canModifyQueue(message.member)) {
      const neededVC = new MessageEmbed()
        .setColor(errorColor)
        .setTitle("Error!")
        .setDescription(`You need to join a voice channel first`);

      return message.reply(neededVC).catch(console.error);
    }
    const currentVolume = new MessageEmbed()
      .setColor(primaryColor)
      .setTitle("Volume")
      .setDescription(`The current volume is: **${queue.volume}**`);

    if (!args[0]) return message.reply(currentVolume).catch(console.error);

    const setVolume = new MessageEmbed()
      .setColor(errorColor)
      .setTitle("Input Invalid")
      .setDescription(`Please use a number to set the volume`);

    if (isNaN(args[0])) return message.reply(setVolume).catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message
        .reply("Please use a number between 0 - 100.")
        .catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    const vol = new MessageEmbed()
      .setColor(primaryColor)
      .setTitle("Set!")
      .setDescription(`Volume set to: **${args[0]}%**`);

    return queue.textChannel.send(vol).catch(console.error);
  },
};
