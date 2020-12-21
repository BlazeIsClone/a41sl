const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  let seconds = Math.floor(message.client.uptime / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  const uptimeR = new MessageEmbed()
    .setColor(0x7289da)
    .setTitle("Uptime Duration")
    .setDescription(
      `**${days}** day(s), **${hours}** hours, **${minutes}** minutes, **${seconds}** seconds`
    );

  return message.reply(uptimeR).catch(console.error);
};
