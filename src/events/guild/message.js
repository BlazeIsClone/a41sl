const Discord = require("discord.js");
const { PREFIX } = require("../../../config.json");

module.exports = async (client, message) => {
  try {
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

    if (!message.content.startsWith(PREFIX)) return;
    if (!message.member)
      message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (!command) {
      message.channel.send({
        embed: {
          color: 16734039,
          description:
            "That command does not exist, Take a look at " +
            `${PREFIX}` +
            " help!",
        },
      });
    }

    if (command) {
      command.run(client, message, args);
    }
  } catch (err) {
    console.log(err);
    message.channel.send({
      embed: {
        color: 16734039,
        description:
          "That command does not exist, Take a look at " +
          `${PREFIX}` +
          " help!",
      },
    });
  }
};
