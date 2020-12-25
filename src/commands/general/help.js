const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: [],
    description: "All bot commands",
    async execute(client, message, args) {
        const helpEmbed = new MessageEmbed()
            .setColor("#00FF00")
            .addFields(
                {
                    name: "This will help you out!",
                    value: "Use these commands to get command specific help!",
                    inline: true,
                },
                { name: "\u200B", value: "\u200B" },
                {
                    name: "📋   /rules",
                    value: "Community guidelines",
                    inline: true,
                },
                {
                    name: "🎵   /music commands",
                    value: "Music streaming",
                    inline: true,
                },

                {
                    name: "🔞   /nsfw-commands",
                    value: "To get NSFW content",
                    inline: true,
                },
                {
                    name: "🌍   /image",
                    value: "Search google images",
                    inline: true,
                },

                {
                    name: "🏓   /ping",
                    value: "Checks latency with the bot",
                    inline: true,
                },
                {
                    name: "🗃   /botinfo",
                    value: "Bot Server information",
                    inline: true,
                },

                { name: "\u200B", value: "\u200B" },
                {
                    name: "❤   Bot Repository",
                    value: "https://github.com/BlazeIsClone/A41SLBOT",
                }
            )

            .setFooter(
                "All For One Bot is still on alpha stage contribution would be appreciated ❤️"
            )
            .setTimestamp();
        const helpAttachment = new MessageEmbed()
            .setImage("https://i.imgur.com/u8CKoWc.png")
            .setColor("#00FF00");

        await message.author.send(helpAttachment).catch(console.error);
        try {
            message.author.send(helpEmbed).catch(console.error);
        } catch (err) {
            console.log(err);
        }
    },
};
