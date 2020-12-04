const Discord = require("discord.js");
const { PREFIX } = require("../../config.json");

module.exports = (client) => {
    client.on("message", async (message) => {
        if (!message.content.startsWith(PREFIX) || message.author.bot) return;
        let args = message.content.slice(PREFIX.length).trim().split(/ +/);
        let command = args.shift().toLowerCase();
        if (command === "leave") {
            if (!message.member.hasPermission("CONNECT"))
                return message.reply(
                    "You do not have the permissions to do that"
                );

            if (message.member.voice.channel) {
                connection = message.member.voice.channel.leave();
            } else {
                message.reply("Im not in this voice channel to leave!");
            }
        }
    });
};
