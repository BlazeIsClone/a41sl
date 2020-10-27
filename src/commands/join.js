const Discord = require("discord.js");

module.exports = (client) => {
    client.on("message", async (message) => {
        if (message.content === "/join") {
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
            } else {
                message.reply(
                    "You have to be in a voice channel to play music"
                );
            }
        }
    });
};
