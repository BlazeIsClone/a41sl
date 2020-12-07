const Discord = require("discord.js");
const { auditLogChannel } = require("../../../config.json");
const { PREFIX } = require("../../../config.json");

module.exports = async (client) => {
  client.on("messageUpdate", async (oldMessage, newMessage) => {
    try {
      if (oldMessage.author.bot) return;
      if (!oldMessage.guild.member(client.user).hasPermission("EMBED_LINKS"))
        return;
      if (
        !oldMessage.guild.member(client.user).hasPermission("MANAGE_MESSAGES")
      )
        return;
      var logChannel = oldMessage.guild.channels.cache.find(
        (c) => c.name === auditLogChannel
      );
      if (!logChannel) return;
      if (oldMessage.content.includes("https://")) return;
      if (oldMessage.content.includes(`${PREFIX}play`)) return;

      let messageUpdate = new Discord.MessageEmbed()
        .setTitle("**MESSAGE EDIT**")
        .setThumbnail(oldMessage.author.avatarURL())
        .setColor("#32CD32")
        .setDescription(
          `**\n**:wrench: Successfully \`\`EDIT\`\` **MESSAGE** In ${oldMessage.channel}\n\n**Channel:** \`\`${oldMessage.channel.name}\`\` (ID: ${oldMessage.channel.id})\n**Message ID:** ${oldMessage.id}\n**Sent By:** <@${oldMessage.author.id}> (ID: ${oldMessage.author.id})\n\n**Old Message:**\`\`\`${oldMessage}\`\`\`\n**New Message:**\`\`\`${newMessage}\`\`\``
        )
        .setTimestamp()
        .setFooter(oldMessage.guild.name, oldMessage.guild.iconURL());
      logChannel.send(messageUpdate);
    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("Error!")
        .setDescription("**Error Code:** *" + err + "*")
        .setTimestamp();
      return logChannel.send(embed);
    }
  });
};
