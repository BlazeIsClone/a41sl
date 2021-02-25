const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Display all commands and descriptions",
  execute(message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle(`${message.client.user.username} Help`)
      .setDescription("List of all commands")
      .setColor("#00FF00");

    commands.forEach((cmd) => {
      if (cmd.name === "eval") return;
      if (cmd.name === "restart") return;
      if (cmd.name === "help") return;

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
