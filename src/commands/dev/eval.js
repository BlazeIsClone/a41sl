const Discord = require("discord.js");
const { serverManager, serverOwner } = require("../../../config.json");

module.exports = {
  name: "eval",
  description: "developer only command",
  async execute(message, args) {
    var clean = (text) => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    };

    if (
      message.author.id !== message.guild.owner.id &&
      message.author.id !== serverManager
    ) {
      message.reply(
        `❗Only <@${message.guild.owner.id}> has access to this command`
      );
      return;
    }
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  },
};
