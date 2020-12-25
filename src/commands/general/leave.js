const Discord = require("discord.js");

module.exports = {
    name: "leave",
    description: "Disconnects the bot from your voice channel",
    async execute(message, args) {
        if (!message.member.hasPermission("CONNECT"))
            return message.reply("You do not have the permissions to do that");

        if (message.member.voice.channel) {
            connection = message.member.voice.channel.leave();
        } else {
            message.reply("Im not in this voice channel to leave!");
        }
    },
};
