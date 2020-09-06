const Discord = require("discord.js");
const addRolesEmbed = new Discord.MessageEmbed()

    .setColor("#0099ff")
    .setTitle(
        "React to this message with the following emotes to recive alearts."
    )
    .addFields(
        {
            name: "​",
            value: "​"
        },
        {
            name: "🔔 • Live Streams Aleart!",
            value: "​"
        },
        {
            name: " 🏷 • Game Giveaways!",
            value: "​"
        },
        {
            name: "📈 • league of Legends Updates",
            value: "​"
        },
        {
            name: "📦 • Minecraft Updates",
            value: "​"
        },
        {
            name: "📰 • Wired Magazine Subscription",
            value: "​"
        }
    );

module.exports = addRolesEmbed;
