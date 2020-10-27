const Discord = require("discord.js");

module.exports = (client) => {
    client.on("message", async (message) => {
        if (message.content === "/leave") {
            if (message.member.voice.channel) {
                connection = message.member.voice.channel.leave();
            } else {
                message.reply(
                    "You have to be in a voice channel to play music"
                );
            }
        }
    });
};
