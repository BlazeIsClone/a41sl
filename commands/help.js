const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Display all commands and descriptions",
    execute(message) {
        const helpEmbed = new MessageEmbed()
            .setTitle("👋  Hello There! All The Help You Need Is Here")
            .setThumbnail("https://i.imgur.com/wSTFkRM.png")
            .setColor("#00FF00")
            .setFooter(
                "All For One Bot is still on alpha stage contribution would be appreciated ❤️"
            )
            .setTimestamp();
        return message.author.send(helpEmbed).catch(console.error);
    }
};
