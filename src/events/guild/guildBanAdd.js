const Discord = require("discord.js");
const {
  auditLogChannel,
  primaryColor,
  errorColor,
} = require("../../../config.json");

module.exports = async (client, guild, user) => {
  try {
    if (!guild.member(client.user).hasPermission("EMBED_LINKS")) return;
    if (!guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
    var logChannel = guild.channels.cache.find(
      (c) => c.name === auditLogChannel
    );
    if (!logChannel) return;
    guild.fetchAuditLogs().then((logs) => {
      var userID = logs.entries.first().executor.id;
      var userAvatar = logs.entries.first().executor.avatarURL();
      if (userID === client.user.id) return;
      let banInfo = new Discord.MessageEmbed()
        .setTitle("**BAN**")
        .setThumbnail(userAvatar)
        .setColor(errorColor)
        .setDescription(
          `**\n**:airplane: Successfully \`\`BANNED\`\` **${user.username}** From the server!\n\n**User:** <@${user.id}>\n**By:** <@${userID}>`
        )
        .setTimestamp()
        .setFooter(guild.name, guild.iconURL());
      logChannel.send(banInfo);
    });
  } catch (err) {
    let embed = new Discord.MessageEmbed()
      .setColor(errorColor)
      .setTitle("Error!")
      .setDescription("**Error Code:** *" + err + "*")
      .setTimestamp();
    return logChannel.send(embed);
  }
};
