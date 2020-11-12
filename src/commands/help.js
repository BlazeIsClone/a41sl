const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = (client) => {
    client.on("message", async (message) => {
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
                    name: "🔞   /nsfw commands",
                    value: "To get NSFW content",
                    inline: true,
                },
                {
                    name: "🌍   /google",
                    value: "Search google images",
                    inline: true,
                },

                {
                    name: "🏓   /ping",
                    value: "Checks latency with the bot",
                    inline: true,
                },
                {
                    name: "🗃   /server info",
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
        const helpAttachment = new MessageAttachment(
            "https://i.imgur.com/790FtQS.png"
        );
    });
};
