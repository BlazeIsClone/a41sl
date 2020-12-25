const Discord = require("discord.js");
const webhook = require("webhook-discord");
const { PREFIX } = require("../../../config.json");
require("dotenv").config();
const webhookID = process.env.WEBHOOK_ID;
const webhookToken = process.env.WEBHOOK_TOKEN;

module.exports = {
  name: "announce",
  description: "Sends an announcement to a channel",
  async execute(message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.reply("You do not have the permissions to do that");

    const webhookClient = new Discord.WebhookClient(webhookID, webhookToken);
    const msgArgs = message.content.slice(1).trim().split(" ");
    var announcement = "";
    for (const word in args) {
      announcement = args + "᲼";
    }
    webhookClient.send(announcement).catch(console.error);
    message.author.send("**Announcement status: sent**");
  },
};
