const Discord = require("discord.js");
const webhook = require("webhook-discord");
require("dotenv").config();
const webhookUrl = process.env.ANNOUNCEMENTS_WEBHOOK;
const { PREFIX } = require("../../config.json");

module.exports = (client) => {
  client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.content === `${PREFIX}sudo announce`) {
      let msgBody = "Template";
      const Hook = new webhook.Webhook(webhookUrl);

      const msg = new webhook.MessageBuilder()
        .setName("All For One Notifier")
        .setColor("#00FF00")
        .setDescription(msgBody);
      Hook.send(msg);
    }
  });
};

