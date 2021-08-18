const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { PREFIX, primaryColor } = require("../../../config.json");

module.exports = {
  name: "delete",
  description: "Delete chat messages",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.reply("You do not have the permissions to do that");

    const amount = parseInt(args[0]) + 1;
    const exRes = new MessageEmbed()
      .setColor(primaryColor)
      .setTitle("Delete Command")
      .setDescription(`Usage: ${PREFIX}delete <number>`);

    if (isNaN(amount)) {
      return message.reply(exRes);
    } else if (amount <= 1 || amount > 100) {
      return message.reply("you need to input a number between 1 and 99.");
    }

    (async () => {
      try {
        message.channel.bulkDelete(amount, true).catch((err) => {
          console.error(err);
          message.channel.send(
            ":warning: Due to Discord rules bots can only bulk delete messages that are under 14 days old."
          );
        });
        message
          .reply(`🗑️ I've deleted \`${amount - 1}\`  messages for you`)
          .then((msg) => {
            msg
              .delete({
                timeout: 5000,
              })
              .catch(console.error);
          })
          .catch(console.error);
      } catch (err) {
        console.log(err);
      }
    })();
  },
};
