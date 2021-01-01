const Discord = require("discord.js");
const { PREFIX } = require("../../../config.json");

module.exports = async (client, message) => {
  const queue = new Map();
  if (message.author.bot) return;
  if (!message.guild) return;
  if (
    message.content === `<@${client.user.id}>` ||
    message.content === `<@!${client.user.id}>`
  ) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Hi!`, message.guild.iconURL())
      .setColor("#32CD32")
      .setDescription(
        "I'm " +
          "**" +
          client.user.username +
          "**" +
          "\n" +
          "To see all my commands please type `" +
          PREFIX +
          "help`"
      );
    message.channel.send(embed);
  }
};
