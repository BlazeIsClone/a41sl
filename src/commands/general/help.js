const { MessageEmbed } = require("discord.js");
const { primaryColor } = require("../../../config.json");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Display all commands and descriptions",
  execute(message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle(`${message.client.user.username} Help`)
      .setDescription("List of all commands")
      .setColor(primaryColor);

    commands.forEach((cmd) => {
      if (cmd.name === "eval") return;
      if (cmd.name === "restart") return;
      if (cmd.name === "reactionRolesGames") return;
      if (cmd.name === "reactionRolesIntro") return;
      if (cmd.name === "reactionRolesNotifications") return;
      if (cmd.name === "reactionRolesRules") return;
      if (cmd.name === "linebreak") return;

      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${
          cmd.aliases ? `(${cmd.aliases})` : ""
        }**`,
        `${cmd.description}`,
        true
      );
    });

    return message.channel.send(helpEmbed).catch(console.error);
  },
};
