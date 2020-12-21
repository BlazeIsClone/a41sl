const Discord = require("discord.js");
const webhook = require("webhook-discord");
require("dotenv").config();
const webhookUrl = process.env.ANNOUNCEMENTS_WEBHOOK;

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.reply("You do not have the permissions to do that");

  let msgBody = "YourMSG";
  const Hook = new webhook.Webhook(webhookUrl);

  const msg = new webhook.MessageBuilder()
    .setName("All For One Notifier")
    .setColor("#00FF00")
    .setDescription(msgBody);
  Hook.send(msg);
  message.author.send("Announcement Status: **connected**")
};
