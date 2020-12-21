const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("CONNECT"))
        return message.reply("You do not have the permissions to do that");

    if (message.member.voice.channel) {
        connection = await message.member.voice.channel.join();
    } else {
        message.reply("You have to be in a voice channel to play music");
    }
};
